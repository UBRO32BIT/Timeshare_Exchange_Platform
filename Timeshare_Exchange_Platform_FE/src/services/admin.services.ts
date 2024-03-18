import { api } from '../api';
const GetAllAccount = async (search: any, pageNumber: any, role: any) => {
    return api.get(`/user?page=${pageNumber}&role=${role}&username=${search}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {
            // Handle errors here, you might want to log or show a user-friendly message
            console.error('Error fetching accounts: ', error);
            throw error; // Re-throw the error to let the caller handle it if needed
        })
}
const GetAllRequest = () => {
    return api.get('/admin/request-list')
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching requests: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const GetAllResort = async (search: string, page: any) => {
    return api.get(`/resort?search=${search}&page=${page}`)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching resorts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const GetAllPost = () => {
    return api.get('/admin/post-list')
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const GetUserById = (id: string) => {
    return api.get('/user/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const BanUser = async (id: string) => {
    return api.get('/admin/ban-account/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const UnbanUser = async (id: string) => {
    return api.get('/admin/unban-account/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const RestoreAccount = (id: string) => {
    return api.get('/admin/restore-account/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const ShowBannedAccount = () => {
    return api.get('/admin/show-banned-accounts')
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const DeleteAccount = (id: string) => {
    return api.delete('/admin/delete-account' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const GetAllDeletedAccount = () => {
    return api.get('/admin/deleted-account-list')
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const ForceDeleteAccount = (id: string) => {
    return api.get('/admin/force-delete-account/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const AcceptRequest = (id: string) => {
    return api.get('/admin/accept-request/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const ShowPendingRequest = () =>{
    return api.get('/admin/pending-request')
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const CancelRequest = (id: string) => {
    return api.get('/admin/cancel-request/' + id)
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
const ReportBalance = () => {
    return api.get('/admin/report-balance')
    .then((res) => {
        return res.data.data
    })
    .catch((error) => {
        // Handle errors here, you might want to log or show a user-friendly message
        console.error('Error fetching posts: ', error);
        throw error; // Re-throw the error to let the caller handle it if needed
    })
}
export{
    GetAllAccount,
    GetAllRequest,
    GetAllResort,
    GetAllPost,
    GetUserById,
    BanUser,
    UnbanUser,
    RestoreAccount,
    ShowBannedAccount,
    DeleteAccount,
    GetAllDeletedAccount,
    ForceDeleteAccount,
    AcceptRequest,
    ShowPendingRequest,
    CancelRequest,
    ReportBalance
}