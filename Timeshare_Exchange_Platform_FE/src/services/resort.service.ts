import { api } from '../api';

const GetResort = () => {
    return api.get('/resort')
        .then((res) => {
            return res.data.data.results
        })
        .catch((error) => {

        })
}
const GetResortById = async (id: string) => {
    try {
        const response = await api.get(`/resort/${id}`);
        return response.data.data;
    } catch (error) {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching resort by ID:', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    }
}

export {
    GetResort,
    GetResortById
}