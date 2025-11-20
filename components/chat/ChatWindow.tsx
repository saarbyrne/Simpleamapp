'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMessages } from '@/hooks/useMessages';
import { sendMessage, markChatAsRead, uploadFile } from '@/lib/chatOperations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send, Download } from 'lucide-react';
import { formatTimestamp, formatFileSize, isImageFile } from '@/lib/chatUtils';
import { Message } from '@/types/chat';
import { FileUploadButton } from './FileUploadButton';
import { toast } from 'sonner';
import Image from 'next/image';

interface ChatWindowProps {
  chatId: string;
  chatName: string;
  userId: string;
  userName: string;
  isGroupChat: boolean;
}

export function ChatWindow({
  chatId,
  chatName,
  userId,
  userName,
  isGroupChat,
}: ChatWindowProps) {
  const router = useRouter();
  const { messages, loading, error } = useMessages(chatId);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark chat as read when opened
  useEffect(() => {
    if (chatId && userId) {
      markChatAsRead(chatId, userId).catch(console.error);
    }
  }, [chatId, userId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const text = messageText.trim();
    if (!text || sending) return;

    setSending(true);

    try {
      await sendMessage({
        chatId,
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
        chatId,
        senderId: userId,
        senderName: userName,
        file,
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Let FileUploadButton handle the error
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={i % 2 === 0 ? 'flex justify-end' : 'flex justify-start'}>
              <Skeleton className="h-16 w-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading messages: {error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
              {chatName.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div>
            <h2 className="font-semibold">{chatName}</h2>
            {isGroupChat && (
              <p className="text-xs text-muted-foreground">Group chat</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">
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
                showSenderName={isGroupChat}
              />
            ))}
            <div ref={messagesEndRef} />
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
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSenderName: boolean;
}

function MessageBubble({ message, isOwn, showSenderName }: MessageBubbleProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}
        onMouseEnter={() => setShowTimestamp(true)}
        onMouseLeave={() => setShowTimestamp(false)}
      >
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
          {message.type === 'image' && message.fileUrl && (
            <div className="mb-2">
              <Image
                src={message.fileUrl}
                alt={message.fileName || 'Image'}
                width={300}
                height={200}
                className="rounded cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
            </div>
          )}

          {message.type === 'file' && message.fileUrl && (
            <div className="flex items-center gap-2 mb-2 p-2 rounded bg-background/10">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.fileName}</p>
                {message.fileSize && (
                  <p className="text-xs opacity-70">{formatFileSize(message.fileSize)}</p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => window.open(message.fileUrl, '_blank')}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        {showTimestamp && message.createdAt && (
          <p className="text-xs text-muted-foreground mt-1 px-3">
            {formatTimestamp(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
