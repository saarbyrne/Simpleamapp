/**
 * Feature Access Utilities
 * 
 * Simplified binary on/off feature access system.
 * Features are simply enabled or disabled per organization.
 */

import { prisma } from '@/lib/db'
import { OrganizationFeatures } from '@prisma/client'
import { unstable_cache, revalidateTag } from 'next/cache'
import { FeatureKey, SubFeatureKey, FEATURE_METADATA } from './feature-metadata'
import { SubscriptionTier, getPackageDefaults } from './subscription-tiers'

/**
 * Get organization's subscription tier from database
 */
export async function getOrganizationTier(orgId: string): Promise<SubscriptionTier> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
      select: { plan: true },
    })
    
    // Map subscription plan to tier
    const plan = subscription?.plan?.toLowerCase() || 'free'
    if (plan === 'enterprise') return 'enterprise'
    if (plan === 'pro') return 'pro'
    return 'free'
  } catch (error) {
    console.error('Error fetching organization tier:', error)
    return 'free' // Default to free on error
  }
}

/**
 * Get organization features from database
 * Creates default features if they don't exist
 */
export async function getOrganizationFeatures(
  orgId: string
): Promise<OrganizationFeatures | null> {
  try {
    let features = await prisma.organizationFeatures.findUnique({
      where: { organizationId: orgId },
    })

    // If features don't exist, create them with defaults
    if (!features) {
      features = await prisma.organizationFeatures.create({
        data: {
          organizationId: orgId,
          // Defaults are set in schema
        },
      })
    }

    return features
  } catch (error) {
    console.error('Error fetching organization features:', error)
    return null
  }
}

/**
 * Check a feature against an already-fetched OrganizationFeatures record.
 * Pure logic, no DB call.
 */
function checkFeatureFromRecord(
  feature: FeatureKey | SubFeatureKey,
  orgFeatures: OrganizationFeatures | null
): boolean {
  const featureMetadata = FEATURE_METADATA[feature as FeatureKey]

  // If it's a main feature
  if (featureMetadata) {
    if (!featureMetadata.released) return false
    if (!orgFeatures) return false
    return orgFeatures[featureMetadata.fieldName as keyof OrganizationFeatures] as boolean
  }

  // It's a sub-feature - find the parent
  for (const mainFeature of Object.values(FEATURE_METADATA)) {
    const subFeature = mainFeature.subFeatures.find(sf => sf.key === feature)
    if (subFeature) {
      if (!mainFeature.released) return false
      if (!orgFeatures) return false
      const parentEnabled = orgFeatures[mainFeature.fieldName as keyof OrganizationFeatures] as boolean
      if (!parentEnabled) return false
      return orgFeatures[subFeature.fieldName as keyof OrganizationFeatures] as boolean
    }
  }

  return false
}

/**
 * Check if a specific feature is enabled for an organization
 *
 * @param orgId - Organization ID
 * @param feature - Feature key to check
 * @param isPlatformAdmin - If true, bypasses release status check
 */
export async function isFeatureEnabled(
  orgId: string,
  feature: FeatureKey | SubFeatureKey,
  isPlatformAdmin: boolean = false
): Promise<boolean> {
  try {
    if (isPlatformAdmin) return true
    const orgFeatures = await getOrganizationFeatures(orgId)
    return checkFeatureFromRecord(feature, orgFeatures)
  } catch (error) {
    console.error('Error checking feature access:', error)
    return false
  }
}

/**
 * Check multiple features at once
 * Fetches organization features once and checks all requested features against it
 */
export async function areFeaturesEnabled(
  orgId: string,
  features: (FeatureKey | SubFeatureKey)[],
  isPlatformAdmin: boolean = false
): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  // Platform admins see everything
  if (isPlatformAdmin) {
    for (const feature of features) {
      results[feature] = true
    }
    return results
  }

  // Single DB query for all feature checks
  const orgFeatures = await getOrganizationFeatures(orgId)

  for (const feature of features) {
    results[feature] = checkFeatureFromRecord(feature, orgFeatures)
  }

  return results
}

/**
 * Get all enabled main features for an organization
 * Used by sidebar to filter navigation items
 *
 * @param orgId - Organization ID
 * @param isPlatformAdmin - If true, returns all features (including unreleased)
 */
export async function getEnabledFeatures(
  orgId: string,
  isPlatformAdmin: boolean = false
): Promise<FeatureKey[]> {
  // Platform admins see everything — no need for DB query or cache
  if (isPlatformAdmin) {
    return Object.keys(FEATURE_METADATA) as FeatureKey[]
  }

  return getCachedEnabledFeatures(orgId)
}

