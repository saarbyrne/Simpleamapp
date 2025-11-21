'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Participant } from '@/types/chat';

interface ChatContextType {
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  orgId: string;
  availableParticipants: Participant[];
}

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps extends ChatContextType {
  children: ReactNode;
}

export function ChatProvider({ children, ...props }: ChatProviderProps) {
  return <ChatContext.Provider value={props}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
}
