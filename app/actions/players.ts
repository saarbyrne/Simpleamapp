'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'

interface CreatePlayerData {
  firstName: string
  lastName: string
  dateOfBirth?: string
  nationality?: string
  phone?: string
  email?: string
  photo?: string
  position?: string
  jerseyNumber?: number
  status?: 'active' | 'injured'
  tags?: string[]
}

export async function createPlayer(data: CreatePlayerData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Create person and link to organization
    const result = await prisma.$transaction(async (tx) => {
      // Create person
      const person = await tx.person.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          nationality: data.nationality,
          phone: data.phone,
          email: data.email,
          photo: data.photo,
        }
      })

      // Link to organization
      const personOrg = await tx.personOrganization.create({
        data: {
          personId: person.id,
          organizationId: dbUser.organizationId,
          role: 'player',
          position: data.position,
          jerseyNumber: data.jerseyNumber,
          status: data.status || 'active',
          tags: data.tags || [],
        }
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'player_created',
          data: {
            playerName: `${person.firstName} ${person.lastName}`,
            position: data.position,
          },
          userId: user.id,
          personId: person.id,
        }
      })

      return { person, personOrg }
    })

    revalidatePath('/dashboard')

    return { success: true, player: result.person }
  } catch (error) {
    console.error('Error creating player:', error)
    return { error: 'Failed to create player' }
  }
}

export async function updatePlayer(
  personId: string,
  data: Partial<CreatePlayerData>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const result = await prisma.$transaction(async (tx) => {
      // Update person
      const person = await tx.person.update({
        where: { id: personId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          nationality: data.nationality,
          phone: data.phone,
          email: data.email,
        }
      })

      // Update organization link
      const personOrg = await tx.personOrganization.updateMany({
        where: {
          personId: personId,
          organizationId: dbUser.organizationId,
        },
        data: {
          position: data.position,
          jerseyNumber: data.jerseyNumber,
          status: data.status,
          tags: data.tags,
        }
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'player_updated',
          data: {
            playerName: `${person.firstName} ${person.lastName}`,
          },
          userId: user.id,
          personId: person.id,
        }
      })

      return person
    })

    revalidatePath('/dashboard')

    return { success: true, player: result }
  } catch (error) {
    console.error('Error updating player:', error)
    return { error: 'Failed to update player' }
  }
}

export async function deletePlayer(personId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get player name before deletion
    const person = await prisma.person.findUnique({
      where: { id: personId },
      select: { firstName: true, lastName: true }
    })

    // Delete person (cascades to person_organizations)
    await prisma.person.delete({
      where: { id: personId }
    })

    // Log activity
    if (person) {
      await prisma.activity.create({
        data: {
          type: 'player_deleted',
          data: {
            playerName: `${person.firstName} ${person.lastName}`,
          },
          userId: user.id,
        }
      })
    }

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting player:', error)
    return { error: 'Failed to delete player' }
  }
}

export async function bulkUpdatePlayers(
  personIds: string[],
  updates: {
    position?: string | null
    status?: 'active' | 'injured' | 'inactive' | null
    nationality?: string | null
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  if (!personIds || personIds.length === 0) {
    return { error: 'No players selected' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const result = await prisma.$transaction(async (tx) => {
      const updatedCount = { person: 0, personOrg: 0 }

      // Update nationality in Person table if provided
      if (updates.nationality !== undefined) {
        const personUpdate = await tx.person.updateMany({
          where: {
            id: { in: personIds },
          },
          data: {
            nationality: updates.nationality || null,
          },
        })
        updatedCount.person = personUpdate.count
      }

      // Update position and/or status in PersonOrganization table if provided
      const personOrgUpdates: {
        position?: string | null
        status?: 'active' | 'injured' | 'inactive' | null
      } = {}

      if (updates.position !== undefined) {
        personOrgUpdates.position = updates.position || null
      }

      if (updates.status !== undefined) {
        personOrgUpdates.status = updates.status || null
      }

      if (Object.keys(personOrgUpdates).length > 0) {
        const personOrgUpdate = await tx.personOrganization.updateMany({
          where: {
            personId: { in: personIds },
            organizationId: dbUser.organizationId,
          },
          data: personOrgUpdates,
        })
        updatedCount.personOrg = personOrgUpdate.count
      }

      // Log activity for bulk update
      await tx.activity.create({
        data: {
          type: 'players_bulk_updated',
          data: {
            count: personIds.length,
            updates: Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined),
          },
          userId: user.id,
        }
      })

      return updatedCount
    })

    revalidatePath('/dashboard/players')
    revalidatePath('/dashboard')

    return { success: true, updatedCount: result }
  } catch (error) {
    console.error('Error bulk updating players:', error)
    return { error: 'Failed to bulk update players' }
  }
}

export async function getPlayers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', players: [] }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const players = await prisma.person.findMany({
      where: {
        organizations: {
          some: {
            organizationId: dbUser.organizationId,
            role: 'player',
          }
        }
      },
      include: {
        organizations: {
          where: {
            organizationId: dbUser.organizationId,
          },
          select: {
            position: true,
            jerseyNumber: true,
            status: true,
            tags: true,
            joinedAt: true,
          }
        }
      },
      orderBy: {
        lastName: 'asc',
      }
    })

    return { players }
  } catch (error) {
    console.error('Error fetching players:', error)
    return { error: 'Failed to fetch players', players: [] }
  }
}

/**
 * Get a single player by ID with full details
 */
export async function getPlayer(playerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const player = await prisma.person.findFirst({
      where: {
        id: playerId,
        organizations: {
          some: {
            organizationId: dbUser.organizationId,
            role: 'player',
          }
        }
      },
      include: {
        organizations: {
          where: {
            organizationId: dbUser.organizationId,
          },
          select: {
            position: true,
            jerseyNumber: true,
            status: true,
            tags: true,
            joinedAt: true,
            leftAt: true,
          }
        }
      }
    })

    if (!player) {
      return { error: 'Player not found' }
    }

    return { success: true, player }
  } catch (error) {
    console.error('Error fetching player:', error)
    return { error: 'Failed to fetch player' }
  }
}
