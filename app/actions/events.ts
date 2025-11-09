'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'

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
  attendance?: Array<{
    id: string
    status: string
    notes: string | null
    personOrgId: string
    personOrg?: {
      person: {
        firstName: string
        lastName: string
        photo: string | null
      }
      jerseyNumber: number | null
    }
  }>
}

export async function getEvent(eventId: string) {
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
                    firstName: true,
                    lastName: true,
                    photo: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!event) {
      return { error: 'Event not found' }
    }

    const eventWithDetails: EventWithDetails = {
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      isRecurring: event.isRecurring,
      recurringRule: event.recurringRule,
      attendance: event.attendance.map((att) => ({
        id: att.id,
        status: att.status,
        notes: att.notes,
        personOrgId: att.personOrgId,
        personOrg: {
          person: {
            firstName: att.personOrg.person.firstName,
            lastName: att.personOrg.person.lastName,
            photo: att.personOrg.person.photo,
          },
          jerseyNumber: att.personOrg.jerseyNumber,
        },
      })),
    }

    return { event: eventWithDetails }
  } catch (error) {
    console.error('Error fetching event:', error)
    return { error: 'Failed to fetch event' }
  }
}

export async function deleteEvent(eventId: string) {
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
      },
    })

    if (!event) {
      return { error: 'Event not found' }
    }

    // Delete event (attendance will cascade)
    await prisma.event.delete({
      where: { id: eventId },
    })

    revalidatePath('/dashboard/calendar')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting event:', error)
    return { error: 'Failed to delete event' }
  }
}

export async function deleteEventSeries(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get the event to check if it's recurring
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId: dbUser.organizationId,
      },
      select: {
        id: true,
        isRecurring: true,
        recurringRule: true,
      },
    })

    if (!event) {
      return { error: 'Event not found' }
    }

    if (!event.isRecurring || !event.recurringRule) {
      // If not recurring, just delete the single event
      await prisma.event.delete({
        where: { id: eventId },
      })
    } else {
      // For recurring events, we need to identify all events in the series
      // This is a simplified implementation - in a real app, you'd need to track
      // which events belong to the same series (e.g., via a parentEventId or seriesId)
      // For now, we'll delete all events with the same recurringRule pattern
      // This is a basic implementation - you may want to improve this logic
      
      await prisma.event.deleteMany({
        where: {
          organizationId: dbUser.organizationId,
          isRecurring: true,
          // Note: This is a simplified approach. In production, you'd want
          // a better way to identify events in the same series
          recurringRule: event.recurringRule,
        },
      })
    }

    revalidatePath('/dashboard/calendar')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting event series:', error)
    return { error: 'Failed to delete event series' }
  }
}

