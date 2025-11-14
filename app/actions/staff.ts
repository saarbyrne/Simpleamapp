'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { getTranslations } from 'next-intl/server'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

export type StaffRow = {
  id: string
  name: string
  email: string
  avatar: string | null
  phone: string | null
  roleNames: string[]
  permissions: string[]
  lastLoginAt: Date | null
  createdAt: Date
}

/**
 * Get all staff members in the organization
 */
export async function getStaff() {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const staff = await prisma.user.findMany({
      where: {
        organizationId: dbUser.organizationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        roleNames: true,
        permissions: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return { success: true, staff }
  } catch (error) {
    console.error('Error fetching staff:', error)
    return { error: t('failedToFetchData') }
  }
}

/**
 * Get a single staff member with full details
 */
export async function getStaffMember(staffId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const staffMember = await prisma.user.findFirst({
      where: {
        id: staffId,
        organizationId: dbUser.organizationId,
      },
      include: {
        person: true,
        activities: {
          take: 20,
          orderBy: {
            createdAt: 'desc',
          },
        },
        notes: {
          take: 20,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            linkedPerson: true,
          },
        },
      },
    })

    if (!staffMember) {
      return { error: t('staffMemberNotFound') }
    }

    return { success: true, staffMember }
  } catch (error) {
    console.error('Error fetching staff member:', error)
    return { error: t('failedToFetchData') }
  }
}

/**
 * Update staff member's role names (flexible tags)
 */
export async function updateStaffRoles(staffId: string, roleNames: string[]) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if user has permission to manage staff
    if (!hasPermission(dbUser.permissions, PERMISSIONS.MANAGE_STAFF)) {
      return { error: t('insufficientPermissions') }
    }

    // Verify staff member belongs to same organization
    const staffMember = await prisma.user.findFirst({
      where: {
        id: staffId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!staffMember) {
      return { error: t('staffMemberNotFound') }
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedStaff = await tx.user.update({
        where: { id: staffId },
        data: {
          roleNames: roleNames,
        },
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'staff_roles_updated',
          data: {
            staffName: updatedStaff.name,
            newRoles: roleNames,
          },
          userId: user.id,
        },
      })

      return updatedStaff
    })

    revalidatePath('/dashboard/system-settings/staff')
    revalidatePath(`/dashboard/system-settings/staff/${staffId}`)

    return { success: true, staff: updated }
  } catch (error) {
    console.error('Error updating staff roles:', error)
    return { error: t('failedToUpdateStaff') }
  }
}

/**
 * Update staff member's permissions
 */
export async function updateStaffPermissions(
  staffId: string,
  permissions: string[]
) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Only admins can update permissions
    if (!hasPermission(dbUser.permissions, PERMISSIONS.ADMIN)) {
      return { error: t('insufficientPermissions') }
    }

    // Verify staff member belongs to same organization
    const staffMember = await prisma.user.findFirst({
      where: {
        id: staffId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!staffMember) {
      return { error: t('staffMemberNotFound') }
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedStaff = await tx.user.update({
        where: { id: staffId },
        data: {
          permissions: permissions,
        },
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'staff_permissions_updated',
          data: {
            staffName: updatedStaff.name,
            newPermissions: permissions,
          },
          userId: user.id,
        },
      })

      return updatedStaff
    })

    revalidatePath('/dashboard/system-settings/staff')
    revalidatePath(`/dashboard/system-settings/staff/${staffId}`)

    return { success: true, staff: updated }
  } catch (error) {
    console.error('Error updating staff permissions:', error)
    return { error: t('failedToUpdateStaff') }
  }
}

/**
 * Update staff member's profile
 */
export async function updateStaffProfile(
  staffId: string,
  data: {
    name?: string
    phone?: string
    avatar?: string
  }
) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Check if user has permission to manage staff or is updating their own profile
    if (
      staffId !== user.id &&
      !hasPermission(dbUser.permissions, PERMISSIONS.MANAGE_STAFF)
    ) {
      return { error: t('insufficientPermissions') }
    }

    // Verify staff member belongs to same organization
    const staffMember = await prisma.user.findFirst({
      where: {
        id: staffId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!staffMember) {
      return { error: t('staffMemberNotFound') }
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedStaff = await tx.user.update({
        where: { id: staffId },
        data: {
          name: data.name,
          phone: data.phone,
          avatar: data.avatar,
        },
      })

      // Log activity
      await tx.activity.create({
        data: {
          type: 'staff_profile_updated',
          data: {
            staffName: updatedStaff.name,
          },
          userId: user.id,
        },
      })

      return updatedStaff
    })

    revalidatePath('/dashboard/system-settings/staff')
    revalidatePath(`/dashboard/system-settings/staff/${staffId}`)

    return { success: true, staff: updated }
  } catch (error) {
    console.error('Error updating staff profile:', error)
    return { error: t('failedToUpdateStaff') }
  }
}

/**
 * Get staff activity statistics
 */
export async function getStaffStats(staffId: string) {
  const t = await getTranslations('errors')
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: t('notAuthenticated') }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify staff member belongs to same organization
    const staffMember = await prisma.user.findFirst({
      where: {
        id: staffId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!staffMember) {
      return { error: t('staffMemberNotFound') }
    }

    const [notesCount, formsCount, eventsCount] = await Promise.all([
      prisma.note.count({
        where: {
          authorId: staffId,
          organizationId: dbUser.organizationId,
        },
      }),
      prisma.form.count({
        where: {
          organizationId: dbUser.organizationId,
          // TODO: Add createdBy field to Form model
        },
      }),
      prisma.event.count({
        where: {
          organizationId: dbUser.organizationId,
          // TODO: Add createdBy field to Event model
        },
      }),
    ])

    return {
      success: true,
      stats: {
        notesCreated: notesCount,
        formsCreated: formsCount,
        eventsCreated: eventsCount,
      },
    }
  } catch (error) {
    console.error('Error fetching staff stats:', error)
    return { error: t('failedToFetchData') }
  }
}
