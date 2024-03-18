import { api } from '../api';

const CreateConversation = (ownerId: string, reservationId: string) => {
    return api.post('/chat/create',{ownerId, reservationId})
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {

        })
}

const GetConversationOfUser = (userId: string) => {
    return api.get(`/chat/conversation-of-user/${userId}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {

        })
}
const GetConversationById = (id: string) => {
    return api.get(`/chat/conversation/${id}`)
        .then((res) => {
            return res.data.data
        })
        .catch((error) => {

        })
}
export {
    CreateConversation,
    GetConversationOfUser,
    GetConversationById
}