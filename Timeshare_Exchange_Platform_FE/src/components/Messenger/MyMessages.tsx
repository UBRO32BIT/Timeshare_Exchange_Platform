import * as React from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import {ChatProps} from '../types';
// import {chats} from '../data';
import io from "socket.io-client";
import {RootState} from "../../features/auth/auth.slice";
import {useSelector} from "react-redux";
import {CreateConversation, GetConversationOfUser} from '../../services/chat.service';

const socket = io('http://localhost:8080/');

export default function MyProfile() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [chatList, setChatList] = React.useState<any>(null);
    const [selectedChat, setSelectedChat] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<any>(true);
    async function Load() {
        try {
            const chatList = await GetConversationOfUser(user?._id);
            console.log(chatList);
            if (chatList) {
                setChatList(chatList);
                setSelectedChat(chatList[0])
                setLoading(false)
            }
        } catch (err: any) {

        }
    }

    React.useEffect(() => {
        Load()
        console.log(chatList)
    }, [loading === true])
    return (
        <Sheet
            sx={{
                flex: 1,
                overflow: 'hidden',
                width: '100%',
                p: 0,
                mx: 'auto',
                // pt: {xs: 'var(--Header-height)', sm: 0},
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'minmax(min-content, min(30%, 400px)) 1fr',
                },
            }}
        >
            <Sheet
                sx={{
                    position: {xs: 'fixed', sm: 'sticky'},
                    transform: {
                        xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
                        sm: 'none',
                    },
                    transition: 'transform 0.4s, width 0.4s',
                    zIndex: 100,
                    width: '100%',
                    top: 52,
                }}
            >
                {chatList &&
                    <ChatsPane
                        chats={chatList}
                        selectedChatId={selectedChat?._id}
                        setSelectedChat={setSelectedChat}
                        socket={socket}
                    />
                }

            </Sheet>
            {chatList?.length > 0 &&
            <MessagesPane chat={selectedChat} socket={socket}/>}
        </Sheet>
    )
        ;
}
