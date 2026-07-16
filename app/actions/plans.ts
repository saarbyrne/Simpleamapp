'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth/cached-user'
import { getTranslations } from 'next-intl/server'

interface CreatePlanData {
  name: string
  description?: string
  type: 'season' | 'player_development' | 'rehabilitation' | 'event_prep' | 'custom'
  startDate: Date | string
  endDate: Date | string
  linkedToType?: 'player' | 'event' | 'team' | 'person'
  linkedToId?: string
  ownerId?: string
  isPublic?: boolean
  isTemplate?: boolean
}

interface UpdatePlanData extends Partial<CreatePlanData> {
  status?: 'not_started' | 'in_progress' | 'complete' | 'on_hold'
}

export async function getPlans(page = 0, pageSize = 20, filters?: {
  type?: string
  status?: string
  ownerId?: string
  linkedToType?: string
  linkedToId?: string
}) {

  try {
    const user = await requireUser()

    const where: any = {
      organizationId: user.organizationId,
    }

    if (filters?.type) where.type = filters.type
    if (filters?.status) where.status = filters.status
    if (filters?.ownerId) where.ownerId = filters.ownerId
    if (filters?.linkedToType) where.linkedToType = filters.linkedToType
    if (filters?.linkedToId) where.linkedToId = filters.linkedToId

    const [plans, total] = await Promise.all([
      prisma.plan.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
            },
          },
          milestones: {
            select: {
              id: true,
              status: true,
            },
          },
          _count: {
            select: {
              milestones: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip: page * pageSize,
        take: pageSize,
      }),
      prisma.plan.count({ where }),
    ])

    return { plans, total, error: null }
  } catch (error) {
    console.error('Error fetching plans:', error)
    return { error: 'Failed to fetch plans', plans: [], total: 0 }
  }
}

export async function getPlan(id: string) {

  try {
    const user = await requireUser()

    const plan = await prisma.plan.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        milestones: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            links: true,
            comments: {
              include: {
                author: {
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
            },
            _count: {
              select: {
                links: true,
                comments: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!plan) {
      return { error: 'Plan not found', plan: null }
    }

    return { plan, error: null }
  } catch (error) {
    console.error('Error fetching plan:', error)
    return { error: 'Failed to fetch plan', plan: null }
  }
}

export async function createPlan(data: CreatePlanData) {
  const t = await getTranslations('errors')

  try {
    const user = await requireUser()

    // If an ownerId is supplied, verify it belongs to a user in the caller's org
    if (data.ownerId) {
      const owner = await prisma.user.findFirst({
        where: { id: data.ownerId, organizationId: user.organizationId },
      })

      if (!owner) {
        return { error: 'Owner not found' }
      }
    }

    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        linkedToType: data.linkedToType,
        linkedToId: data.linkedToId,
        ownerId: data.ownerId || user.id,
        organizationId: user.organizationId,
        createdBy: user.id,
        isPublic: data.isPublic || false,
        isTemplate: data.isTemplate || false,
        status: 'not_started',
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'plan_created',
        data: {
          planName: plan.name,
          planType: plan.type,
        },
        userId: user.id,
      },
    })

    revalidatePath('/dashboard/planner')
    return { success: true, plan }
  } catch (error) {
    console.error('Error creating plan:', error)
    return { error: t('failedToCreate') }
  }
}

export async function updatePlan(id: string, data: UpdatePlanData) {
  const t = await getTranslations('errors')

  try {
    const user = await requireUser()

    // Check if plan exists and user has permission
    const existingPlan = await prisma.plan.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
    })

    if (!existingPlan) {
      return { error: 'Plan not found' }
    }

    // If reassigning ownerId, verify it belongs to a user in the caller's org
    if (data.ownerId !== undefined) {
      const owner = await prisma.user.findFirst({
        where: { id: data.ownerId, organizationId: user.organizationId },
      })

      if (!owner) {
        return { error: 'Owner not found' }
      }
    }

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.type !== undefined) updateData.type = data.type
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate)
    if (data.status !== undefined) updateData.status = data.status
    if (data.linkedToType !== undefined) updateData.linkedToType = data.linkedToType
    if (data.linkedToId !== undefined) updateData.linkedToId = data.linkedToId
    if (data.ownerId !== undefined) updateData.ownerId = data.ownerId
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic

    const plan = await prisma.plan.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${id}`)
    return { success: true, plan }
  } catch (error) {
    console.error('Error updating plan:', error)
    return { error: t('failedToUpdate') }
  }
}

export async function deletePlan(id: string) {
  const t = await getTranslations('errors')

  try {
    const user = await requireUser()

    // Check if plan exists and user has permission
    const existingPlan = await prisma.plan.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
    })

    if (!existingPlan) {
      return { error: 'Plan not found' }
    }

    await prisma.plan.delete({
      where: { id },
    })

    revalidatePath('/dashboard/planner')
    return { success: true }
  } catch (error) {
    console.error('Error deleting plan:', error)
    return { error: t('failedToDelete') }
  }
}

export async function publishPlan(id: string) {
  const t = await getTranslations('errors')

  try {
    const user = await requireUser()

    const plan = await prisma.plan.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
    })

    if (!plan) {
      return { error: 'Plan not found' }
    }

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        isPublic: true,
        publishedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${id}`)
    return { success: true, plan: updatedPlan }
  } catch (error) {
    console.error('Error publishing plan:', error)
    return { error: 'Failed to publish plan' }
  }
}

export async function unpublishPlan(id: string) {
  const t = await getTranslations('errors')

  try {
    const user = await requireUser()

    const plan = await prisma.plan.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
    })

    if (!plan) {
      return { error: 'Plan not found' }
    }

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        isPublic: false,
        publishedAt: null,
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${id}`)
    return { success: true, plan: updatedPlan }
  } catch (error) {
    console.error('Error unpublishing plan:', error)
    return { error: 'Failed to unpublish plan' }
  }
}
