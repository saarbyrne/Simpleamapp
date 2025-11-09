'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import type { Prisma } from '@prisma/client'

export interface CreateEventTemplateData {
  name: string
  description?: string
  type: 'training' | 'match' | 'medical' | 'meeting' | 'other'
  sections?: Record<string, boolean>
  sectionConfigs?: Record<string, any>
  defaultDuration?: number
}

export interface UpdateEventTemplateData extends Partial<CreateEventTemplateData> {}

export interface EventTemplateWithDetails {
  id: string
  name: string
  description: string | null
  type: string
  sections: any
  sectionConfigs: any
  defaultDuration: number
  isGlobal: boolean
  createdBy: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Get all templates for the current user's organization (including global templates)
 */
export async function getEventTemplates() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get both organization templates and global templates
    const templates = await prisma.eventTemplate.findMany({
      where: {
        OR: [
          { organizationId: dbUser.organizationId },
          { isGlobal: true }
        ]
      },
      orderBy: [
        { isGlobal: 'desc' }, // Global templates first
        { name: 'asc' }
      ]
    })

    return { success: true, templates }
  } catch (error) {
    console.error('Error fetching event templates:', error)
    return { error: 'Failed to fetch event templates' }
  }
}

/**
 * Get a single template by ID
 */
export async function getEventTemplate(templateId: string): Promise<{ success: true, template: EventTemplateWithDetails } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const template = await prisma.eventTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { organizationId: dbUser.organizationId },
          { isGlobal: true }
        ]
      }
    })

    if (!template) {
      return { error: 'Template not found' }
    }

    return { success: true, template: template as EventTemplateWithDetails }
  } catch (error) {
    console.error('Error fetching event template:', error)
    return { error: 'Failed to fetch event template' }
  }
}

/**
 * Create a new event template
 */
export async function createEventTemplate(data: CreateEventTemplateData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const template = await prisma.eventTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        sections: data.sections || {},
        sectionConfigs: data.sectionConfigs || {},
        defaultDuration: data.defaultDuration || 120,
        organizationId: dbUser.organizationId,
        createdBy: user.id,
      }
    })

    revalidatePath('/dashboard/calendar')

    return { success: true, template }
  } catch (error) {
    console.error('Error creating event template:', error)
    return { error: 'Failed to create event template' }
  }
}

/**
 * Update an existing event template
 */
export async function updateEventTemplate(templateId: string, data: UpdateEventTemplateData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership (cannot edit global templates)
    const existingTemplate = await prisma.eventTemplate.findFirst({
      where: {
        id: templateId,
        organizationId: dbUser.organizationId,
        isGlobal: false,
      }
    })

    if (!existingTemplate) {
      return { error: 'Template not found or cannot be edited' }
    }

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.sections !== undefined) updateData.sections = data.sections
    if (data.sectionConfigs !== undefined) updateData.sectionConfigs = data.sectionConfigs
    if (data.defaultDuration !== undefined) updateData.defaultDuration = data.defaultDuration

    const template = await prisma.eventTemplate.update({
      where: { id: templateId },
      data: updateData,
    })

    revalidatePath('/dashboard/calendar')

    return { success: true, template }
  } catch (error) {
    console.error('Error updating event template:', error)
    return { error: 'Failed to update event template' }
  }
}

/**
 * Delete an event template
 */
export async function deleteEventTemplate(templateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership (cannot delete global templates)
    const template = await prisma.eventTemplate.findFirst({
      where: {
        id: templateId,
        organizationId: dbUser.organizationId,
        isGlobal: false,
      }
    })

    if (!template) {
      return { error: 'Template not found or cannot be deleted' }
    }

    await prisma.eventTemplate.delete({
      where: { id: templateId }
    })

    revalidatePath('/dashboard/calendar')

    return { success: true }
  } catch (error) {
    console.error('Error deleting event template:', error)
    return { error: 'Failed to delete event template' }
  }
}

/**
 * Create event from template
 * This helper function prepares event data from a template
 */
export async function createEventFromTemplate(
  templateId: string,
  eventData: {
    title?: string
    startTime: string
    endTime?: string
    location?: string
    description?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get template
    const template = await prisma.eventTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { organizationId: dbUser.organizationId },
          { isGlobal: true }
        ]
      }
    })

    if (!template) {
      return { error: 'Template not found' }
    }

    // Calculate end time if not provided
    let endTime = eventData.endTime
    if (!endTime) {
      const start = new Date(eventData.startTime)
      const end = new Date(start.getTime() + template.defaultDuration * 60000)
      endTime = end.toISOString()
    }

    // Create event with template
    const event = await prisma.event.create({
      data: {
        title: eventData.title || template.name,
        description: eventData.description || template.description,
        type: template.type,
        startTime: new Date(eventData.startTime),
        endTime: new Date(endTime),
        location: eventData.location,
        organizationId: dbUser.organizationId,
        templateId: template.id,
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'event_created',
        data: {
          eventTitle: event.title,
          eventType: event.type,
          templateName: template.name,
          startTime: event.startTime.toISOString(),
        },
        userId: user.id,
      }
    })

    revalidatePath('/dashboard/calendar')

    return { success: true, event }
  } catch (error) {
    console.error('Error creating event from template:', error)
    return { error: 'Failed to create event from template' }
  }
}

