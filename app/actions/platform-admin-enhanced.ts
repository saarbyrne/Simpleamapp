'use server'

/**
 * Platform Admin Server Actions (Production-Ready)
 *
 * These actions are only available to platform administrators (SaaS provider team).
 * All actions require platform admin authentication and log activities for audit trail.
 *
 * Features:
 * - Input validation with Zod
 * - Comprehensive error handling
 * - Audit logging
 * - Type-safe responses
 */

import { requirePlatformAdmin, logPlatformAdminAction } from '@/lib/platform-admin'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  updateOrganizationPlanSchema,
  suspendOrganizationSchema,
  platformAdminAccessSchema,
  exportOrganizationDataSchema,
  getActivityLogsSchema,
} from '@/lib/platform-admin'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// Standard response type
type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string[]>
}

/**
 * Handle errors consistently across all actions
 */
function handleActionError(error: unknown): ActionResponse {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: 'Validation failed',
      validationErrors: error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return { success: false, error: 'A record with this value already exists' }
    }
    if (error.code === 'P2025') {
      return { success: false, error: 'Record not found' }
    }
    return { success: false, error: 'Database error occurred' }
  }

  if (error instanceof Error) {
    // Don't expose internal error messages in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Platform admin action error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
    return { success: false, error: error.message }
  }

  return { success: false, error: 'An unexpected error occurred' }
}

/**
 * Update organization subscription plan
 * Used for manual plan changes or upgrades
 */
export async function updateOrganizationPlan(
  organizationId: string,
  plan: 'free' | 'pro' | 'enterprise',
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = updateOrganizationPlanSchema.parse({
      organizationId,
      plan,
      status,
    })

    // Require authentication
    await requirePlatformAdmin()

    // Check organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
      select: { name: true }
    })

    if (!organization) {
      return { success: false, error: 'Organization not found' }
    }

    // Update or create subscription
    const subscription = await prisma.subscription.upsert({
      where: { organizationId: validatedData.organizationId },
      update: {
        plan: validatedData.plan,
        status: validatedData.status,
        updatedAt: new Date(),
      },
      create: {
        organizationId: validatedData.organizationId,
        plan: validatedData.plan,
        status: validatedData.status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
    })

    // Log action
    await logPlatformAdminAction('update_subscription', {
      organizationId: validatedData.organizationId,
      organizationName: organization.name,
      newPlan: validatedData.plan,
      newStatus: validatedData.status,
    })

    // Revalidate paths
    revalidatePath('/platform-admin/billing')
    revalidatePath('/platform-admin/organizations')

    return { success: true, data: subscription }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Deactivate or suspend an organization
 * Useful for non-payment or terms violations
 */
export async function suspendOrganization(
  organizationId: string,
  reason: string
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = suspendOrganizationSchema.parse({
      organizationId,
      reason,
    })

    // Require authentication
    await requirePlatformAdmin()

    // Check organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
      select: { name: true }
    })

    if (!organization) {
      return { success: false, error: 'Organization not found' }
    }

    // Update subscription to cancelled
    await prisma.subscription.updateMany({
      where: { organizationId: validatedData.organizationId },
      data: {
        status: 'cancelled',
        updatedAt: new Date(),
      }
    })

    // Log action
    await logPlatformAdminAction('suspend_organization', {
      organizationId: validatedData.organizationId,
      organizationName: organization.name,
      reason: validatedData.reason,
    })

    // Revalidate paths
    revalidatePath('/platform-admin/organizations')
    revalidatePath('/platform-admin/billing')

    return { success: true }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Get platform-wide statistics for dashboard
 */
export async function getPlatformMetrics(): Promise<ActionResponse> {
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
      data: {
        totalOrgs,
        totalUsers,
        activeSubscriptions,
        totalForms,
        totalEvents,
        totalNotes,
      }
    }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Export organization data (for customer requests or migration)
 */
export async function exportOrganizationData(
  organizationId: string
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = exportOrganizationDataSchema.parse({ organizationId })

    // Require authentication
    await requirePlatformAdmin()

    // Get organization with all related data
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            createdAt: true,
            lastLoginAt: true,
          }
        },
        persons: {
          select: {
            id: true,
            personId: true,
            role: true,
            position: true,
            status: true,
            joinedAt: true,
          }
        },
        forms: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          }
        },
        events: {
          select: {
            id: true,
            title: true,
            type: true,
            startTime: true,
            endTime: true,
          }
        },
        subscriptions: true,
      }
    })

    if (!organization) {
      return { success: false, error: 'Organization not found' }
    }

    // Log action
    await logPlatformAdminAction('export_organization_data', {
      organizationId: validatedData.organizationId,
      organizationName: organization.name,
    })

    return {
      success: true,
      data: organization,
    }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Get activity logs for audit trail
 */
export async function getPlatformActivityLogs(
  limit: number = 50
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = getActivityLogsSchema.parse({ limit })

    // Require authentication
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
      take: validatedData.limit,
    })

    return {
      success: true,
      data: activities,
    }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Grant platform admin access to a user
 * CRITICAL: This should only be called manually and with extreme caution
 */
export async function grantPlatformAdminAccess(
  userId: string
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = platformAdminAccessSchema.parse({ userId })

    // Require authentication
    const currentAdmin = await requirePlatformAdmin()

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { email: true, name: true, isPlatformAdmin: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.isPlatformAdmin) {
      return { success: false, error: 'User is already a platform admin' }
    }

    // Grant access
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { isPlatformAdmin: true }
    })

    // Log action
    await logPlatformAdminAction('grant_platform_admin', {
      grantedToUserId: validatedData.userId,
      grantedToEmail: user.email,
      grantedBy: currentAdmin.email,
    })

    // Revalidate
    revalidatePath('/platform-admin/users')

    return { success: true }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Revoke platform admin access from a user
 */
export async function revokePlatformAdminAccess(
  userId: string
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = platformAdminAccessSchema.parse({ userId })

    // Require authentication
    const currentAdmin = await requirePlatformAdmin()

    // Prevent self-revocation
    if (currentAdmin.id === validatedData.userId) {
      return { success: false, error: 'Cannot revoke your own platform admin access' }
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { email: true, name: true, isPlatformAdmin: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (!user.isPlatformAdmin) {
      return { success: false, error: 'User is not a platform admin' }
    }

    // Revoke access
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { isPlatformAdmin: false }
    })

    // Log action
    await logPlatformAdminAction('revoke_platform_admin', {
      revokedFromUserId: validatedData.userId,
      revokedFromEmail: user.email,
      revokedBy: currentAdmin.email,
    })

    // Revalidate
    revalidatePath('/platform-admin/users')

    return { success: true }
  } catch (error) {
    return handleActionError(error)
  }
}
