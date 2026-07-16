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
  getFeatureStatusDetails,
  getOrganizationTier,
  setFeatureOverride,
} from '@/lib/permissions/feature-access'
import { FeatureKey } from '@/lib/permissions/feature-metadata'
import { SubscriptionTier } from '@/lib/permissions/subscription-tiers'
import { isPlatformAdmin, logPlatformAdminAction } from '@/lib/platform-admin'

/**
 * Check if the current user is a platform admin
 */
async function verifyPlatformAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const ok = await isPlatformAdmin()
    if (!ok) {
      return { success: false, error: 'Platform admin access required' }
    }
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
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const features = await getEnabledFeatures(orgId)

    return { success: true, features }
  } catch (error) {
    console.error('Error in getEnabledFeaturesAction:', error)
    return { success: false, error: 'Failed to get enabled features' }
  }
}

/**
 * Get detailed feature status including tier defaults and overrides
 */
export async function getFeatureStatusDetailsAction(orgId: string): Promise<{
  success: boolean
  data?: {
    tier: SubscriptionTier
    features: Array<{
      key: FeatureKey
      tierDefault: boolean
      hasOverride: boolean
      overrideValue: boolean | null
      effectiveValue: boolean
      released: boolean
    }>
  }
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const data = await getFeatureStatusDetails(orgId)

    return { success: true, data }
  } catch (error) {
    console.error('Error in getFeatureStatusDetailsAction:', error)
    return { success: false, error: 'Failed to get feature status details' }
  }
}

/**
 * Get organization's subscription tier
 */
export async function getOrganizationTierAction(orgId: string): Promise<{
  success: boolean
  tier?: SubscriptionTier
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const tier = await getOrganizationTier(orgId)

    return { success: true, tier }
  } catch (error) {
    console.error('Error in getOrganizationTierAction:', error)
    return { success: false, error: 'Failed to get organization tier' }
  }
}

/**
 * Set a feature override for an organization
 * Pass null to clear override and use tier default
 */
export async function setFeatureOverrideAction(
  orgId: string,
  feature: FeatureKey,
  value: boolean | null
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const authCheck = await verifyPlatformAdmin()
    if (!authCheck.success) {
      return { success: false, error: authCheck.error }
    }

    const result = await setFeatureOverride(orgId, feature, value)

    if (!result) {
      return { success: false, error: 'Failed to set feature override' }
    }

    await logPlatformAdminAction('set_feature_override', {
      organizationId: orgId,
      feature,
      value,
    })

    return { success: true }
  } catch (error) {
    console.error('Error in setFeatureOverrideAction:', error)
    return { success: false, error: 'Failed to set feature override' }
  }
}
