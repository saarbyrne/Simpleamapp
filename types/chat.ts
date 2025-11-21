import { Timestamp } from 'firebase/firestore';

export interface Chat {
  id: string;
  orgId: string;
  type: 'group' | 'direct';
  name?: string;
  participantIds: string[];
  createdAt: Timestamp;
  createdBy: string;
  lastMessageAt: Timestamp;
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
  };
  metadata?: {
    teamId?: string;
    avatarUrl?: string;
  };
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy?: string[];
  reactions?: {
    [emoji: string]: string[];
  };
}

export interface UserChatStatus {
  userId: string;
  chats: {
    [chatId: string]: {
      unreadCount: number;
      lastReadAt: Timestamp;
      isMuted: boolean;
    };
  };
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  type: 'user' | 'player';
}
