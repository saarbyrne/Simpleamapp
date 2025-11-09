'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import type { Prisma } from '@prisma/client'
import { RRule, rrulestr } from 'rrule'
import { randomUUID } from 'crypto'

export interface CreateEventData {
  title: string
  description?: string
  type: 'training' | 'match' | 'medical' | 'meeting' | 'other'
  startTime: string
  endTime: string
  location?: string
  templateId?: string
  linkedFormId?: string
  attendeeIds?: string[] // PersonOrganization IDs
  recurrenceRule?: string // RRule string for recurring events
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface EventWithDetails {
  id: string
  title: string
  description: string | null
  type: string
  startTime: Date
  endTime: Date
  location: string | null
  isRecurring: boolean
  recurringRule: any
  linkedFormId: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
  attendance: Array<{
    id: string
    status: string
    notes: string | null
    personOrg: {
      id: string
      person: {
        id: string
        firstName: string
        lastName: string
        photo: string | null
      }
      role: string
      position: string | null
      jerseyNumber: number | null
    }
  }>
}

/**
 * Get all events for the current user's organization
 */
export async function getEvents(startDate?: Date, endDate?: Date) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const whereClause: any = {
      organizationId: dbUser.organizationId,
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      whereClause.AND = []
      if (startDate) {
        whereClause.AND.push({ startTime: { gte: startDate } })
      }
      if (endDate) {
        whereClause.AND.push({ startTime: { lte: endDate } })
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startTime: 'asc' },
      include: {
        attendance: {
          include: {
            personOrg: {
              include: {
                person: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    photo: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    return { success: true, events }
  } catch (error) {
    console.error('Error fetching events:', error)
    return { error: 'Failed to fetch events' }
  }
}

/**
 * Get a single event by ID with full details
 */
export async function getEvent(eventId: string): Promise<{ success: true, event: EventWithDetails } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId: dbUser.organizationId,
      },
      include: {
        attendance: {
          include: {
            personOrg: {
              include: {
                person: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    photo: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!event) {
      return { error: 'Event not found' }
    }

    return { success: true, event: event as EventWithDetails }
  } catch (error) {
    console.error('Error fetching event:', error)
    return { error: 'Failed to fetch event' }
  }
}

/**
 * Create a new event (handles both single and recurring events)
 */
export async function createEvent(data: CreateEventData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if this is a recurring event
    const isRecurring = !!data.recurrenceRule

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (isRecurring && data.recurrenceRule) {
        // Generate series ID for recurring events
        const seriesId = randomUUID()

        // Parse the rrule to get all occurrence dates
        const rule = rrulestr(data.recurrenceRule)
        const startTime = new Date(data.startTime)
        const endTime = new Date(data.endTime)
        const duration = endTime.getTime() - startTime.getTime()

        // Generate occurrences (limit to 500 to prevent abuse)
        const occurrences = rule.all((date, i) => i < 500)

        if (occurrences.length === 0) {
          throw new Error('No occurrences generated from recurrence rule')
        }

        // Create all event instances
        const events = []
        for (const occurrence of occurrences) {
          const instanceStartTime = new Date(occurrence)
          const instanceEndTime = new Date(instanceStartTime.getTime() + duration)

          const event = await tx.event.create({
            data: {
              title: data.title,
              description: data.description,
              type: data.type,
              startTime: instanceStartTime,
              endTime: instanceEndTime,
              location: data.location,
              templateId: data.templateId,
              linkedFormId: data.linkedFormId,
              organizationId: dbUser.organizationId,
              isRecurring: true,
              recurringRule: data.recurrenceRule,
              seriesId: seriesId,
            }
          })

          // Add attendees if provided
          if (data.attendeeIds && data.attendeeIds.length > 0) {
            await tx.eventAttendance.createMany({
              data: data.attendeeIds.map(personOrgId => ({
                eventId: event.id,
                personOrgId,
                status: 'invited',
              }))
            })
          }

          events.push(event)
        }

        // Log activity
        await tx.activity.create({
          data: {
            type: 'event_created',
            data: {
              eventTitle: data.title,
              eventType: data.type,
              startTime: events[0].startTime.toISOString(),
              isRecurring: true,
              instancesCreated: events.length,
            },
            userId: user.id,
          }
        })

        return events[0] // Return first instance
      } else {
        // Create single event
        const event = await tx.event.create({
          data: {
            title: data.title,
            description: data.description,
            type: data.type,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            location: data.location,
            templateId: data.templateId,
            linkedFormId: data.linkedFormId,
            organizationId: dbUser.organizationId,
            isRecurring: false,
          }
        })

        // Add attendees if provided
        if (data.attendeeIds && data.attendeeIds.length > 0) {
          await tx.eventAttendance.createMany({
            data: data.attendeeIds.map(personOrgId => ({
              eventId: event.id,
              personOrgId,
              status: 'invited',
            }))
          })
        }

        // Log activity
        await tx.activity.create({
          data: {
            type: 'event_created',
            data: {
              eventTitle: event.title,
              eventType: event.type,
              startTime: event.startTime.toISOString(),
            },
            userId: user.id,
          }
        })

        return event
      }
    })

    revalidatePath('/dashboard/calendar')

    return { success: true, event: result }
  } catch (error) {
    console.error('Error creating event:', error)
    return { error: 'Failed to create event' }
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(eventId: string, data: UpdateEventData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Verify ownership
      const existingEvent = await tx.event.findFirst({
        where: {
          id: eventId,
          organizationId: dbUser.organizationId,
        }
      })

      if (!existingEvent) {
        throw new Error('Event not found')
      }

      // Update event
      const updateData: any = {}
      if (data.title !== undefined) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.type !== undefined) updateData.type = data.type
      if (data.startTime !== undefined) updateData.startTime = new Date(data.startTime)
      if (data.endTime !== undefined) updateData.endTime = new Date(data.endTime)
      if (data.location !== undefined) updateData.location = data.location
      if (data.linkedFormId !== undefined) updateData.linkedFormId = data.linkedFormId

      const event = await tx.event.update({
        where: { id: eventId },
        data: updateData,
      })

      // Update attendees if provided
      if (data.attendeeIds !== undefined) {
        // Remove existing attendees
        await tx.eventAttendance.deleteMany({
          where: { eventId }
        })

        // Add new attendees
        if (data.attendeeIds.length > 0) {
          await tx.eventAttendance.createMany({
            data: data.attendeeIds.map(personOrgId => ({
              eventId: event.id,
              personOrgId,
              status: 'invited',
            }))
          })
        }
      }

      // Log activity
      await tx.activity.create({
        data: {
          type: 'event_updated',
          data: {
            eventTitle: event.title,
            eventType: event.type,
          },
          userId: user.id,
        }
      })

      return event
    })

    revalidatePath('/dashboard/calendar')

    return { success: true, event: result }
  } catch (error) {
    console.error('Error updating event:', error)
    return { error: 'Failed to update event' }
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Verify ownership
      const event = await tx.event.findFirst({
        where: {
          id: eventId,
          organizationId: dbUser.organizationId,
        }
      })

      if (!event) {
        throw new Error('Event not found')
      }

      // Delete event (cascade will handle attendance)
      await tx.event.delete({
        where: { id: eventId }
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'event_deleted',
          data: {
            eventTitle: event.title,
            eventType: event.type,
          },
          userId: user.id,
        }
      })
    })

    revalidatePath('/dashboard/calendar')

    return { success: true }
  } catch (error) {
    console.error('Error deleting event:', error)
    return { error: 'Failed to delete event' }
  }
}

