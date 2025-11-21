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
      return { success: false, error: 'Authentication required' };
    }

    const dbUser = await ensureUserWithOrganization(user);

    // Get all users in the organization (staff, excluding current user)
    const users = await prisma.user.findMany({
      where: {
        organizationId: dbUser.organizationId,
        id: { not: dbUser.id },
      },
    });

    // Get all players in the organization (include all statuses for chat)
    const players = await prisma.personOrganization.findMany({
      where: {
        organizationId: dbUser.organizationId,
        role: 'player',
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

    // Format users (exclude current user)
    const userParticipants: ChatParticipant[] = users
      .filter(u => u.id !== dbUser.id)
      .map((u) => {
        // Access roleNames safely - it should exist after prisma generate
        const roleNames = (u as any).roleNames as string[] | undefined;
        return {
          id: u.id,
          name: u.name,
          role: roleNames?.[0] || 'Staff',
          avatarUrl: u.avatar || undefined,
          type: 'user' as const,
        };
      });

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
