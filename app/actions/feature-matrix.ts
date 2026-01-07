/**
 * Server Actions for Feature Matrix Management
 * 
 * Bulk operations for managing features across multiple organizations
 */

'use server'

import { prisma } from '@/lib/db'
import { FeatureKey, FEATURE_METADATA } from '@/lib/permissions/feature-metadata'
import { SubscriptionTier, getPackageDefaults } from '@/lib/permissions/subscription-tiers'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { createClient } from '@/lib/supabase/server'
import { OrganizationFeatures } from '@prisma/client'

/**
 * Check if the current user is a platform admin
 */
async function verifyPlatformAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error verifying platform admin:', error)
    return { success: false, error: 'Authentication error' }
  }
}

/**
 * Get all organizations with their features for the matrix view
 */
export async function getOrganizationsWithFeatures(): Promise<{
  success: boolean
  data?: Array<{
    id: string
    name: string
    tier: SubscriptionTier
    features: OrganizationFeatures
  }>
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const orgs = await prisma.organization.findMany({
      include: {
        features: true,
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Ensure all organizations have features - create if missing
    const data = await Promise.all(
      orgs.map(async org => {
        let features = org.features
        
        // If organization doesn't have features, create them with schema defaults
        if (!features) {
          features = await prisma.organizationFeatures.create({
            data: {
              organizationId: org.id,
              // Schema defaults will be used
            },
          })
        }
        
        return {
          id: org.id,
          name: org.name,
          tier: (org.subscriptions[0]?.plan?.toLowerCase() || 'free') as SubscriptionTier,
          features,
        }
      })
    )

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching organizations with features:', error)
    return { success: false, error: 'Failed to fetch organizations' }
  }
}

/**
 * Apply package defaults to multiple organizations
 */
export async function bulkApplyPackageDefaults(
  orgIds: string[],
  tier: SubscriptionTier
): Promise<{
  success: boolean
  updated?: number
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    // Get package defaults for this tier
    const packageFeatures = await getPackageDefaults(tier)
    
    // Build update object
    const updates: Partial<OrganizationFeatures> = {}
    for (const [key, metadata] of Object.entries(FEATURE_METADATA)) {
      const featureKey = key as FeatureKey
      const fieldName = metadata.fieldName as keyof OrganizationFeatures
      updates[fieldName] = packageFeatures.includes(featureKey) as any
    }

    // Update all organizations
    const result = await prisma.organizationFeatures.updateMany({
      where: { organizationId: { in: orgIds } },
      data: updates,
    })

    await logPlatformAdminAction('bulk_apply_package_defaults', {
      organizationCount: orgIds.length,
      tier,
    })

    return { success: true, updated: result.count }
  } catch (error) {
    console.error('Error applying package defaults:', error)
    return { success: false, error: 'Failed to apply package defaults' }
  }
}

/**
 * Enable a specific feature for multiple organizations
 */
export async function bulkEnableFeature(
  orgIds: string[],
  feature: FeatureKey
): Promise<{
  success: boolean
  updated?: number
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const metadata = FEATURE_METADATA[feature]
    if (!metadata) {
      return { success: false, error: 'Invalid feature' }
    }

    const result = await prisma.organizationFeatures.updateMany({
      where: { organizationId: { in: orgIds } },
      data: { [metadata.fieldName]: true },
    })

    await logPlatformAdminAction('bulk_enable_feature', {
      organizationCount: orgIds.length,
      feature,
    })

    return { success: true, updated: result.count }
  } catch (error) {
    console.error('Error enabling feature:', error)
    return { success: false, error: 'Failed to enable feature' }
  }
}

/**
 * Disable a specific feature for multiple organizations
 */
export async function bulkDisableFeature(
  orgIds: string[],
  feature: FeatureKey
): Promise<{
  success: boolean
  updated?: number
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const metadata = FEATURE_METADATA[feature]
    if (!metadata) {
      return { success: false, error: 'Invalid feature' }
    }

    const result = await prisma.organizationFeatures.updateMany({
      where: { organizationId: { in: orgIds } },
      data: { [metadata.fieldName]: false },
    })

    await logPlatformAdminAction('bulk_disable_feature', {
      organizationCount: orgIds.length,
      feature,
    })

    return { success: true, updated: result.count }
  } catch (error) {
    console.error('Error disabling feature:', error)
    return { success: false, error: 'Failed to disable feature' }
  }
}

/**
 * Toggle a single feature for a single organization
 */
export async function toggleFeature(
  orgId: string,
  feature: FeatureKey,
  enabled: boolean
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const metadata = FEATURE_METADATA[feature]
    if (!metadata) {
      return { success: false, error: 'Invalid feature' }
    }

    await prisma.organizationFeatures.update({
      where: { organizationId: orgId },
      data: { [metadata.fieldName]: enabled },
    })

    return { success: true }
  } catch (error) {
    console.error('Error toggling feature:', error)
    return { success: false, error: 'Failed to toggle feature' }
  }
}
