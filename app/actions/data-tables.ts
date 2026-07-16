'use server'

import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { getCachedUserWithOrganization, requireUser } from '@/lib/auth/cached-user'
import { playersSchema, playerToRow, rowToPlayer } from '@/lib/data-tables/players-schema'
import { SpreadsheetRow, ColumnDefinition } from '@/lib/types/spreadsheet'

// Note: Cannot export constants in "use server" files - cache configured inline per function

/**
 * Get Players data as spreadsheet format
 * Now with pagination support for better performance
 */
export async function getPlayersData(page: number = 1, limit: number = 100) {
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const skip = (page - 1) * limit

    // Fetch players with pagination
    const [players, totalCount] = await Promise.all([
      prisma.personOrganization.findMany({
        where: {
          organizationId: user.organizationId,
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
        take: limit,
        skip,
      }),
      prisma.personOrganization.count({
        where: {
          organizationId: user.organizationId,
          role: 'player',
        },
      }),
    ])

    // Transform to spreadsheet rows
    const rows = players.map(playerToRow)

    return {
      success: true,
      schema: playersSchema,
      data: rows,
      meta: {
        tableName: 'Players',
        description: 'All players in your organization',
        recordCount: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
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
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const staff = await prisma.personOrganization.findMany({
      where: {
        organizationId: user.organizationId,
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

    const schema: ColumnDefinition[] = [
      { id: 'firstName', name: 'First Name', type: 'text' },
      { id: 'lastName', name: 'Last Name', type: 'text' },
      { id: 'role', name: 'Role', type: 'text' },
      { id: 'phone', name: 'Phone', type: 'text' },
      { id: 'email', name: 'Email', type: 'text' },
      { id: 'joinedAt', name: 'Joined', type: 'date' },
    ]

    return {
      success: true,
      schema,
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
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const events = await prisma.event.findMany({
      where: {
        organizationId: user.organizationId,
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
      location: e.location || '',
      isRecurring: e.isRecurring,
    }))

    const schema: ColumnDefinition[] = [
      { id: 'title', name: 'Title', type: 'text' },
      { id: 'type', name: 'Type', type: 'text' },
      { id: 'startTime', name: 'Start Time', type: 'date' },
      { id: 'endTime', name: 'End Time', type: 'date' },
      { id: 'location', name: 'Location', type: 'text' },
      { id: 'isRecurring', name: 'Recurring', type: 'text' },
    ]

    return {
      success: true,
      schema,
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

/**
 * Save changes to players data
 */
export async function savePlayersData(changes: SpreadsheetRow[]) {

  try {
    const user = await requireUser()

    // Process each changed row
    for (const row of changes) {
      if (!row.id) continue

      const playerData = rowToPlayer(row)

      // Get the PersonOrganization record to find personId
      const personOrg = await prisma.personOrganization.findUnique({
        where: { id: row.id as string },
        select: { personId: true, organizationId: true },
      })

      if (!personOrg || personOrg.organizationId !== user.organizationId) continue

      // Update Person data
      await prisma.person.update({
        where: { id: personOrg.personId },
        data: playerData.person,
      })

      // Update PersonOrganization data
      await prisma.personOrganization.update({
        where: { id: row.id as string },
        data: {
          ...playerData.personOrg,
          joinedAt: row.joinedAt ? new Date(row.joinedAt as string) : undefined,
        },
      })

      // Note: DataChangeLog is currently designed for spreadsheet changes
      // For player data changes, we would need to either:
      // 1. Link to a spreadsheet (if player data is in a spreadsheet)
      // 2. Create a separate audit log table for non-spreadsheet entities
      // TODO: Implement proper audit logging for player data changes
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving players data:', error)
    return { success: false, error: 'Failed to save changes' }
  }
}
