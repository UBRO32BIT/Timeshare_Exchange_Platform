import { api } from '../api';
import {
    createSessionCookies,
    getRefreshToken,
    getToken,
    removeSessionCookies
} from '../utils/tokenCookies'

export interface LoginData {
    username: String;
    password: String;
}
export interface RegisterData {
    firstName: String;
    lastName: String;
    username: String;
    password: String;
    repeatPassword: String;
    email: String
}

const RegisterWithCredentials = (data: RegisterData) => {
    return api.post('/auth/register', data)
        .then((res) => {
            if (res) {
                const token = res.data.tokens.access.token;
                const refreshToken = res.data.tokens.refresh.token;
                createSessionCookies({token, refreshToken});
                console.log(res.data);
                return res.data;
            }
        })
        .catch((error) => {
            throw Error(error.response.data)
        })
        
}
const LoginWithUsernameAndPassword = (data: LoginData) => {
    return api.post('/auth/login', data)
        .then((res) => {
            const responseData = res.data;
            if (responseData) {
                const token = responseData.data.tokens.access.token
                const refreshToken = responseData.data.tokens.refresh.token
                createSessionCookies({ token, refreshToken });
                return responseData;
            }
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    throw Error("Wrong username or password!")
                }
                else if (error.response.status > 500) {
                    throw Error("Server Error");
                }
            }
            
            throw error;
        })
}
const UpdateUser = (id: string, data: any) => {
    return api.post(`/user/update/${id}`, data)
        .then((res)=>{
            return res.data;
        })
        .catch((err)=>{
            console.log(err);
            throw err;
        })
}
const SendEmailVerification = async () => {
    return api.get(`/email/send-verification-email`)
        .then((res) => {
            return res.data;
        })
        .catch((err)=> {
            console.log(err);
            throw err;
        })
}
const CheckEmailToken = async (token: string) => {
    return api.get(`/email/verify-email/?token=${token}`)
        .then((res) => {
            return res.data;
        })
        .catch((err)=> {
            console.log(err);
            throw err;
        })
}
const ChangePassword = async (data: any) => {
    return api.post(`/user/change-password`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    throw Error("Wrong password!")
                }
                else if (error.response.status > 500) {
                    throw Error("Server Error");
                }
            }
            throw error;
        })
}
const ResetPasswordByToken = async (data: any) => {
    return api.post(`/email/reset-password`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            if (error.response.status === 400) {
                throw Error(error.message)
            }
            if (error.response.status > 500) {
                throw Error("Server Error" + error.message);
            }
            throw error;
        })
}
const CreateVNPay = (data: any) => {
    return api.post(`/payment/create-payment-vnpay`, data)
        .then((res)=>{
            return res.data.data;
        })
        .catch((err)=>{
            return err
        })
}

const VNPayReturn = (userId: any, data: any) => {
    return api.get(`/payment/${userId}/vnpay_return?${data}`, { params: data }) // Use `params` to pass data as query parameters
        .then((res)=>{
            return res.data; // Response data doesn't need to be accessed via `data.data`
        })
        .catch((err)=>{
            throw err; // Rethrow the error to handle it in the component
        });
};
export {
    RegisterWithCredentials,
    LoginWithUsernameAndPassword,
    UpdateUser,
    SendEmailVerification,
    CheckEmailToken,
    ChangePassword,
    ResetPasswordByToken,
    CreateVNPay,
    VNPayReturn
}