'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { playersSchema, playerToRow } from '@/lib/data-tables/players-schema'

/**
 * Get Players data as spreadsheet format
 */
export async function getPlayersData() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Fetch all players with their person data
    const players = await prisma.personOrganization.findMany({
      where: {
        organizationId: dbUser.organizationId,
        role: 'player',
      },
      include: {
        person: true,
      },
      orderBy: {
        person: {
          lastName: 'asc',
        },
      },
    })

    // Transform to spreadsheet rows
    const rows = players.map(playerToRow)

    return {
      success: true,
      schema: playersSchema,
      data: rows,
      meta: {
        tableName: 'Players',
        description: 'All players in your organization',
        recordCount: players.length,
      },
    }
  } catch (error) {
    console.error('Error fetching players data:', error)
    return { error: 'Failed to fetch players data' }
  }
}

/**
 * Get Staff data as spreadsheet format
 */
export async function getStaffData() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const staff = await prisma.personOrganization.findMany({
      where: {
        organizationId: dbUser.organizationId,
        role: { not: 'player' },
      },
      include: {
        person: true,
      },
      orderBy: {
        person: {
          lastName: 'asc',
        },
      },
    })

    const rows = staff.map((s) => ({
      id: s.id,
      firstName: s.person.firstName,
      lastName: s.person.lastName,
      role: s.role,
      phone: s.person.phone,
      email: s.person.email,
      joinedAt: s.joinedAt,
    }))

    return {
      success: true,
      schema: [
        { id: 'firstName', name: 'First Name', type: 'text' },
        { id: 'lastName', name: 'Last Name', type: 'text' },
        { id: 'role', name: 'Role', type: 'text' },
        { id: 'phone', name: 'Phone', type: 'text' },
        { id: 'email', name: 'Email', type: 'text' },
        { id: 'joinedAt', name: 'Joined', type: 'date' },
      ],
      data: rows,
      meta: {
        tableName: 'Staff',
        description: 'Coaches, medical staff, and administrators',
        recordCount: staff.length,
      },
    }
  } catch (error) {
    console.error('Error fetching staff data:', error)
    return { error: 'Failed to fetch staff data' }
  }
}

/**
 * Get Events data as spreadsheet format
 */
export async function getEventsData() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const events = await prisma.event.findMany({
      where: {
        organizationId: dbUser.organizationId,
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 500, // Limit for performance
    })

    const rows = events.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      status: e.status,
    }))

    return {
      success: true,
      schema: [
        { id: 'title', name: 'Title', type: 'text' },
        { id: 'type', name: 'Type', type: 'text' },
        { id: 'startTime', name: 'Start Time', type: 'date' },
        { id: 'endTime', name: 'End Time', type: 'date' },
        { id: 'location', name: 'Location', type: 'text' },
        { id: 'status', name: 'Status', type: 'text' },
      ],
      data: rows,
      meta: {
        tableName: 'Events',
        description: 'Training sessions, matches, and events',
        recordCount: events.length,
      },
    }
  } catch (error) {
    console.error('Error fetching events data:', error)
    return { error: 'Failed to fetch events data' }
  }
}