/**
 * Seed default global templates
 * This should be run once during initial setup
 */
export async function seedDefaultTemplates() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const defaultTemplates = [
      {
        name: 'Match Day',
        description: 'Complete match day workflow with stats, analysis, and reports',
        type: 'match',
        defaultDuration: 120,
        sections: {
          spreadsheets: true,
          notes: true,
          drawings: true,
          forms: true,
          files: true,
        },
        sectionConfigs: {
          spreadsheets: [
            { name: 'Match Stats', columns: ['Player', 'Goals', 'Assists', 'Minutes'] },
            { name: 'Opposition Analysis', columns: ['Player', 'Position', 'Threat Level'] }
          ],
          notes: [
            { name: 'Coach Observations', privacy: 'coaching_staff' },
            { name: 'Medical Notes', privacy: 'medical_staff' }
          ],
          drawings: [
            { name: 'Formation', type: 'pitch' },
            { name: 'Set Pieces', type: 'tactics' }
          ],
          forms: [
            { name: 'Post-Match Report', trigger: 'after', delay: 30, recipients: 'coaching_staff' }
          ]
        },
        organizationId: dbUser.organizationId,
        isGlobal: false,
        createdBy: user.id,
      },
      {
        name: 'Training Session',
        description: 'Regular training session with drills, GPS data, and wellness checks',
        type: 'training',
        defaultDuration: 120,
        sections: {
          spreadsheets: true,
          notes: true,
          drawings: true,
          forms: true,
          files: false,
        },
        sectionConfigs: {
          spreadsheets: [
            { name: 'GPS Data', columns: ['Player', 'Distance', 'High Speed Runs', 'Sprints'] },
            { name: 'Drill Performance', columns: ['Drill', 'Duration', 'Intensity'] }
          ],
          notes: [
            { name: 'Session Plan', privacy: 'coaching_staff' }
          ],
          drawings: [
            { name: 'Session Plan Diagram', type: 'tactics' }
          ],
          forms: [
            { name: 'Wellness Check', trigger: 'after', delay: 90, recipients: 'all_players' }
          ]
        },
        organizationId: dbUser.organizationId,
        isGlobal: false,
        createdBy: user.id,
      },
      {
        name: 'Medical Assessment',
        description: 'Medical check-up or injury assessment',
        type: 'medical',
        defaultDuration: 60,
        sections: {
          spreadsheets: false,
          notes: true,
          drawings: false,
          forms: true,
          files: true,
        },
        sectionConfigs: {
          notes: [
            { name: 'Assessment Notes', privacy: 'medical_staff' },
            { name: 'Treatment Plan', privacy: 'medical_staff' }
          ],
          forms: [
            { name: 'Medical Assessment Form', trigger: 'during', delay: 0, recipients: 'medical_staff' }
          ],
          files: [
            { name: 'Medical Reports', type: 'documents' }
          ]
        },
        organizationId: dbUser.organizationId,
        isGlobal: false,
        createdBy: user.id,
      },
      {
        name: 'Team Meeting',
        description: 'Tactical analysis or team discussion',
        type: 'meeting',
        defaultDuration: 60,
        sections: {
          spreadsheets: false,
          notes: true,
          drawings: true,
          forms: false,
          files: true,
        },
        sectionConfigs: {
          notes: [
            { name: 'Meeting Notes', privacy: 'all_staff' }
          ],
          drawings: [
            { name: 'Tactical Board', type: 'tactics' }
          ],
          files: [
            { name: 'Presentation Materials', type: 'documents' }
          ]
        },
        organizationId: dbUser.organizationId,
        isGlobal: false,
        createdBy: user.id,
      },
      {
        name: 'Recovery Session',
        description: 'Post-match or post-training recovery',
        type: 'training',
        defaultDuration: 60,
        sections: {
          spreadsheets: true,
          notes: true,
          drawings: false,
          forms: true,
          files: false,
        },
        sectionConfigs: {
          spreadsheets: [
            { name: 'Recovery Metrics', columns: ['Player', 'Heart Rate', 'Sleep Quality', 'Soreness'] }
          ],
          notes: [
            { name: 'Recovery Plan', privacy: 'coaching_staff' }
          ],
          forms: [
            { name: 'Recovery Feedback', trigger: 'after', delay: 0, recipients: 'all_players' }
          ]
        },
        organizationId: dbUser.organizationId,
        isGlobal: false,
        createdBy: user.id,
      }
    ]

    const created = []
    for (const templateData of defaultTemplates) {
      const existing = await prisma.eventTemplate.findFirst({
        where: {
          name: templateData.name,
          organizationId: dbUser.organizationId,
        }
      })

      if (!existing) {
        const template = await prisma.eventTemplate.create({
          data: templateData
        })
        created.push(template)
      }
    }

    revalidatePath('/dashboard/calendar')

    return { success: true, created }
  } catch (error) {
    console.error('Error seeding default templates:', error)
    return { error: 'Failed to seed default templates' }
  }
}
