export interface AuthInfo {
  email: string | undefined;
  password: string | undefined;
}

export interface InvitationInfo {
  friendEmail: string | undefined;
  userId: string | undefined;
}

export interface MessageInfo {
  connectionId?: string;
  senderId: string;
  senderEmail: string;
  receiverEmail: string;
  receiverId: string;
  text: string;
  timestamp: number;
}
