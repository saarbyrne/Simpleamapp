import { useState, useEffect } from 'react';
import { Participant } from '@/types/chat';

interface UseChatParticipantsReturn {
  participants: Participant[];
  loading: boolean;
}

/**
 * Hook to fetch participant details from chat.participantIds
 * TODO: Integrate with SimpleAM's user data once we have the API
 */
export function useChatParticipants(participantIds: string[]): UseChatParticipantsReturn {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!participantIds || participantIds.length === 0) {
      setParticipants([]);
      setLoading(false);
      return;
    }

    // TODO: Replace with actual API call to fetch user data
    // For now, create placeholder participants
    const mockParticipants: Participant[] = participantIds.map((id) => ({
      id,
      name: 'User ' + id.substring(0, 6),
      role: 'Member',
      type: 'user' as const,
    }));

    setParticipants(mockParticipants);
    setLoading(false);
  }, [participantIds]);

  return { participants, loading };
}
