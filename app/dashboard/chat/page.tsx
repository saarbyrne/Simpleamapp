import { Suspense } from 'react';
import { requireUser } from '@/lib/auth/cached-user';
import { ChatMasterDetail } from '@/components/chat/chat-master-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default async function ChatPage() {
  const user = await requireUser();

  return (
    <div className="h-full">
      <Suspense fallback={<ChatSkeleton />}>
        <ChatMasterDetail
          userId={user.id}
          userName={user.name}
          orgId={user.organizationId}
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
