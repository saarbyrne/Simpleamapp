'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { getTranslations } from 'next-intl/server'

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
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
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
    return { error: t('failedToCreatePlayer') }
  }
}

export async function updatePlayer(
  personId: string,
  data: Partial<CreatePlayerData>
) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
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
    return { error: t('failedToUpdatePlayer') }
  }
}

export async function deletePlayer(personId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
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
    return { error: t('failedToDeletePlayer') }
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
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  if (!personIds || personIds.length === 0) {
    return { error: t('noPlayersSelected') }
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
        status?: string
      } = {}

      if (updates.position !== undefined) {
        personOrgUpdates.position = updates.position || null
      }

      // Status is required in schema - validate and provide clear error if null
      if (updates.status !== undefined) {
        if (updates.status === null) {
          throw new Error(t('statusRequired'))
        }
        // Validate status value
        const validStatuses = ['active', 'injured', 'inactive']
        if (!validStatuses.includes(updates.status)) {
          throw new Error(t('invalidStatusValue', { status: updates.status, validStatuses: validStatuses.join(', ') }))
        }
        personOrgUpdates.status = updates.status
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
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: t('failedToBulkUpdatePlayers') }
  }
}

export async function getPlayers(page: number = 0, pageSize: number = 20) {
  try {
    const t = await getTranslations('errors')
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return { error: t('notAuthenticated'), players: [], total: 0, page: 0, pageSize: 20 }
    }

    const dbUser = await ensureUserWithOrganization(user)

    const skip = page * pageSize

    // Get total count
    const total = await prisma.person.count({
      where: {
        organizations: {
          some: {
            organizationId: dbUser.organizationId,
            role: 'player',
          }
        }
      }
    })

    // Get paginated players
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
      },
      skip,
      take: pageSize,
    })

    console.log(`Fetched ${players.length} players for org ${dbUser.organizationId}, total: ${total}`)

    return { players, total, page, pageSize }
  } catch (error) {
    console.error('Error fetching players:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    const t = await getTranslations('errors')
    return { error: t('failedToFetchPlayers'), players: [], total: 0, page: 0, pageSize: 20 }
  }
}

/**
 * Get a single player by ID with full details
 */
export async function getPlayer(playerId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
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
      return { error: t('playerNotFound') }
    }

    return { success: true, player }
  } catch (error) {
    console.error('Error fetching player:', error)
    return { error: t('failedToFetchPlayer') }
  }
}
