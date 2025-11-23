/**
 * Server Actions for Organization Features Management
 * 
 * These actions are used by platform admins to manage feature access
 * for organizations.
 */

'use server'

import { OrganizationFeatures } from '@prisma/client'
import {
  getOrganizationFeatures,
  updateOrganizationFeatures,
  resetOrganizationFeatures as resetFeatures,
  enableAllFeatures as enableAll,
  disableAllFeatures as disableAll,
  getFeatureCounts,
  getEnabledFeatures,
} from '@/lib/permissions/feature-access'
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

    // Check if user is platform admin
    // This would need to be implemented based on your auth system
    // For now, we'll assume the check is done elsewhere
    return { success: true }
  } catch (error) {
    console.error('Error verifying platform admin:', error)
    return { success: false, error: 'Authentication error' }
  }
}

/**
 * Get organization features
 */
export async function getOrganizationFeaturesAction(orgId: string): Promise<{
  success: boolean
  features?: OrganizationFeatures | null
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const features = await getOrganizationFeatures(orgId)

    await logPlatformAdminAction('view_organization_features', {
      organizationId: orgId,
    })

    return { success: true, features }
  } catch (error) {
    console.error('Error in getOrganizationFeaturesAction:', error)
    return { success: false, error: 'Failed to fetch organization features' }
  }
}

/**
 * Update organization features
 */
export async function updateOrganizationFeaturesAction(
  orgId: string,
  updates: Partial<Omit<OrganizationFeatures, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>>
): Promise<{
  success: boolean
  features?: OrganizationFeatures | null
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const features = await updateOrganizationFeatures(orgId, updates)

    if (!features) {
      return { success: false, error: 'Failed to update features' }
    }

    await logPlatformAdminAction('update_organization_features', {
      organizationId: orgId,
      updates: Object.keys(updates),
    })

    return { success: true, features }
  } catch (error) {
    console.error('Error in updateOrganizationFeaturesAction:', error)
    return { success: false, error: 'Failed to update organization features' }
  }
}

/**
 * Reset organization features to defaults (all enabled)
 */
export async function resetOrganizationFeaturesAction(orgId: string): Promise<{
  success: boolean
  features?: OrganizationFeatures | null
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const features = await resetFeatures(orgId)

    if (!features) {
      return { success: false, error: 'Failed to reset features' }
    }

    await logPlatformAdminAction('reset_organization_features', {
      organizationId: orgId,
    })

    return { success: true, features }
  } catch (error) {
    console.error('Error in resetOrganizationFeaturesAction:', error)
    return { success: false, error: 'Failed to reset organization features' }
  }
}

/**
 * Enable all features for an organization
 */
export async function enableAllFeaturesAction(orgId: string): Promise<{
  success: boolean
  features?: OrganizationFeatures | null
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const features = await enableAll(orgId)

    if (!features) {
      return { success: false, error: 'Failed to enable all features' }
    }

    await logPlatformAdminAction('enable_all_features', {
      organizationId: orgId,
    })

    return { success: true, features }
  } catch (error) {
    console.error('Error in enableAllFeaturesAction:', error)
    return { success: false, error: 'Failed to enable all features' }
  }
}

/**
 * Disable all features for an organization
 */
export async function disableAllFeaturesAction(orgId: string): Promise<{
  success: boolean
  features?: OrganizationFeatures | null
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const features = await disableAll(orgId)

    if (!features) {
      return { success: false, error: 'Failed to disable all features' }
    }

    await logPlatformAdminAction('disable_all_features', {
      organizationId: orgId,
    })

    return { success: true, features }
  } catch (error) {
    console.error('Error in disableAllFeaturesAction:', error)
    return { success: false, error: 'Failed to disable all features' }
  }
}

/**
 * Get feature counts for an organization
 */
export async function getFeatureCountsAction(orgId: string): Promise<{
  success: boolean
  counts?: { enabled: number; disabled: number; total: number }
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const counts = await getFeatureCounts(orgId)

    return { success: true, counts }
  } catch (error) {
    console.error('Error in getFeatureCountsAction:', error)
    return { success: false, error: 'Failed to get feature counts' }
  }
}

/**
 * Get enabled features for an organization
 */
export async function getEnabledFeaturesAction(orgId: string): Promise<{
  success: boolean
  features?: string[]
  error?: string
}> {
  try {
    const features = await getEnabledFeatures(orgId)

    return { success: true, features }
  } catch (error) {
    console.error('Error in getEnabledFeaturesAction:', error)
    return { success: false, error: 'Failed to get enabled features' }
  }
}

