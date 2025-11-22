'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user';
import { User } from '@prisma/client';

// Simple in-memory cache for participants (5 minute TTL)
const participantsCache = new Map<string, { data: ChatParticipant[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    // Check cache first
    const cacheKey = `participants_${dbUser.organizationId}`;
    const cached = participantsCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return {
        success: true,
        data: cached.data,
      };
    }

    // Use Promise.all to run queries in parallel for better performance
    const [users, players] = await Promise.all([
      // Get all users in the organization (staff, excluding current user)
      prisma.user.findMany({
        where: {
          organizationId: dbUser.organizationId,
          id: { not: dbUser.id },
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          roleNames: true,
        },
      }),

      // Get all players in the organization (include all statuses for chat)
      prisma.personOrganization.findMany({
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
      }),
    ]);

    // Format users (current user already excluded in query)
    const userParticipants: ChatParticipant[] = users.map((u) => {
      // Access roleNames safely - it should exist after prisma generate
      const roleNames = u.roleNames as string[] | undefined;
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

    // Cache the result
    participantsCache.set(cacheKey, {
      data: allParticipants,
      timestamp: now,
    });

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
