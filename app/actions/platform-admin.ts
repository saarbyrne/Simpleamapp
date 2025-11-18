'use server'

/**
 * Platform Admin Server Actions
 *
 * These actions are only available to platform administrators (SaaS provider team).
 * All actions require platform admin authentication and log activities for audit trail.
 */

import { requirePlatformAdmin, logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Update organization subscription plan
 * Used for manual plan changes or upgrades
 */
export async function updateOrganizationPlan(
  organizationId: string,
  plan: 'free' | 'pro' | 'enterprise',
  status: 'active' | 'cancelled' | 'past_due'
) {
  try {
    await requirePlatformAdmin()

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true }
    })

    if (!organization) {
      return { error: 'Organization not found' }
    }

    // Update or create subscription
    const subscription = await prisma.subscription.upsert({
      where: { organizationId },
      update: {
        plan,
        status,
        updatedAt: new Date(),
      },
      create: {
        organizationId,
        plan,
        status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
    })

    await logPlatformAdminAction('update_subscription', {
      organizationId,
      organizationName: organization.name,
      newPlan: plan,
      newStatus: status,
    })

    revalidatePath('/platform-admin/billing')
    revalidatePath('/platform-admin/organizations')

    return { success: true, subscription }
  } catch (error) {
    console.error('Error updating organization plan:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update plan' }
  }
}

/**
 * Deactivate or suspend an organization
 * Useful for non-payment or terms violations
 */
export async function suspendOrganization(organizationId: string, reason: string) {
  try {
    await requirePlatformAdmin()

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true }
    })

    if (!organization) {
      return { error: 'Organization not found' }
    }

    // Update subscription to cancelled
    await prisma.subscription.updateMany({
      where: { organizationId },
      data: {
        status: 'cancelled',
        updatedAt: new Date(),
      }
    })

    await logPlatformAdminAction('suspend_organization', {
      organizationId,
      organizationName: organization.name,
      reason,
    })

    revalidatePath('/platform-admin/organizations')
    revalidatePath('/platform-admin/billing')

    return { success: true }
  } catch (error) {
    console.error('Error suspending organization:', error)
    return { error: error instanceof Error ? error.message : 'Failed to suspend organization' }
  }
}

/**
 * Get platform-wide statistics for dashboard
 */
export async function getPlatformMetrics() {
  try {
    await requirePlatformAdmin()

    const [
      totalOrgs,
      totalUsers,
      activeSubscriptions,
      totalForms,
      totalEvents,
      totalNotes,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.form.count(),
      prisma.event.count(),
      prisma.note.count(),
    ])

    return {
      success: true,
      metrics: {
        totalOrgs,
        totalUsers,
        activeSubscriptions,
        totalForms,
        totalEvents,
        totalNotes,
      }
    }
  } catch (error) {
    console.error('Error getting platform metrics:', error)
    return { error: error instanceof Error ? error.message : 'Failed to get metrics' }
  }
}

/**
 * Export organization data (for customer requests or migration)
 */
export async function exportOrganizationData(organizationId: string) {
  try {
    await requirePlatformAdmin()

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: true,
        persons: true,
        forms: true,
        events: true,
        notes: true,
        files: true,
        spreadsheets: true,
        drawings: true,
        subscriptions: true,
      }
    })

    if (!organization) {
      return { error: 'Organization not found' }
    }

    await logPlatformAdminAction('export_organization_data', {
      organizationId,
      organizationName: organization.name,
    })

    return {
      success: true,
      data: organization,
    }
  } catch (error) {
    console.error('Error exporting organization data:', error)
    return { error: error instanceof Error ? error.message : 'Failed to export data' }
  }
}

/**
 * Get activity logs for audit trail
 */
export async function getPlatformActivityLogs(limit: number = 50) {
  try {
    await requirePlatformAdmin()

    const activities = await prisma.activity.findMany({
      where: {
        type: {
          startsWith: 'platform_admin_',
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return {
      success: true,
      activities,
    }
  } catch (error) {
    console.error('Error getting activity logs:', error)
    return { error: error instanceof Error ? error.message : 'Failed to get activity logs' }
  }
}

/**
 * Grant platform admin access to a user
 * CRITICAL: This should only be called manually and with extreme caution
 */
export async function grantPlatformAdminAccess(userId: string) {
  try {
    const currentAdmin = await requirePlatformAdmin()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isPlatformAdmin: true }
    })

    await logPlatformAdminAction('grant_platform_admin', {
      grantedToUserId: userId,
      grantedToEmail: user.email,
      grantedBy: currentAdmin.email,
    })

    revalidatePath('/platform-admin/users')

    return { success: true }
  } catch (error) {
    console.error('Error granting platform admin access:', error)
    return { error: error instanceof Error ? error.message : 'Failed to grant access' }
  }
}

/**
 * Revoke platform admin access from a user
 */
export async function revokePlatformAdminAccess(userId: string) {
  try {
    const currentAdmin = await requirePlatformAdmin()

    // Prevent self-revocation
    if (currentAdmin.id === userId) {
      return { error: 'Cannot revoke your own platform admin access' }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isPlatformAdmin: false }
    })

    await logPlatformAdminAction('revoke_platform_admin', {
      revokedFromUserId: userId,
      revokedFromEmail: user.email,
      revokedBy: currentAdmin.email,
    })

    revalidatePath('/platform-admin/users')

    return { success: true }
  } catch (error) {
    console.error('Error revoking platform admin access:', error)
    return { error: error instanceof Error ? error.message : 'Failed to revoke access' }
  }
}
