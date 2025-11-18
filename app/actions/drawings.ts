'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath, unstable_cache } from 'next/cache'
import { z } from 'zod'

// Excalidraw data validation schema
const ExcalidrawElementSchema = z.object({
  id: z.string(),
  type: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  angle: z.number().optional(),
  strokeColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  fillStyle: z.string().optional(),
  strokeWidth: z.number().optional(),
  strokeStyle: z.string().optional(),
  roughness: z.number().optional(),
  opacity: z.number().optional(),
  groupIds: z.array(z.string()).optional(),
  frameId: z.string().nullable().optional(),
  roundness: z.any().optional(),
  seed: z.number().optional(),
  version: z.number().optional(),
  versionNonce: z.number().optional(),
  isDeleted: z.boolean().optional(),
  boundElements: z.any().optional(),
  updated: z.number().optional(),
  link: z.string().nullable().optional(),
  locked: z.boolean().optional(),
}).passthrough() // Allow additional properties for different element types

const ExcalidrawDataSchema = z.object({
  elements: z.array(ExcalidrawElementSchema),
  appState: z.object({
    viewBackgroundColor: z.string().optional(),
    gridSize: z.number().nullable().optional(),
  }).passthrough(), // Allow other appState properties
  files: z.any(),
})

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

  if (!dbUser.organizationId) {
    return { error: 'User must belong to an organization' }
  }

  // Validate Excalidraw data structure
  if (!drawingData.data || typeof drawingData.data !== 'object') {
    return { error: 'Invalid drawing data: data must be an object' }
  }

  // Validate against Excalidraw schema
  const validationResult = ExcalidrawDataSchema.safeParse(drawingData.data)
  if (!validationResult.success) {
    console.error('Invalid Excalidraw data structure:', validationResult.error.format())
    return {
      error: 'Invalid drawing data structure. Please ensure the drawing data is properly formatted.',
    }
  }

  try {
    // Verify Prisma client is properly initialized
    if (!prisma) {
      console.error('Prisma client is not initialized')
      return { error: 'Database connection error. Please try again.' }
    }

    if (!prisma.drawing) {
      console.error('Prisma drawing model is not available. Prisma client may need regeneration.')
      console.error('Available models:', Object.keys(prisma).filter(key => !key.startsWith('_')))
      return { error: 'Database model error. Please contact support.' }
    }

    console.log('Creating drawing with:', {
      name: drawingData.name,
      organizationId: dbUser.organizationId,
      createdBy: dbUser.id,
      hasData: !!drawingData.data,
      dataType: typeof drawingData.data,
    })

    const drawing = await prisma.drawing.create({
      data: {
        name: drawingData.name,
        description: drawingData.description,
        type: drawingData.type,
        tags: drawingData.tags || [],
        data: drawingData.data as any, // Prisma will handle JSON serialization
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
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { error: `Failed to create drawing: ${errorMessage}` }
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

  // Validate drawing data if provided
  if (drawingData.data) {
    const validationResult = ExcalidrawDataSchema.safeParse(drawingData.data)
    if (!validationResult.success) {
      console.error('Invalid Excalidraw data structure:', validationResult.error.format())
      return {
        error: 'Invalid drawing data structure. Please ensure the drawing data is properly formatted.',
      }
    }
  }

  try {
    // Verify ownership or organization access
    const existingDrawing = await prisma.drawing.findFirst({
      where: {
        id,
        organizationId: dbUser.organizationId,
      },
      select: {
        id: true,
        updatedAt: true,
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

// Cached version for frequently accessed data (no filters)
const getCachedDrawings = unstable_cache(
  async (organizationId: string, page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize

    const [total, drawings] = await Promise.all([
      prisma.drawing.count({
        where: { organizationId },
      }),
      prisma.drawing.findMany({
        where: { organizationId },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          tags: true,
          thumbnailUrl: true,
          createdAt: true,
          updatedAt: true,
          linkedToType: true,
          linkedToId: true,
          isTemplate: true,
          isPublic: true,
          createdBy: true,
          organizationId: true,
          templateId: true,
          template: {
            select: {
              name: true,
              category: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
    ])

    return {
      success: true,
      drawings,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + drawings.length < total,
    }
  },
  ['drawings-list'],
  { revalidate: 60 } // Cache for 60 seconds
)

export async function getDrawings(filters?: {
  type?: string
  tags?: string[]
  linkedToType?: string
  linkedToId?: string
  page?: number
  pageSize?: number
  search?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', drawings: [], total: 0 }
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { organizationId: true }
  })

  if (!dbUser) {
    return { error: 'User not found', drawings: [], total: 0 }
  }

  if (!dbUser.organizationId) {
    return { error: 'User must belong to an organization', drawings: [], total: 0 }
  }

  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 20 // Default to 20 for better initial load performance
  const skip = (page - 1) * pageSize

  try {
    // Use cached version for simple queries (no filters)
    const hasFilters = filters?.type || filters?.tags?.length || filters?.linkedToType ||
                      filters?.linkedToId || filters?.search

    if (!hasFilters) {
      // Use cached version for better performance
      return await getCachedDrawings(dbUser.organizationId, page, pageSize)
    }

    // Build complex query for filtered results
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

    // Add search functionality - use optimized queries
    if (filters?.search) {
      const searchTerm = filters.search.trim()
      if (searchTerm) {
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          // Search in tags array
          { tags: { hasSome: [searchTerm] } },
        ]
      }
    }

    // Get total count and drawings for filtered results
    const [total, drawings] = await Promise.all([
      prisma.drawing.count({ where }),
      prisma.drawing.findMany({
        where,
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          tags: true,
          thumbnailUrl: true,
          createdAt: true,
          updatedAt: true,
          linkedToType: true,
          linkedToId: true,
          isTemplate: true,
          isPublic: true,
          createdBy: true,
          organizationId: true,
          templateId: true,
          // Exclude the large 'data' field for list view performance
          template: {
            select: {
              name: true,
              category: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
    ])

    return {
      success: true,
      drawings,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + drawings.length < total,
    }
  } catch (error) {
    console.error('Error fetching drawings:', error)
    return { error: 'Failed to fetch drawings', drawings: [], total: 0 }
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
        data: originalDrawing.data as any,
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