const getCachedEnabledFeatures = unstable_cache(
  async (orgId: string): Promise<FeatureKey[]> => {
    try {
      const enabledFeatures: FeatureKey[] = []
      const features = await getOrganizationFeatures(orgId)

      if (!features) {
        return []
      }

      for (const [key, metadata] of Object.entries(FEATURE_METADATA)) {
        const featureKey = key as FeatureKey

        if (!metadata.released) {
          continue
        }

        if (features[metadata.fieldName as keyof OrganizationFeatures]) {
          enabledFeatures.push(featureKey)
        }
      }

      return enabledFeatures
    } catch (error) {
      console.error('Error getting enabled features:', error)
      return []
    }
  },
  ['enabled-features'],
  { revalidate: 300, tags: ['enabled-features'] }
)

/**
 * Update organization features (partial update)
 */
export async function updateOrganizationFeatures(
  orgId: string,
  updates: Partial<Omit<OrganizationFeatures, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>>
): Promise<OrganizationFeatures | null> {
  try {
    // Ensure features exist first
    await getOrganizationFeatures(orgId)

    const updated = await prisma.organizationFeatures.update({
      where: { organizationId: orgId },
      data: updates,
    })

    revalidateTag('enabled-features')

    return updated
  } catch (error) {
    console.error('Error updating organization features:', error)
    return null
  }
}

/**
 * Apply package defaults to an organization
 * Sets all features based on the organization's subscription tier package
 */
export async function applyPackageDefaultsToOrganization(
  orgId: string,
  tier?: SubscriptionTier
): Promise<OrganizationFeatures | null> {
  try {
    // Get tier if not provided
    const orgTier = tier || await getOrganizationTier(orgId)
    
    // Get package defaults for this tier
    const packageFeatures = await getPackageDefaults(orgTier)
    
    // Build update object - set main and sub-features based on package
    const updates: Partial<OrganizationFeatures> = {}
    
    for (const metadata of Object.values(FEATURE_METADATA)) {
      const isEnabledByDefault = packageFeatures.includes(metadata.key)
      updates[metadata.fieldName as keyof OrganizationFeatures] = isEnabledByDefault as any

      for (const subFeature of metadata.subFeatures) {
        updates[subFeature.fieldName as keyof OrganizationFeatures] = isEnabledByDefault as any
      }
    }
    
    // Ensure features record exists
    await getOrganizationFeatures(orgId)
    
    // Update features
    const updated = await prisma.organizationFeatures.update({
      where: { organizationId: orgId },
      data: updates,
    })

    revalidateTag('enabled-features')

    return updated
  } catch (error) {
    console.error('Error applying package defaults:', error)
    return null
  }
}

/**
 * Reset organization features to package defaults
 */
export async function resetOrganizationFeatures(
  orgId: string
): Promise<OrganizationFeatures | null> {
  return applyPackageDefaultsToOrganization(orgId)
}

/**
 * Get detailed feature status including tier defaults and overrides
 */
export async function getFeatureStatusDetails(
  orgId: string
): Promise<{
  tier: SubscriptionTier
  features: Array<{
    key: FeatureKey
    tierDefault: boolean
    hasOverride: boolean
    overrideValue: boolean | null
    effectiveValue: boolean
    released: boolean
  }>
}> {
  const tier = await getOrganizationTier(orgId)
  const packageFeatures = await getPackageDefaults(tier)
  const orgFeatures = await getOrganizationFeatures(orgId)

  const features = Object.values(FEATURE_METADATA).map(metadata => {
    const tierDefault = packageFeatures.includes(metadata.key)
    const effectiveValue = orgFeatures
      ? (orgFeatures[metadata.fieldName as keyof OrganizationFeatures] as boolean)
      : tierDefault
    const hasOverride = effectiveValue !== tierDefault

    return {
      key: metadata.key,
      tierDefault,
      hasOverride,
      overrideValue: hasOverride ? effectiveValue : null,
      effectiveValue,
      released: metadata.released,
    }
  })

  return { tier, features }
}

/**
 * Set a feature override for an organization
 * Pass null to clear override and use tier default
 */
export async function setFeatureOverride(
  orgId: string,
  feature: FeatureKey,
  value: boolean | null
): Promise<boolean> {
  try {
    await getOrganizationFeatures(orgId)

    let nextValue = value
    if (nextValue === null) {
      const tier = await getOrganizationTier(orgId)
      const packageFeatures = await getPackageDefaults(tier)
      nextValue = packageFeatures.includes(feature)
    }

    const fieldName = FEATURE_METADATA[feature].fieldName as keyof OrganizationFeatures
    await prisma.organizationFeatures.update({
      where: { organizationId: orgId },
      data: { [fieldName]: nextValue } as Partial<OrganizationFeatures>,
    })

    revalidateTag('enabled-features')

    return true
  } catch (error) {
    console.error('Error setting feature override:', error)
    return false
  }
}

