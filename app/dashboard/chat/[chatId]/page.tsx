import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { requireUser } from '@/lib/auth/cached-user';
import { ChatWindow } from '@/components/chat/chat-window';
import { Skeleton } from '@/components/ui/skeleton';
import { Chat } from '@/types/chat';

// Force dynamic rendering - don't pre-render this page during build
export const dynamic = 'force-dynamic';

interface ChatWindowPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatWindowPage({ params }: ChatWindowPageProps) {
  const { chatId } = params;

  const user = await requireUser();

  // Fetch chat details (lazy initialize Firebase only when chat is accessed)
  const db = getFirebaseDb();
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    redirect('/dashboard/chat');
  }

  const chat = { id: chatSnap.id, ...chatSnap.data() } as Chat;

  // Verify user is a participant
  if (!chat.participantIds.includes(user.id)) {
    redirect('/dashboard/chat');
  }

  // Get chat name
  const chatName = chat.name || 'Chat';
  const isGroupChat = chat.type === 'group';

  return (
    <div className="h-full">
      <Suspense fallback={<ChatWindowSkeleton />}>
        <ChatWindow
          chatId={chatId}
          chatName={chatName}
          userId={user.id}
          userName={user.name}
          isGroupChat={isGroupChat}
        />
      </Suspense>
    </div>
  );
}

function ChatWindowSkeleton() {
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
      <div className="border-t p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
