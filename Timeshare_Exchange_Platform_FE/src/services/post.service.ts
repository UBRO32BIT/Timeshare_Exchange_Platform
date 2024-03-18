import { api } from '../api';

const UploadPost = async (data: any) => {
    return api.post('/timeshare/upload', data)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching resort by ID:', error.response.data.status.message);
            throw Error(error.response.data.status.message); // Re-throw the error to let the caller handle it if needed
        })
}
const GetPost = async () => {
    return api.get('/timeshare')
        .then((res) => {
            return res.data.data.results
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching posts:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}
const GetPostById = (timeshareId: string) => {
    return api.get(`/timeshare/${timeshareId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 404) {
                    throw Error("Timeshare not found!")
                }
                else if (error.response.status >= 500) {
                    throw Error("Server Error");
                }
            }
            throw error;
        })
}
const GetPostBelongToOwner = (userId: string) => {
    return api.get(`/timeshare/current-owner/${userId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching resort by ID:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}


const GetTimeshareExchangeByCurrentOwner = (userId: string) => {
    return api.get(`/timeshare/exchange/${userId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching resort by ID:', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}

const UploadReview = async (data: any) => {
    return api.post('/review', data)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            throw Error(error.response.data)
        })
}

const GetReviewByResortId = async (resortId: string) => {
    return api.get(`/review/resort/${resortId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            throw Error(error.response.data)
        })
}

const CountUploadTimeshareByUser = async(userId: string) => {
    return api.get(`/servicePack/${userId}`)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        throw Error(error.response.data)
    })
}

export {
    UploadPost,
    GetPost,
    GetPostById,
    GetPostBelongToOwner,
    GetTimeshareExchangeByCurrentOwner,
    UploadReview,
    GetReviewByResortId,
    CountUploadTimeshareByUser
}