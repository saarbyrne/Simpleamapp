import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Skeleton } from '@/components/ui/skeleton';
import { Chat } from '@/types/chat';

interface ChatWindowPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatWindowPage({ params }: ChatWindowPageProps) {
  const { chatId } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user from database
  const dbUser = await ensureUserWithOrganization(user);

  // Fetch chat details
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    redirect('/dashboard/chat');
  }

  const chat = { id: chatSnap.id, ...chatSnap.data() } as Chat;

  // Verify user is a participant
  if (!chat.participantIds.includes(dbUser.id)) {
    redirect('/dashboard/chat');
  }

  // Get chat name
  const chatName = chat.name || 'Chat';
  const isGroupChat = chat.type === 'group';

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<ChatWindowSkeleton />}>
        <ChatWindow
          chatId={chatId}
          chatName={chatName}
          userId={dbUser.id}
          userName={dbUser.name}
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
