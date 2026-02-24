'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { requireUser } from '@/lib/auth/cached-user'
import { z } from 'zod'

// ============================================
// Zod Schemas
// ============================================

const CreatePlayerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().optional(),
  nationality: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  photo: z.string().url().max(2048).optional().or(z.literal('')),
  position: z.string().max(100).optional(),
  jerseyNumber: z.number().int().min(0).max(999).optional(),
  status: z.enum(['active', 'injured']).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
})

const UpdatePlayerSchema = CreatePlayerSchema.partial()

const BulkUpdateSchema = z.object({
  personIds: z.array(z.string().cuid()).min(1).max(500),
  updates: z.object({
    position: z.string().max(100).nullable().optional(),
    status: z.enum(['active', 'injured', 'inactive']).nullable().optional(),
    nationality: z.string().max(100).nullable().optional(),
  }),
})

const PaginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(1000).default(20),
})

// ============================================
// Actions
// ============================================

export async function createPlayer(rawData: z.input<typeof CreatePlayerSchema>) {
  try {
    const user = await requireUser()
    const data = CreatePlayerSchema.parse(rawData)

    const result = await prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          nationality: data.nationality,
          phone: data.phone,
          email: data.email || undefined,
          photo: data.photo || undefined,
        }
      })

      await tx.personOrganization.create({
        data: {
          personId: person.id,
          organizationId: user.organizationId,
          role: 'player',
          position: data.position,
          jerseyNumber: data.jerseyNumber,
          status: data.status || 'active',
          tags: data.tags || [],
        }
      })

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

      return person
    })

    revalidateTag('players-list')
    return { success: true, player: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Invalid input' }
    }
    if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
      return { error: 'Not authenticated' }
    }
    console.error('Error creating player:', error)
    return { error: 'Failed to create player' }
  }
}

export async function updatePlayer(
  personId: string,
  rawData: z.input<typeof UpdatePlayerSchema>
) {
  try {
    const user = await requireUser()
    const data = UpdatePlayerSchema.parse(rawData)
    z.string().cuid().parse(personId)

    const result = await prisma.$transaction(async (tx) => {
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

      await tx.personOrganization.updateMany({
        where: {
          personId: personId,
          organizationId: user.organizationId,
        },
        data: {
          position: data.position,
          jerseyNumber: data.jerseyNumber,
          status: data.status,
          tags: data.tags,
        }
      })

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

    revalidateTag(`player-${personId}`)
    revalidateTag('players-list')
    return { success: true, player: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Invalid input' }
    }
    if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
      return { error: 'Not authenticated' }
    }
    console.error('Error updating player:', error)
    return { error: 'Failed to update player' }
  }
}

export async function deletePlayer(personId: string) {
  try {
    const user = await requireUser()
    z.string().cuid().parse(personId)

    const person = await prisma.person.findUnique({
      where: { id: personId },
      select: { firstName: true, lastName: true }
    })

    await prisma.person.delete({
      where: { id: personId }
    })

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
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Invalid input' }
    }
    if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
      return { error: 'Not authenticated' }
    }
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
  try {
    const user = await requireUser()
    const validated = BulkUpdateSchema.parse({ personIds, updates })

    if (validated.updates.status === null) {
      return { error: 'Status is required and cannot be cleared' }
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedCount = { person: 0, personOrg: 0 }

      if (validated.updates.nationality !== undefined) {
        const personUpdate = await tx.person.updateMany({
          where: { id: { in: validated.personIds } },
          data: { nationality: validated.updates.nationality || null },
        })
        updatedCount.person = personUpdate.count
      }

      const personOrgUpdates: Record<string, unknown> = {}
      if (validated.updates.position !== undefined) {
        personOrgUpdates.position = validated.updates.position || null
      }
      if (validated.updates.status !== undefined && validated.updates.status !== null) {
        personOrgUpdates.status = validated.updates.status
      }

      if (Object.keys(personOrgUpdates).length > 0) {
        const personOrgUpdate = await tx.personOrganization.updateMany({
          where: {
            personId: { in: validated.personIds },
            organizationId: user.organizationId,
          },
          data: personOrgUpdates,
        })
        updatedCount.personOrg = personOrgUpdate.count
      }

      await tx.activity.create({
        data: {
          type: 'players_bulk_updated',
          data: {
            count: validated.personIds.length,
            updates: Object.keys(validated.updates).filter(
              key => validated.updates[key as keyof typeof validated.updates] !== undefined
            ),
          },
          userId: user.id,
        }
      })

      return updatedCount
    })

    validated.personIds.forEach(id => revalidateTag(`player-${id}`))
    revalidateTag('players-list')
    return { success: true, updatedCount: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Invalid input' }
    }
    if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
      return { error: 'Not authenticated' }
    }
    console.error('Error bulk updating players:', error)
    return { error: 'Failed to bulk update players' }
  }
}

export async function getPlayers(page: number = 0, pageSize: number = 20) {
  try {
    const user = await requireUser()
    const params = PaginationSchema.parse({ page, pageSize })

    const skip = params.page * params.pageSize

    const [total, players] = await Promise.all([
      prisma.person.count({
        where: {
          organizations: {
            some: {
              organizationId: user.organizationId,
              role: 'player',
            }
          }
        }
      }),
      prisma.person.findMany({
        where: {
          organizations: {
            some: {
              organizationId: user.organizationId,
              role: 'player',
            }
          }
        },
        include: {
          organizations: {
            where: { organizationId: user.organizationId },
            select: {
              position: true,
              jerseyNumber: true,
              status: true,
              tags: true,
              joinedAt: true,
            }
          }
        },
        orderBy: { lastName: 'asc' },
        skip,
        take: params.pageSize,
      })
    ])

    return { players, total, page: params.page, pageSize: params.pageSize }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
      return { error: 'Not authenticated', players: [], total: 0, page: 0, pageSize: 20 }
    }
    console.error('Error fetching players:', error)
    return { error: 'Failed to fetch players', players: [], total: 0, page: 0, pageSize: 20 }
  }
}

/**
 * Internal cached function to fetch player data from database
 */
const getPlayerFromDB = (playerId: string, organizationId: string) =>
  unstable_cache(
    async () => {
      return await prisma.person.findFirst({
        where: {
          id: playerId,
          organizations: {
            some: {
              organizationId,
              role: 'player',
            }
          }
        },
        include: {
          organizations: {
            where: { organizationId },
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
    },
    ['player-data', playerId, organizationId],
    {
      revalidate: 300,
      tags: [`player-${playerId}`, 'players-list']
    }
  )()

export async function getPlayer(playerId: string) {
  try {
    const user = await requireUser()
    z.string().cuid().parse(playerId)

    const player = await getPlayerFromDB(playerId, user.organizationId)

    if (!player) {
      return { error: 'Player not found' }
    }

    return { success: true, player }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid player ID' }
    }
    if (error instanceof Error && error.message === 'Unauthorized: User must be authenticated') {
      return { error: 'Not authenticated' }
    }
    console.error('Error fetching player:', error)
    return { error: 'Failed to fetch player' }
  }
}
