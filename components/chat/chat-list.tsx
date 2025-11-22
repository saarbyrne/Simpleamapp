'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChats } from '@/hooks/useChats';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, Search, MessageSquare } from 'lucide-react';
import { formatTimestamp, truncateText } from '@/lib/chat';
import { Chat } from '@/types/chat';
import { CreateChatModal } from './create-chat-modal';

interface ChatListProps {
  userId: string;
  userName: string;
  orgId: string;
}

export function ChatList({ userId, userName, orgId }: ChatListProps) {
  const router = useRouter();
  const { chats, loading, error } = useChats(userId, orgId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter chats by search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      chat.name?.toLowerCase().includes(query) ||
      chat.lastMessage?.text.toLowerCase().includes(query)
    );
  });

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  const handleChatCreated = (chatId: string) => {
    setIsCreateModalOpen(false);
    router.push(`/dashboard/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-10 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="p-6 text-center">
          <p className="text-destructive">Error loading chats: {error}</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button
              size="icon"
              onClick={() => setIsCreateModalOpen(true)}
              title="New chat"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10">
            <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 px-0 h-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No chats found' : 'No messages yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a conversation with your team'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  userId={userId}
                  onClick={() => handleChatClick(chat.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <CreateChatModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userId={userId}
        userName={userName}
        orgId={orgId}
        onChatCreated={handleChatCreated}
      />
    </>
  );
}

interface ChatListItemProps {
  chat: Chat;
  userId: string;
  onClick: () => void;
}

function ChatListItem({ chat, userId, onClick }: ChatListItemProps) {
  // Get unread count for this chat
  const unreadCount = useUnreadCount(userId);

  // TODO: Fetch actual unread count for this specific chat
  const chatUnread = 0; // Placeholder

  // Get chat display name
  const displayName = chat.name || 'Chat';

  // Format last message
  const lastMessageText = chat.lastMessage
    ? truncateText(chat.lastMessage.text, 50)
    : 'No messages yet';

  return (
    <div
      className="flex items-start gap-3 p-4 hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <Avatar className="h-12 w-12">
        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold truncate">{displayName}</h3>
          {chat.lastMessageAt && (
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {formatTimestamp(chat.lastMessageAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate">
            {chat.lastMessage && chat.lastMessage.senderId === userId && (
              <span className="mr-1">You:</span>
            )}
            {lastMessageText}
          </p>
          {chatUnread > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 text-xs">
              {chatUnread}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
