'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type DrawingData = {
  id?: string
  name: string
  description?: string
  type?: string
  tags?: string[]
  data: any // Excalidraw scene data
  thumbnailUrl?: string
  linkedToType?: string
  linkedToId?: string
  templateId?: string
  isTemplate?: boolean
  isPublic?: boolean
}

export async function createDrawing(drawingData: DrawingData) {
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
    const drawing = await prisma.drawing.create({
      data: {
        name: drawingData.name,
        description: drawingData.description,
        type: drawingData.type,
        tags: drawingData.tags || [],
        data: drawingData.data,
        thumbnailUrl: drawingData.thumbnailUrl,
        linkedToType: drawingData.linkedToType,
        linkedToId: drawingData.linkedToId,
        templateId: drawingData.templateId,
        isTemplate: drawingData.isTemplate || false,
        isPublic: drawingData.isPublic || false,
        organizationId: dbUser.organizationId,
        createdBy: dbUser.id,
      },
    })

    revalidatePath('/dashboard/canvas')
    return { success: true, drawing }
  } catch (error) {
    console.error('Error creating drawing:', error)
    return { error: 'Failed to create drawing' }
  }
}

export async function updateDrawing(id: string, drawingData: Partial<DrawingData>) {
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
    // Verify ownership or organization access
    const existingDrawing = await prisma.drawing.findFirst({
      where: {
        id,
        organizationId: dbUser.organizationId,
      },
    })

    if (!existingDrawing) {
      return { error: 'Drawing not found or access denied' }
    }

    const drawing = await prisma.drawing.update({
      where: { id },
      data: {
        name: drawingData.name,
        description: drawingData.description,
        type: drawingData.type,
        tags: drawingData.tags,
        data: drawingData.data,
        thumbnailUrl: drawingData.thumbnailUrl,
        linkedToType: drawingData.linkedToType,
        linkedToId: drawingData.linkedToId,
        isPublic: drawingData.isPublic,
      },
    })

    revalidatePath('/dashboard/canvas')
    revalidatePath(`/dashboard/canvas/${id}`)
    return { success: true, drawing }
  } catch (error) {
    console.error('Error updating drawing:', error)
    return { error: 'Failed to update drawing' }
  }
}

export async function deleteDrawing(id: string) {
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
    // Verify ownership or organization access
    const existingDrawing = await prisma.drawing.findFirst({
      where: {
        id,
        organizationId: dbUser.organizationId,
      },
    })

    if (!existingDrawing) {
      return { error: 'Drawing not found or access denied' }
    }

    await prisma.drawing.delete({
      where: { id },
    })

    revalidatePath('/dashboard/canvas')
    return { success: true }
  } catch (error) {
    console.error('Error deleting drawing:', error)
    return { error: 'Failed to delete drawing' }
  }
}

export async function getDrawings(filters?: {
  type?: string
  tags?: string[]
  linkedToType?: string
  linkedToId?: string
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
      organizationId: dbUser.organizationId,
    }

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      }
    }

    if (filters?.linkedToType) {
      where.linkedToType = filters.linkedToType
    }

    if (filters?.linkedToId) {
      where.linkedToId = filters.linkedToId
    }

    const drawings = await prisma.drawing.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        template: true,
      },
    })

    return { success: true, drawings }
  } catch (error) {
    console.error('Error fetching drawings:', error)
    return { error: 'Failed to fetch drawings' }
  }
}

export async function getDrawing(id: string) {
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
    const drawing = await prisma.drawing.findFirst({
      where: {
        id,
        organizationId: dbUser.organizationId,
      },
      include: {
        template: true,
      },
    })

    if (!drawing) {
      return { error: 'Drawing not found' }
    }

    return { success: true, drawing }
  } catch (error) {
    console.error('Error fetching drawing:', error)
    return { error: 'Failed to fetch drawing' }
  }
}

export async function duplicateDrawing(id: string) {
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
    const originalDrawing = await prisma.drawing.findFirst({
      where: {
        id,
        organizationId: dbUser.organizationId,
      },
    })

    if (!originalDrawing) {
      return { error: 'Drawing not found' }
    }

    const drawing = await prisma.drawing.create({
      data: {
        name: `${originalDrawing.name} (Copy)`,
        description: originalDrawing.description,
        type: originalDrawing.type,
        tags: originalDrawing.tags,
        data: originalDrawing.data,
        templateId: originalDrawing.templateId,
        organizationId: dbUser.organizationId,
        createdBy: dbUser.id,
      },
    })

    revalidatePath('/dashboard/canvas')
    return { success: true, drawing }
  } catch (error) {
    console.error('Error duplicating drawing:', error)
    return { error: 'Failed to duplicate drawing' }
  }
}
