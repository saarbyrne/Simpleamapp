import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { Message } from '@/types/chat';

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  loadMore: () => void;
}

/**
 * Hook to listen to messages in a specific chat
 * Real-time updates with onSnapshot
 */
export function useMessages(chatId: string | null, initialLimit: number = 50): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageLimit, setMessageLimit] = useState(initialLimit);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const db = getFirebaseDb(); // Lazy initialize Firebase only when hook is used
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(messageLimit)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messagesData: Message[] = [];
          snapshot.forEach((doc) => {
            messagesData.push({
              id: doc.id,
              ...doc.data(),
            } as Message);
          });

          setMessages(messagesData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching messages:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up messages listener:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setLoading(false);
    }
  }, [chatId, messageLimit]);

  const loadMore = () => {
    setMessageLimit((prev) => prev + 50);
  };

  return { messages, loading, error, loadMore };
}
