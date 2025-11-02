'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface CreatePlayerData {
  firstName: string
  lastName: string
  dateOfBirth?: string
  nationality?: string
  phone?: string
  email?: string
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
    // Get user's organization
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return { error: 'User not found' }
    }

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
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return { error: 'User not found' }
    }

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
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return { error: 'User not found' }
    }

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

export async function getPlayers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', players: [] }
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return { error: 'User not found', players: [] }
    }

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
