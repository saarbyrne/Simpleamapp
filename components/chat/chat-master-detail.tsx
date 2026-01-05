'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChats } from '@/hooks/useChats';
import { useMessages } from '@/hooks/useMessages';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Send, ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';
import { CreateChatModal } from './create-chat-modal';
import { ChatNotificationBadge } from './chat-notification-badge';
import { FileUploadButton } from './FileUploadButton';
import { sendMessage, markChatAsRead, uploadFile, formatTimestamp, getOtherParticipantName } from '@/lib/chat';
import { deleteChat } from '@/lib/chat/chatOperations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Chat, Message } from '@/types/chat';
import { toast } from 'sonner';
import { memo } from 'react';
import { initFirebaseAuth } from '@/lib/firebaseAuth';

interface ChatMasterDetailProps {
  userId: string;
  userName: string;
  orgId: string;
}

export function ChatMasterDetail({ userId, userName, orgId }: ChatMasterDetailProps) {
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [firebaseAuthInitialized, setFirebaseAuthInitialized] = useState(false);

  // Initialize Firebase auth when component mounts
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        await initFirebaseAuth();
        if (mounted) {
          setFirebaseAuthInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize Firebase auth:', error);
        if (mounted) {
          toast.error('Failed to initialize messaging. Please refresh the page.');
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const { chats, loading: chatsLoading, error: chatsError } = useChats(
    firebaseAuthInitialized ? userId : null,
    firebaseAuthInitialized ? orgId : null
  );

  // Filter chats based on search
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const chatName = chat.type === 'direct'
        ? getOtherParticipantName(chat, userId)
        : chat.name || 'Group Chat';
      return chatName.toLowerCase().includes(query);
    });
  }, [chats, searchQuery, userId]);

  const handleChatCreated = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    // Modal is already closed by the modal component itself
  }, []);

  const handleChatSelect = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId, userId).catch(console.error);
  }, [userId]);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    try {
      await deleteChat(chatId, userId);
      toast.success('Chat deleted');

      // If the deleted chat was selected, deselect it
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  }, [userId, selectedChatId]);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId),
    [chats, selectedChatId]
  );

  return (
    <>
      <Card className="h-full flex overflow-hidden">
        {/* Chat List - Left Panel */}
        <div className="w-80 border-r flex flex-col bg-background">
          {/* Header */}
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsCreateModalOpen(true)}
                title="New Chat"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10 bg-background">
              <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto flex-1 min-w-0"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            {chatsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : chatsError ? (
              <div className="p-4 text-center text-destructive text-sm">
                {chatsError}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? 'No chats found' : 'No messages yet'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2"
                  >
                    Start a conversation
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-2">
                {filteredChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    userId={userId}
                    isSelected={selectedChatId === chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Window - Right Panel */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              userId={userId}
              userName={userName}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  Select a chat to start messaging
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

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

// Memoized Chat List Item for performance
const ChatListItem = memo(function ChatListItem({
  chat,
  userId,
  isSelected,
  onClick,
  onDelete,
}: {
  chat: Chat;
  userId: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const chatName = chat.type === 'direct'
    ? getOtherParticipantName(chat, userId)
    : chat.name || 'Group Chat';

  return (
    <div
      className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-start gap-3 group ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      <button onClick={onClick} className="flex items-start gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold text-sm">
            {chatName.charAt(0).toUpperCase()}
          </div>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm truncate">{chatName}</h3>
            <ChatNotificationBadge userId={userId} />
          </div>
          {chat.lastMessage && (
            <p className="text-xs text-muted-foreground truncate">
              {chat.lastMessage.text}
            </p>
          )}
        </div>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

// Chat Window Component
function ChatWindow({
  chat,
  userId,
  userName,
}: {
  chat: Chat;
  userId: string;
  userName: string;
}) {
  const { messages, loading } = useMessages(chat.id);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const chatName = chat.type === 'direct'
    ? getOtherParticipantName(chat, userId)
    : chat.name || 'Group Chat';

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = messageText.trim();
    if (!text || sending) return;

    setSending(true);

    try {
      await sendMessage({
        chatId: chat.id,
        senderId: userId,
        senderName: userName,
        text,
      });

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadFile({
        chatId: chat.id,
        senderId: userId,
        senderName: userName,
        file,
      });

      toast.success('File uploaded');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold text-sm">
              {chatName.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">{chatName}</h3>
            {chat.type === 'group' && (
              <p className="text-xs text-muted-foreground">
                {chat.participantIds.length} members
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground text-sm mb-2">No messages yet</p>
              <p className="text-xs text-muted-foreground">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === userId}
                showSenderName={chat.type === 'group'}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <FileUploadButton
            onFileSelected={handleFileUpload}
            disabled={sending}
          />
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-10 max-h-32 resize-none"
            disabled={sending}
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageText.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </>
  );
}

// Memoized Message Bubble
const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  showSenderName,
}: {
  message: Message;
  isOwn: boolean;
  showSenderName: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {showSenderName && !isOwn && (
          <p className="text-xs text-muted-foreground mb-1 px-3">
            {message.senderName}
          </p>
        )}
        <div
          className={`rounded-lg p-3 ${
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
        </div>
        {message.createdAt && (
          <p className="text-xs text-muted-foreground mt-1 px-3">
            {formatTimestamp(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
});
