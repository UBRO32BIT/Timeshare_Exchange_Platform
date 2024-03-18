import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, {ListItemButtonProps} from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from './AvatarWithStatus';
import {ChatProps, MessageProps, UserProps} from '../types';
import {toggleMessagesPane} from '../utils';
import {useSelector} from "react-redux";
import {RootState} from "../../features/auth/auth.slice";
import {CreateConversation, GetConversationOfUser, GetConversationById} from '../../services/chat.service';

type ChatListItemProps = ListItemButtonProps & {
    _id: string;
    unread?: boolean;
    conversationId: string;
    participants: Array<any>;
    sender: UserProps;
    messages: MessageProps[];
    selectedChatId?: string;
    setSelectedChat: (chat: ChatProps) => void;
};

export default function ChatListItem(props: ChatListItemProps) {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const {_id, conversationId, participants, sender, messages, selectedChatId, setSelectedChat} = props;
    const selected = selectedChatId === _id;
    const opponent = participants.find(participant => participant._id !== user._id);

    return (
        <React.Fragment>
            <ListItem>
                <ListItemButton
                    onClick={async () => {
                        const updatedChat = await GetConversationById(_id);
                        toggleMessagesPane();
                        setSelectedChat({_id, conversationId, participants, sender, messages: updatedChat.messages});
                    }}
                    selected={selected}
                    color="neutral"
                    sx={{
                        flexDirection: 'column',
                        alignItems: 'initial',
                        gap: 1,
                    }}
                >
                    <Stack direction="row" spacing={1.5}>
                        <AvatarWithStatus online={opponent?.online} src={opponent?.profilePicture}/>
                        <Box sx={{flex: 1}}>
                            <Typography level="title-sm">{opponent?.username}</Typography>
                            <Typography level="body-sm">{opponent?.email}</Typography>
                        </Box>
                        <Box
                            sx={{
                                lineHeight: 1.5,
                                textAlign: 'right',
                            }}
                        >
                            {messages[0]?.unread && (
                                <CircleIcon sx={{fontSize: 12}} color="primary"/>
                            )}
                            <Typography
                                level="body-xs"
                                display={{xs: 'none', md: 'block'}}
                                noWrap
                            >
                                5 mins ago
                            </Typography>
                        </Box>
                    </Stack>
                    <Typography
                        level="body-sm"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {messages[messages.length-1]?.content}
                    </Typography>
                </ListItemButton>
            </ListItem>
            <ListDivider sx={{margin: 0}}/>
        </React.Fragment>
    );
}
