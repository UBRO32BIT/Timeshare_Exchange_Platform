import {api} from '../api';

const MakeReservation = (type: string, data: any) => {
    return api.post(`/reservation/create?type=${type}`, data)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            throw error.response.data.status; // Re-throw the error to let the caller handle it if needed
        })
}

const ExecutePayPalPayment = (data: any) => {
    return api.post('/payment/execute-paypal-payment', data)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching resort by ID:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}
const GetReservationById = (reservationId: any) => {
    return api.get(`/reservation/${reservationId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching resort by ID:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}
const GetReservationOfUser = (userId: any) => {
    return api.get(`/reservation/of-user/${userId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const GetExchangeOfUser = (userId: any) => {
    return api.get(`/exchange/of-user/${userId}`)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        console.error('Error fetching resort by ID:', error);
        throw error;
    })
}
const GetReservationOfPost = (postId: any) => {
    return api.get(`/reservation/of-post/${postId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const GetRentRequestOfTimeshare = (timeshareId: any) => {
    return api.get(`/reservation/of-timeshare/${timeshareId}?type=rent`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const ConfirmReservation = (reservationId: any) => {
    return api.patch(`/reservation/${reservationId}/confirm`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const GetTripOfUser = (userId: any) => {
    return api.get(`/trip/of/${userId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const ConfirmReservationByToken = (reservationId: any, token: any) => {
    return api.patch(`/reservation/${reservationId}/confirm?token=${token}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const AcceptReservationByOwner = (reservationId: any) => {
    return api.patch(`/reservation/${reservationId}/accept`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const DenyReservationByOwner = (reservationId: any) => {
    return api.patch(`/reservation/${reservationId}/deny`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const MakeExchange = (timeshareId: any, exchangeData: any) => {
    return api.post(`/exchange/${timeshareId}`, exchangeData)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error making reservation:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}
const GetExchangeRequestOfTimeshare = (timeshareId: any) => {
    return api.get(`/exchange/of-post/${timeshareId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const GetExchangeById = (exchangeId: any) => {
    return api.get(`/exchange/${exchangeId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching resort by ID:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}


const AcceptExchangeByOwner = (exchangeId: any) => {
    return api.patch(`/exchange/${exchangeId}/accept`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const CreatePayPalPayment = (reservation: any) => {
    return api.post(`/payment/create-paypal-payment`, reservation)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const CancelExchangeByOwner = (exchangeId: any) => {
    return api.patch(`/exchange/${exchangeId}/cancel`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const GetOrderPaymentInfo = (userId: string, reservationId: string) => {
    return api.get(`/payment/${userId}/${reservationId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const CancelMyExchangeRequest = (exchangeId: any) => {
    return api.put(`/exchange/canceled/${exchangeId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}
const CancelMyRentalRequest = (reservationId: any) => {
    return api.put(`/reservation/canceled/${reservationId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const DeleteTimeshareByOwner = (timeshareId: any) => {
    return api.delete(`/timeshare/${timeshareId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const DeleteMyExchangeRequest = (exchangeId: any) => {
    return api.delete(`/exchange/${exchangeId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}

const DeleteMyRentalRequest = (reservationId: any) => {
    return api.delete(`/reservation/${reservationId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            console.error('Error fetching resort by ID:', error);
            throw error;
        })
}


export {
    MakeReservation,
    GetReservationById,
    ExecutePayPalPayment,
    GetReservationOfUser,
    GetReservationOfPost,
    GetExchangeRequestOfTimeshare,
    GetRentRequestOfTimeshare,
    ConfirmReservation,
    GetTripOfUser,
    ConfirmReservationByToken,
    AcceptReservationByOwner,
    DenyReservationByOwner,
    CreatePayPalPayment,
    GetOrderPaymentInfo,
    MakeExchange,
    GetExchangeById,
    AcceptExchangeByOwner,
    CancelExchangeByOwner,
    GetExchangeOfUser,
    CancelMyExchangeRequest,
    DeleteTimeshareByOwner,
    CancelMyRentalRequest,
    DeleteMyExchangeRequest,
    DeleteMyRentalRequest
}