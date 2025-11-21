'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'

type CreateTemplateInput = {
  type: string
  name: string
  description: string
  longDescription?: string
  category: string
  sport: string
  tags: string[]
  features: string[]
  config: any
  previewImage?: string
  thumbnailUrl?: string
  isPublic?: boolean
  allowModifications?: boolean
}

export async function getTemplates(params?: {
  type?: string
  category?: string
  sport?: string
  search?: string
  sort?: 'popular' | 'rating' | 'newest'
  isFeatured?: boolean
  isOfficial?: boolean
  page?: number
  pageSize?: number
}) {
  try {
    const {
      type,
      category,
      sport,
      search,
      sort = 'popular',
      isFeatured,
      isOfficial,
      page = 0,
      pageSize = 20,
    } = params || {}

    const where: any = {
      status: 'published',
      isPublic: true,
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (sport && sport !== 'all') {
      where.sport = sport
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured
    }

    if (isOfficial !== undefined) {
      where.isOfficial = isOfficial
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    // Determine order by
    let orderBy: any = {}
    switch (sort) {
      case 'popular':
        orderBy = { downloads: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'newest':
        orderBy = { publishedAt: 'desc' }
        break
      default:
        orderBy = { downloads: 'desc' }
    }

    const [templates, total] = await Promise.all([
      prisma.communityTemplate.findMany({
        where,
        orderBy,
        skip: page * pageSize,
        take: pageSize,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              usages: true,
            },
          },
        },
      }),
      prisma.communityTemplate.count({ where }),
    ])

    return { templates, total }
  } catch (error) {
    console.error('Error fetching templates:', error)
    return { error: 'Failed to fetch templates', templates: [], total: 0 }
  }
}

export async function getTemplateById(id: string) {
  try {
    const template = await prisma.communityTemplate.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            usages: true,
          },
        },
      },
    })

    if (!template) {
      return { error: 'Template not found' }
    }

    return { template }
  } catch (error) {
    console.error('Error fetching template:', error)
    return { error: 'Failed to fetch template' }
  }
}

export async function createTemplate(data: CreateTemplateInput) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await ensureUserWithOrganization(user)

    const template = await prisma.communityTemplate.create({
      data: {
        ...data,
        authorId: dbUser.id,
        authorName: dbUser.name,
        orgName: user.organization.name,
        status: 'published', // Auto-publish for now
        publishedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/templates')
    revalidatePath('/dashboard/templates/my-templates')

    return { template }
  } catch (error) {
    console.error('Error creating template:', error)
    return { error: 'Failed to create template' }
  }
}

export async function updateTemplate(id: string, data: Partial<CreateTemplateInput>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership
    const existing = await prisma.communityTemplate.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existing) {
      return { error: 'Template not found' }
    }

    if (existing.authorId !== dbUser.id) {
      return { error: 'Unauthorized' }
    }

    const template = await prisma.communityTemplate.update({
      where: { id },
      data,
    })

    revalidatePath('/dashboard/templates')
    revalidatePath('/dashboard/templates/my-templates')
    revalidatePath(`/dashboard/templates/${id}`)

    return { template }
  } catch (error) {
    console.error('Error updating template:', error)
    return { error: 'Failed to update template' }
  }
}

export async function deleteTemplate(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership
    const existing = await prisma.communityTemplate.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existing) {
      return { error: 'Template not found' }
    }

    if (existing.authorId !== dbUser.id) {
      return { error: 'Unauthorized' }
    }

    await prisma.communityTemplate.delete({
      where: { id },
    })

    revalidatePath('/dashboard/templates')
    revalidatePath('/dashboard/templates/my-templates')

    return { success: true }
  } catch (error) {
    console.error('Error deleting template:', error)
    return { error: 'Failed to delete template' }
  }
}

export async function getUserTemplates() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await ensureUserWithOrganization(user)

    const templates = await prisma.communityTemplate.findMany({
      where: {
        authorId: dbUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            reviews: true,
            usages: true,
          },
        },
      },
    })

    return { templates }
  } catch (error) {
    console.error('Error fetching user templates:', error)
    return { error: 'Failed to fetch templates', templates: [] }
  }
}

export async function createReview(templateId: string, rating: number, content: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await ensureUserWithOrganization(user)

    // Check if user has already reviewed
    const existing = await prisma.templateReview.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: dbUser.id,
        },
      },
    })

    if (existing) {
      return { error: 'You have already reviewed this template' }
    }

    const review = await prisma.templateReview.create({
      data: {
        templateId,
        userId: dbUser.id,
        rating,
        content,
      },
    })

    // Update template rating
    const reviews = await prisma.templateReview.findMany({
      where: { templateId },
      select: { rating: true },
    })

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.communityTemplate.update({
      where: { id: templateId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    })

    revalidatePath(`/dashboard/templates/${templateId}`)

    return { review }
  } catch (error) {
    console.error('Error creating review:', error)
    return { error: 'Failed to create review' }
  }
}

export async function recordTemplateUsage(
  templateId: string,
  createdType: string,
  createdId?: string,
  createdName?: string
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await ensureUserWithOrganization(user)

    await prisma.templateUsage.create({
      data: {
        templateId,
        userId: dbUser.id,
        createdType,
        createdId,
        createdName,
      },
    })

    // Increment download count
    await prisma.communityTemplate.update({
      where: { id: templateId },
      data: {
        downloads: { increment: 1 },
        usageCount: { increment: 1 },
      },
    })

    revalidatePath(`/dashboard/templates/${templateId}`)

    return { success: true }
  } catch (error) {
    console.error('Error recording template usage:', error)
    return { error: 'Failed to record usage' }
  }
}

export async function getFeaturedTemplates() {
  try {
    const templates = await prisma.communityTemplate.findMany({
      where: {
        status: 'published',
        isPublic: true,
        isFeatured: true,
      },
      orderBy: {
        downloads: 'desc',
      },
      take: 6,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    return { templates }
  } catch (error) {
    console.error('Error fetching featured templates:', error)
    return { error: 'Failed to fetch featured templates', templates: [] }
  }
}

export async function getStarterTemplates() {
  try {
    const templates = await prisma.communityTemplate.findMany({
      where: {
        status: 'published',
        isPublic: true,
        isOfficial: true,
      },
      orderBy: {
        downloads: 'desc',
      },
      take: 12,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    return { templates }
  } catch (error) {
    console.error('Error fetching starter templates:', error)
    return { error: 'Failed to fetch starter templates', templates: [] }
  }
}
