/**
 * Feature Access Utilities
 * 
 * Functions to check and manage feature access for organizations.
 */

import { prisma } from '@/lib/db'
import { OrganizationFeatures } from '@prisma/client'
import { FeatureKey, SubFeatureKey, FEATURE_METADATA } from './feature-metadata'

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

    // If features don't exist, create them with defaults (all enabled)
    if (!features) {
      features = await prisma.organizationFeatures.create({
        data: {
          organizationId: orgId,
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
 * Check if a specific feature is enabled for an organization
 */
export async function isFeatureEnabled(
  orgId: string,
  feature: FeatureKey | SubFeatureKey
): Promise<boolean> {
  try {
    const features = await getOrganizationFeatures(orgId)
    if (!features) return true // Default to enabled if can't fetch

    // Get the field name from metadata
    const featureMetadata = FEATURE_METADATA[feature as FeatureKey]
    const fieldName = featureMetadata?.fieldName

    if (!fieldName) {
      // It's a sub-feature, need to find it
      for (const mainFeature of Object.values(FEATURE_METADATA)) {
        const subFeature = mainFeature.subFeatures.find(sf => sf.key === feature)
        if (subFeature) {
          // Check both parent and sub-feature
          const parentEnabled = features[mainFeature.fieldName as keyof OrganizationFeatures] as boolean
          const subEnabled = features[subFeature.fieldName as keyof OrganizationFeatures] as boolean
          return parentEnabled && subEnabled
        }
      }
      return true // Default to enabled if not found
    }

    return features[fieldName as keyof OrganizationFeatures] as boolean
  } catch (error) {
    console.error('Error checking feature access:', error)
    return true // Default to enabled on error
  }
}

/**
 * Check multiple features at once
 */
export async function areFeaturesEnabled(
  orgId: string,
  features: (FeatureKey | SubFeatureKey)[]
): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  for (const feature of features) {
    results[feature] = await isFeatureEnabled(orgId, feature)
  }

  return results
}

/**
 * Get all enabled main features for an organization
 */
export async function getEnabledFeatures(orgId: string): Promise<FeatureKey[]> {
  try {
    const features = await getOrganizationFeatures(orgId)
    if (!features) return Object.keys(FEATURE_METADATA) as FeatureKey[]

    const enabledFeatures: FeatureKey[] = []

    for (const [key, metadata] of Object.entries(FEATURE_METADATA)) {
      const isEnabled = features[metadata.fieldName as keyof OrganizationFeatures] as boolean
      if (isEnabled) {
        enabledFeatures.push(key as FeatureKey)
      }
    }

    return enabledFeatures
  } catch (error) {
    console.error('Error getting enabled features:', error)
    return Object.keys(FEATURE_METADATA) as FeatureKey[]
  }
}

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

    return updated
  } catch (error) {
    console.error('Error updating organization features:', error)
    return null
  }
}

/**
 * Reset organization features to defaults (all enabled)
 */
export async function resetOrganizationFeatures(
  orgId: string
): Promise<OrganizationFeatures | null> {
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

    return updated
  } catch (error) {
    console.error('Error resetting organization features:', error)
    return null
  }
}

/**
 * Enable all features for an organization
 */
export async function enableAllFeatures(orgId: string): Promise<OrganizationFeatures | null> {
  return resetOrganizationFeatures(orgId)
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
      return { enabled: total, disabled: 0, total }
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
    return { enabled: total, disabled: 0, total }
  }
}

