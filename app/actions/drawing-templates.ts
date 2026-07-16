'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { isPlatformAdmin } from '@/lib/platform-admin'

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
    // Only platform admins may publish a drawing template globally
    // (organizationId: null, visible to every org). A regular caller's
    // isGlobal request is silently downgraded to an org-scoped template
    // instead of trusting client-supplied input.
    const isGlobal = templateData.isGlobal === true && (await isPlatformAdmin())

    const template = await prisma.drawingTemplate.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        sport: templateData.sport || 'football',
        data: templateData.data,
        thumbnailUrl: templateData.thumbnailUrl,
        isGlobal,
        organizationId: isGlobal ? null : dbUser.organizationId,
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
  'use server'

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Auth error in incrementTemplateDownloads:', authError)
    return { error: 'Unauthorized' }
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true }
    })

    if (!dbUser) {
      return { error: 'User not found' }
    }

    // Scope the update: only global templates or templates belonging to the
    // caller's own org may be incremented. An unscoped `update({ where: { id } })`
    // would let any authenticated user mutate any other org's private template.
    const result = await prisma.drawingTemplate.updateMany({
      where: {
        id,
        OR: [
          { isGlobal: true },
          { organizationId: dbUser.organizationId },
        ],
      },
      data: {
        downloads: {
          increment: 1,
        },
      },
    })

    if (result.count === 0) {
      return { error: 'Template not found' }
    }

    revalidatePath('/dashboard/canvas')
    return { success: true }
  } catch (error) {
    console.error('Error incrementing downloads:', error)
    return { error: 'Failed to increment downloads' }
  }
}
