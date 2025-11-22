/**
 * Platform Admin Utilities
 *
 * Functions for managing platform admin access and operations.
 * Platform admins are SaaS provider team members who can manage
 * all customer organizations, users, and billing.
 */

import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

/**
 * Check if the current authenticated user is a platform admin
 */
export async function isPlatformAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isPlatformAdmin: true }
    })

    return dbUser?.isPlatformAdmin ?? false
  } catch (error) {
    console.error('Error checking platform admin status:', error)
    return false
  }
}

/**
 * Get current platform admin user or throw error if not authorized
 */
export async function requirePlatformAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      isPlatformAdmin: true
    }
  })

  if (!dbUser?.isPlatformAdmin) {
    throw new Error('Platform admin access required')
  }

  return dbUser
}

/**
 * Log platform admin action for audit trail
 */
export async function logPlatformAdminAction(action: string, data: Record<string, any>) {
  try {
    const admin = await requirePlatformAdmin()

    await prisma.activity.create({
      data: {
        type: `platform_admin_${action}`,
        data: {
          ...data,
          adminEmail: admin.email,
          timestamp: new Date().toISOString(),
        },
        userId: admin.id,
      }
    })
  } catch (error) {
    console.error('Error logging platform admin action:', error)
    // Don't throw - logging failure shouldn't block the action
  }
}

/**
 * Platform admin statistics
 */
export async function getPlatformStats() {
  const admin = await requirePlatformAdmin()

  const [
    totalOrganizations,
    totalUsers,
    activeSubscriptions,
    organizations,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.subscription.count({
      where: { status: 'active' }
    }),
    prisma.organization.findMany({
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 30, // Last 30 days for chart
    })
  ])

  // Calculate new orgs per day (last 30 days)
  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)

  const newOrgsLast30Days = organizations.filter(
    org => org.createdAt >= last30Days
  ).length

  return {
    totalOrganizations,
    totalUsers,
    activeSubscriptions,
    newOrgsLast30Days,
  }
}

/**
 * Type definitions for platform admin
 */
export type PlatformAdminUser = {
  id: string
  email: string
  name: string
  isPlatformAdmin: true
}

export type OrganizationWithStats = {
  id: string
  name: string
  slug: string
  sport: string | null
  createdAt: Date
  _count: {
    users: number
  }
  subscriptions: Array<{
    id: string
    plan: string
    status: string
    currentPeriodEnd: Date
  }>
}
