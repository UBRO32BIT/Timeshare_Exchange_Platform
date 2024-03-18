export type UserProps = {
  _id: string;
  name: string;
  email: string;
  username: string;
  profilePicture: string;
  online: boolean;
};

export type MessageProps = {
  id: string;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: UserProps;
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
};

export type ChatProps = {
  _id: string;
  conversationId: string;
  participants: Array<any>;
  sender: UserProps;
  messages: MessageProps[];
};
