import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/types/chat';

interface UseChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to listen to all chats where user is a participant
 * Real-time updates with onSnapshot
 */
export function useChats(userId: string | null, orgId: string | null): UseChatsReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !orgId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [
        where('orgId', '==', orgId),
        where('participantIds', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc'),
      ];

      const q = query(collection(db, 'chats'), ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const chatsData: Chat[] = [];
          snapshot.forEach((doc) => {
            chatsData.push({
              id: doc.id,
              ...doc.data(),
            } as Chat);
          });

          setChats(chatsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching chats:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up chats listener:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chats');
      setLoading(false);
    }
  }, [userId, orgId]);

  return { chats, loading, error };
}