/**
 * Delete all events in a recurring series
 */
export async function deleteEventSeries(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get the event to find its series ID
      const event = await tx.event.findFirst({
        where: {
          id: eventId,
          organizationId: dbUser.organizationId,
        }
      })

      if (!event) {
        throw new Error('Event not found')
      }

      if (!event.seriesId) {
        throw new Error('Event is not part of a recurring series')
      }

      // Delete all events in the series
      const deleted = await tx.event.deleteMany({
        where: {
          seriesId: event.seriesId,
          organizationId: dbUser.organizationId,
        }
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'event_series_deleted',
          data: {
            eventTitle: event.title,
            eventType: event.type,
            instancesDeleted: deleted.count,
          },
          userId: user.id,
        }
      })
    })

    revalidatePath('/dashboard/calendar')

    return { success: true }
  } catch (error) {
    console.error('Error deleting event series:', error)
    return { error: 'Failed to delete event series' }
  }
}

/**
 * Update all events in a recurring series
 */
export async function updateEventSeries(eventId: string, data: UpdateEventData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get the event to find its series ID
      const event = await tx.event.findFirst({
        where: {
          id: eventId,
          organizationId: dbUser.organizationId,
        }
      })

      if (!event) {
        throw new Error('Event not found')
      }

      if (!event.seriesId) {
        throw new Error('Event is not part of a recurring series')
      }

      // Build update data (exclude time fields as they're specific to each instance)
      const updateData: any = {}
      if (data.title !== undefined) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.type !== undefined) updateData.type = data.type
      if (data.location !== undefined) updateData.location = data.location
      if (data.linkedFormId !== undefined) updateData.linkedFormId = data.linkedFormId

      // Update all events in the series
      const updated = await tx.event.updateMany({
        where: {
          seriesId: event.seriesId,
          organizationId: dbUser.organizationId,
        },
        data: updateData
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'event_series_updated',
          data: {
            eventTitle: event.title,
            eventType: event.type,
            instancesUpdated: updated.count,
          },
          userId: user.id,
        }
      })
    })

    revalidatePath('/dashboard/calendar')

    return { success: true }
  } catch (error) {
    console.error('Error updating event series:', error)
    return { error: 'Failed to update event series' }
  }
}

/**
 * Update attendance for an event
 */
export async function updateAttendance(
  eventId: string,
  personOrgId: string,
  status: 'invited' | 'attending' | 'absent' | 'excused',
  notes?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify event belongs to organization
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId: dbUser.organizationId,
      }
    })

    if (!event) {
      return { error: 'Event not found' }
    }

    // Upsert attendance
    const attendance = await prisma.eventAttendance.upsert({
      where: {
        eventId_personOrgId: {
          eventId,
          personOrgId,
        }
      },
      create: {
        eventId,
        personOrgId,
        userId: user.id,
        status,
        notes,
      },
      update: {
        status,
        notes,
        userId: user.id,
      }
    })

    revalidatePath('/dashboard/calendar')

    return { success: true, attendance }
  } catch (error) {
    console.error('Error updating attendance:', error)
    return { error: 'Failed to update attendance' }
  }
}

/**
 * Get all players for the current organization (for attendee selection)
 */
export async function getOrganizationPlayers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

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
          }
        }
      },
      orderBy: [
        { person: { lastName: 'asc' } },
        { person: { firstName: 'asc' } }
      ]
    })

    return { success: true, players }
  } catch (error) {
    console.error('Error fetching players:', error)
    return { error: 'Failed to fetch players' }
  }
}
