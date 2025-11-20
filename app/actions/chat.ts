'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user';

export interface ChatParticipant {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  type: 'user' | 'player';
}

/**
 * Get all potential chat participants for an organization
 * Includes both staff users and players
 */
export async function getChatParticipants() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[getChatParticipants] No authenticated user');
      return { success: false, error: 'Authentication required' };
    }

    const dbUser = await ensureUserWithOrganization(user);
    console.log('[getChatParticipants] Current user:', {
      id: dbUser.id,
      name: dbUser.name,
      orgId: dbUser.organizationId,
    });

    // Get all users in the organization (staff)
    const users = await prisma.user.findMany({
      where: {
        organizationId: dbUser.organizationId,
        id: { not: dbUser.id }, // Exclude current user
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        roleNames: true,
      },
    });
    console.log('[getChatParticipants] Found users:', users.length);

    // Get all players in the organization
    const players = await prisma.personOrganization.findMany({
      where: {
        organizationId: dbUser.organizationId,
        role: 'player',
        status: 'active',
      },
      include: {
        person: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
          },
        },
      },
    });
    console.log('[getChatParticipants] Found players:', players.length);

    // Format users
    const userParticipants: ChatParticipant[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.roleNames?.[0] || 'Staff',
      avatarUrl: u.avatar || undefined,
      type: 'user' as const,
    }));

    // Format players
    const playerParticipants: ChatParticipant[] = players.map((p) => ({
      id: p.person.id,
      name: `${p.person.firstName} ${p.person.lastName}`,
      role: p.position || 'Player',
      avatarUrl: p.person.photo || undefined,
      type: 'player' as const,
    }));

    // Combine and sort by name
    const allParticipants = [...userParticipants, ...playerParticipants].sort(
      (a, b) => a.name.localeCompare(b.name)
    );

    console.log('[getChatParticipants] Total participants:', allParticipants.length);
    console.log('[getChatParticipants] Participants:', allParticipants.map(p => ({ name: p.name, type: p.type })));

    return {
      success: true,
      data: allParticipants,
    };
  } catch (error) {
    console.error('[getChatParticipants] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch participants',
    };
  }
}