/**
 * Enable all features for an organization
 */
export async function enableAllFeatures(orgId: string): Promise<OrganizationFeatures | null> {
  try {
    const updated = await prisma.organizationFeatures.update({
      where: { organizationId: orgId },
      data: {
        // Main features
        aiWorkspaceEnabled: true,
        aiEnabled: true,
        playersEnabled: true,
        formsEnabled: true,
        reportsEnabled: true,
        calendarEnabled: true,
        messagesEnabled: true,
        notesEnabled: true,
        spreadsheetsEnabled: true,
        canvasEnabled: true,
        filesEnabled: true,
        plannerEnabled: true,
        templatesEnabled: true,
        dataManagementEnabled: true,
        // Reports sub-features
        reportsBuilderEnabled: true,
        reportsTemplatesEnabled: true,
        reportsSchedulingEnabled: true,
        reportsAiInsightsEnabled: true,
        reportsSharingEnabled: true,
        // Calendar sub-features
        calendarAttendanceEnabled: true,
        calendarFormsEnabled: true,
        calendarDrawingsEnabled: true,
        calendarSpreadsheetsEnabled: true,
        calendarNotesEnabled: true,
        calendarFilesEnabled: true,
        // Forms sub-features
        formsBuilderEnabled: true,
        formsResponsesEnabled: true,
        formsSchedulingEnabled: true,
        // Players sub-features
        playersNotesEnabled: true,
        playersFilesEnabled: true,
        playersMedicalDataEnabled: true,
      },
    })

    revalidateTag('enabled-features')

    return updated
  } catch (error) {
    console.error('Error enabling all features:', error)
    return null
  }
}

/**
 * Disable all features for an organization
 */
export async function disableAllFeatures(orgId: string): Promise<OrganizationFeatures | null> {
  try {
    const updated = await prisma.organizationFeatures.update({
      where: { organizationId: orgId },
      data: {
        // Main features
        aiWorkspaceEnabled: false,
        aiEnabled: false,
        playersEnabled: false,
        formsEnabled: false,
        reportsEnabled: false,
        calendarEnabled: false,
        messagesEnabled: false,
        notesEnabled: false,
        spreadsheetsEnabled: false,
        canvasEnabled: false,
        filesEnabled: false,
        plannerEnabled: false,
        templatesEnabled: false,
        dataManagementEnabled: false,
        // Reports sub-features
        reportsBuilderEnabled: false,
        reportsTemplatesEnabled: false,
        reportsSchedulingEnabled: false,
        reportsAiInsightsEnabled: false,
        reportsSharingEnabled: false,
        // Calendar sub-features
        calendarAttendanceEnabled: false,
        calendarFormsEnabled: false,
        calendarDrawingsEnabled: false,
        calendarSpreadsheetsEnabled: false,
        calendarNotesEnabled: false,
        calendarFilesEnabled: false,
        // Forms sub-features
        formsBuilderEnabled: false,
        formsResponsesEnabled: false,
        formsSchedulingEnabled: false,
        // Players sub-features
        playersNotesEnabled: false,
        playersFilesEnabled: false,
        playersMedicalDataEnabled: false,
      },
    })

    revalidateTag('enabled-features')

    return updated
  } catch (error) {
    console.error('Error disabling all features:', error)
    return null
  }
}

/**
 * Get feature counts (enabled/disabled)
 */
export async function getFeatureCounts(orgId: string): Promise<{
  enabled: number
  disabled: number
  total: number
}> {
  try {
    const features = await getOrganizationFeatures(orgId)
    
    if (!features) {
      const total = Object.keys(FEATURE_METADATA).length
      return { enabled: 0, disabled: total, total }
    }
    
    let enabled = 0
    let disabled = 0
    
    for (const metadata of Object.values(FEATURE_METADATA)) {
      const isEnabled = features[metadata.fieldName as keyof OrganizationFeatures] as boolean
      if (isEnabled) {
        enabled++
      } else {
        disabled++
      }
    }
    
    return {
      enabled,
      disabled,
      total: enabled + disabled,
    }
  } catch (error) {
    console.error('Error getting feature counts:', error)
    const total = Object.keys(FEATURE_METADATA).length
    return { enabled: 0, disabled: total, total }
  }
}
