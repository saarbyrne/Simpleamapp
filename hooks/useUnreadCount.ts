import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserChatStatus } from '@/types/chat';

/**
 * Hook to listen to unread message count for a user
 * Real-time updates with onSnapshot
 */
export function useUnreadCount(userId: string | null): number {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    try {
      const statusRef = doc(db, 'userChatStatus', userId);

      const unsubscribe = onSnapshot(
        statusRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserChatStatus;
            let total = 0;

            if (data.chats) {
              Object.values(data.chats).forEach((chatStatus) => {
                total += chatStatus.unreadCount || 0;
              });
            }

            setUnreadCount(total);
          } else {
            setUnreadCount(0);
          }
        },
        (err) => {
          console.error('Error fetching unread count:', err);
          setUnreadCount(0);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up unread count listener:', err);
      setUnreadCount(0);
    }
  }, [userId]);

  return unreadCount;
}
