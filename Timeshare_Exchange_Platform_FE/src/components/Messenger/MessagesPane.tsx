import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import {ChatProps, MessageProps} from '../types';
import {CreateConversation} from '../../services/chat.service'
import {useSelector} from "react-redux";
import {RootState} from "../../features/auth/auth.slice";

type MessagesPaneProps = {
    chat: ChatProps;
    socket: any;
};

export default function MessagesPane(props: MessagesPaneProps) {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const {chat, socket} = props;
    const [chatMessages, setChatMessages] = React.useState(chat.messages);
    const [textAreaValue, setTextAreaValue] = React.useState('');
    const opponent = chat.participants.find(participant => participant._id !== user._id);
    async function HandleSendMessage() {
        try {
            const message = {
                conversationId: chat._id,
                sender: user?._id,
                content: textAreaValue,
                images: null,
                timestamp: new Date(),
            }
            socket.emit('send-message', message);
        } catch (err: any) {

        }

    }
    
    React.useEffect(() => {
        socket.on('ping-message', (data: any) => {
            setChatMessages(prevMessages => [
                ...prevMessages,
                { ...data },
            ]);
        })
        return () => {
            socket.off('ping-message')
        }
    }, [])

    React.useEffect(() => {
        setChatMessages(chat?.messages);
    }, [chat?.messages]);

    return (
        <Sheet
            sx={{
                height: {xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh'},
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.level1',
            }}
        >
            <MessagesPaneHeader sender={opponent}/>
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    minHeight: 0,
                    px: 2,
                    py: 3,
                    overflowY: 'scroll',
                    flexDirection: 'column-reverse',
                }}
            >
                <Stack spacing={2} justifyContent="flex-end">
                    {chatMessages.map((message: MessageProps, index: number) => {
                        const isYou = message?.sender?._id === user?._id;
                        return (
                            <Stack
                                key={index}
                                direction="row"
                                spacing={2}
                                flexDirection={isYou ? 'row-reverse' : 'row'}
                            >
                                {message?.sender?._id !== user?._id && (
                                    chatMessages[index]?.sender?._id !== chatMessages[index - 1]?.sender?._id ? (
                                        <AvatarWithStatus
                                            online={message?.sender?.online}
                                            src={message?.sender?.profilePicture}
                                        />
                                    ): <div style={{width: '32px'}}></div>
                                    
                                )}
                                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
                            </Stack>
                        );
                    })}
                </Stack>
            </Box>
            <MessageInput
                textAreaValue={textAreaValue}
                setTextAreaValue={setTextAreaValue}
                onSubmit={() => {
                    const message = {
                        conversationId: chat?._id,
                        sender: user,
                        content: textAreaValue,
                        images: null,
                        timestamp: new Date(),
                    }
                    socket.emit('send-message', message);
                    const newId = chatMessages.length + 1;
                    const newIdString = newId.toString();
                    setChatMessages([
                        ...chatMessages,
                        {
                            id: newIdString,
                            sender: user,
                            content: textAreaValue,
                            timestamp: new Date().toString(),
                        },
                    ]);
                }}
            />
        </Sheet>
    );
}
