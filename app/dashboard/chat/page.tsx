import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user';
import { ChatMasterDetail } from '@/components/chat/chat-master-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

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
    <div className="h-[calc(100vh-4rem)] p-6">
      <Suspense fallback={<ChatSkeleton />}>
        <ChatMasterDetail
          userId={dbUser.id}
          userName={dbUser.name}
          orgId={dbUser.organizationId}
        />
      </Suspense>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <Card className="h-full flex">
      {/* Chat list skeleton */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-24 mb-3" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
      {/* Chat window skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-64" />
          ))}
        </div>
      </div>
    </Card>
  );
}
