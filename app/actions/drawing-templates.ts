'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type DrawingTemplateData = {
  name: string
  description?: string
  category: string
  sport?: string
  data: any // Excalidraw scene data
  thumbnailUrl?: string
  isGlobal?: boolean
}

export async function createDrawingTemplate(templateData: DrawingTemplateData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { id: true, organizationId: true }
  })

  if (!dbUser) {
    return { error: 'User not found' }
  }

  try {
    const template = await prisma.drawingTemplate.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        sport: templateData.sport || 'football',
        data: templateData.data,
        thumbnailUrl: templateData.thumbnailUrl,
        isGlobal: templateData.isGlobal || false,
        organizationId: templateData.isGlobal ? null : dbUser.organizationId,
        createdBy: dbUser.id,
      },
    })

    revalidatePath('/dashboard/canvas')
    return { success: true, template }
  } catch (error) {
    console.error('Error creating template:', error)
    return { error: 'Failed to create template' }
  }
}

export async function getDrawingTemplates(filters?: {
  category?: string
  sport?: string
  isGlobal?: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { organizationId: true }
  })

  if (!dbUser) {
    return { error: 'User not found' }
  }

  try {
    const where: any = {
      OR: [
        { isGlobal: true },
        { organizationId: dbUser.organizationId },
      ],
    }

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.sport) {
      where.sport = filters.sport
    }

    if (filters?.isGlobal !== undefined) {
      where.isGlobal = filters.isGlobal
    }

    const templates = await prisma.drawingTemplate.findMany({
      where,
      orderBy: [
        { isGlobal: 'desc' },
        { downloads: 'desc' },
      ],
    })

    return { success: true, templates }
  } catch (error) {
    console.error('Error fetching templates:', error)
    return { error: 'Failed to fetch templates' }
  }
}

export async function getDrawingTemplate(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { organizationId: true }
  })

  if (!dbUser) {
    return { error: 'User not found' }
  }

  try {
    const template = await prisma.drawingTemplate.findFirst({
      where: {
        id,
        OR: [
          { isGlobal: true },
          { organizationId: dbUser.organizationId },
        ],
      },
    })

    if (!template) {
      return { error: 'Template not found' }
    }

    return { success: true, template }
  } catch (error) {
    console.error('Error fetching template:', error)
    return { error: 'Failed to fetch template' }
  }
}

export async function incrementTemplateDownloads(id: string) {
  try {
    await prisma.drawingTemplate.update({
      where: { id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error incrementing downloads:', error)
    return { error: 'Failed to increment downloads' }
  }
}

// Predefined global templates data
export const GLOBAL_TEMPLATES = {
  formations: [
    {
      name: '4-3-3 Formation',
      description: 'Classic 4-3-3 attacking formation',
      category: 'formation',
      sport: 'football',
    },
    {
      name: '4-4-2 Formation',
      description: 'Traditional 4-4-2 balanced formation',
      category: 'formation',
      sport: 'football',
    },
    {
      name: '3-5-2 Formation',
      description: 'Wing-back heavy formation',
      category: 'formation',
      sport: 'football',
    },
    {
      name: '4-2-3-1 Formation',
      description: 'Defensive midfield duo with attacking midfield',
      category: 'formation',
      sport: 'football',
    },
  ],
  setPieces: [
    {
      name: 'Corner Kick Routine',
      description: 'Attacking corner kick setup',
      category: 'set_piece',
      sport: 'football',
    },
    {
      name: 'Free Kick Wall Setup',
      description: 'Defensive wall positioning',
      category: 'set_piece',
      sport: 'football',
    },
  ],
  drills: [
    {
      name: 'Passing Drill (4 stations)',
      description: '4-corner passing and movement drill',
      category: 'drill',
      sport: 'football',
    },
    {
      name: 'Small-Sided Game (4v4)',
      description: 'Small-sided game layout',
      category: 'drill',
      sport: 'football',
    },
  ],
}
