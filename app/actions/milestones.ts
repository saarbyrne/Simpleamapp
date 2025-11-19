'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { getTranslations } from 'next-intl/server'

interface CreateMilestoneData {
  planId: string
  title: string
  description?: string
  startDate?: Date | string
  endDate?: Date | string
  dueDate?: Date | string
  assignedTo?: string
  order?: number
  progress?: number
}

interface UpdateMilestoneData extends Partial<CreateMilestoneData> {
  status?: 'pending' | 'in_progress' | 'complete' | 'blocked'
}

export async function createMilestone(data: CreateMilestoneData) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify plan exists and user has access
    const plan = await prisma.plan.findFirst({
      where: {
        id: data.planId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!plan) {
      return { error: 'Plan not found' }
    }

    // Get the max order for this plan
    const maxOrder = await prisma.milestone.findFirst({
      where: { planId: data.planId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const milestone = await prisma.milestone.create({
      data: {
        planId: data.planId,
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assignedTo: data.assignedTo,
        order: data.order ?? (maxOrder?.order ?? 0) + 1,
        progress: data.progress ?? 0,
        status: 'pending',
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${data.planId}`)
    return { success: true, milestone }
  } catch (error) {
    console.error('Error creating milestone:', error)
    return { error: t('failedToCreate') }
  }
}

export async function updateMilestone(id: string, data: UpdateMilestoneData) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if milestone exists and user has permission
    const existingMilestone = await prisma.milestone.findFirst({
      where: {
        id,
        plan: {
          organizationId: dbUser.organizationId,
        },
      },
      include: {
        plan: true,
      },
    })

    if (!existingMilestone) {
      return { error: 'Milestone not found' }
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
    if (data.status !== undefined) {
      updateData.status = data.status
      if (data.status === 'complete') {
        updateData.completedAt = new Date()
        updateData.completedBy = user.id
        updateData.progress = 100
      }
    }
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo
    if (data.order !== undefined) updateData.order = data.order
    if (data.progress !== undefined) updateData.progress = data.progress

    const milestone = await prisma.milestone.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${existingMilestone.planId}`)
    return { success: true, milestone }
  } catch (error) {
    console.error('Error updating milestone:', error)
    return { error: t('failedToUpdate') }
  }
}

export async function deleteMilestone(id: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if milestone exists and user has permission
    const existingMilestone = await prisma.milestone.findFirst({
      where: {
        id,
        plan: {
          organizationId: dbUser.organizationId,
        },
      },
      include: {
        plan: true,
      },
    })

    if (!existingMilestone) {
      return { error: 'Milestone not found' }
    }

    await prisma.milestone.delete({
      where: { id },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${existingMilestone.planId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return { error: t('failedToDelete') }
  }
}

export async function reorderMilestones(planId: string, milestoneIds: string[]) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify plan exists and user has access
    const plan = await prisma.plan.findFirst({
      where: {
        id: planId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!plan) {
      return { error: 'Plan not found' }
    }

    // Update order for each milestone
    await prisma.$transaction(
      milestoneIds.map((milestoneId, index) =>
        prisma.milestone.update({
          where: { id: milestoneId },
          data: { order: index },
        })
      )
    )

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${planId}`)
    return { success: true }
  } catch (error) {
    console.error('Error reordering milestones:', error)
    return { error: 'Failed to reorder milestones' }
  }
}

export async function addMilestoneLink(milestoneId: string, targetType: string, targetId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if milestone exists and user has permission
    const existingMilestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        plan: {
          organizationId: dbUser.organizationId,
        },
      },
    })

    if (!existingMilestone) {
      return { error: 'Milestone not found' }
    }

    const link = await prisma.milestoneLink.create({
      data: {
        milestoneId,
        targetType,
        targetId,
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${existingMilestone.planId}`)
    return { success: true, link }
  } catch (error) {
    console.error('Error adding milestone link:', error)
    return { error: 'Failed to add link' }
  }
}

export async function removeMilestoneLink(linkId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if link exists and user has permission
    const existingLink = await prisma.milestoneLink.findFirst({
      where: {
        id: linkId,
        milestone: {
          plan: {
            organizationId: dbUser.organizationId,
          },
        },
      },
      include: {
        milestone: {
          include: {
            plan: true,
          },
        },
      },
    })

    if (!existingLink) {
      return { error: 'Link not found' }
    }

    await prisma.milestoneLink.delete({
      where: { id: linkId },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${existingLink.milestone.planId}`)
    return { success: true }
  } catch (error) {
    console.error('Error removing milestone link:', error)
    return { error: 'Failed to remove link' }
  }
}

export async function addMilestoneComment(milestoneId: string, content: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if milestone exists and user has permission
    const existingMilestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        plan: {
          organizationId: dbUser.organizationId,
        },
      },
    })

    if (!existingMilestone) {
      return { error: 'Milestone not found' }
    }

    const comment = await prisma.milestoneComment.create({
      data: {
        milestoneId,
        content,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    revalidatePath('/dashboard/planner')
    revalidatePath(`/dashboard/planner/${existingMilestone.planId}`)
    return { success: true, comment }
  } catch (error) {
    console.error('Error adding milestone comment:', error)
    return { error: 'Failed to add comment' }
  }
}
