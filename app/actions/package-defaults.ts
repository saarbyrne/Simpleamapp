/**
 * Server Actions for Package Defaults Management
 */

'use server'

import { prisma } from '@/lib/db'
import { FeatureKey } from '@/lib/permissions/feature-metadata'
import { SubscriptionTier } from '@/lib/permissions/subscription-tiers'
import { logPlatformAdminAction } from '@/lib/platform-admin'
import { createClient } from '@/lib/supabase/server'

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
 * Get all package defaults from database
 */
export async function getAllPackageDefaults(): Promise<{
  success: boolean
  data?: Record<SubscriptionTier, FeatureKey[]>
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const packages = await prisma.packageDefaults.findMany()

    const result: Record<string, FeatureKey[]> = {
      free: [],
      pro: [],
      enterprise: [],
    }

    for (const pkg of packages) {
      result[pkg.tier] = pkg.features as FeatureKey[]
    }

    return {
      success: true,
      data: result as Record<SubscriptionTier, FeatureKey[]>,
    }
  } catch (error) {
    console.error('Error fetching package defaults:', error)
    return { success: false, error: 'Failed to fetch package defaults' }
  }
}

/**
 * Update package defaults for a specific tier
 */
export async function updatePackageDefaults(
  tier: SubscriptionTier,
  features: FeatureKey[]
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    // Upsert the package defaults
    await prisma.packageDefaults.upsert({
      where: { tier },
      create: {
        tier,
        features,
      },
      update: {
        features,
        updatedAt: new Date(),
      },
    })

    await logPlatformAdminAction('update_package_defaults', {
      tier,
      featureCount: features.length,
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating package defaults:', error)
    return { success: false, error: 'Failed to update package defaults' }
  }
}
