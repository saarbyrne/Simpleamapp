import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user';
import { ChatList } from '@/components/chat/ChatList';
import { Skeleton } from '@/components/ui/skeleton';

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user from database
  const dbUser = await ensureUserWithOrganization(user);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<ChatListSkeleton />}>
        <ChatList
          userId={dbUser.id}
          userName={dbUser.name}
          orgId={dbUser.organizationId}
        />
      </Suspense>
    </div>
  );
}

function ChatListSkeleton() {
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
