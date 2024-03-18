import {api} from '../api';

const SendConfirmReservationEmail = async (reservation: any) => {
    try {
        const res = await api.post('/email/send-confirm-reservation-email', reservation);
        return res.data;
    } catch (error) {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching resort by ID:', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    }
}
const RequestPasswordReset = async (data: any) => {
    try {
        const res = await api.post('/email/request-password-reset', data);
        return res.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export {
    SendConfirmReservationEmail,
    RequestPasswordReset,
}