'use client';

import { useUnreadCount } from '@/hooks/useUnreadCount';
import { Badge } from '@/components/ui/badge';

interface ChatNotificationBadgeProps {
  userId: string | null;
}

export function ChatNotificationBadge({ userId }: ChatNotificationBadgeProps) {
  const unreadCount = useUnreadCount(userId);

  if (unreadCount === 0) return null;

  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <Badge
      variant="destructive"
      className="h-5 min-w-5 px-1 text-xs font-semibold"
    >
      {displayCount}
    </Badge>
  );
}
