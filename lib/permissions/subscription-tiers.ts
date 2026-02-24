/**
 * Subscription Tier Feature Mappings
 * 
 * Loads package defaults from the database to determine which features 
 * are available by default for each subscription tier.
 */

import { prisma } from '@/lib/db'
import { FeatureKey } from './feature-metadata'

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

/**
 * Get package defaults from database
 */
export async function getPackageDefaults(tier: SubscriptionTier): Promise<FeatureKey[]> {
  try {
    const packageDefaults = await prisma.packageDefaults.findUnique({
      where: { tier },
      select: { features: true },
    })
    
    return (packageDefaults?.features as FeatureKey[]) ?? []
  } catch (error) {
    console.error('Error loading package defaults:', error)
    // Fallback to basic defaults
    return getDefaultPackageFeatures(tier)
  }
}

/**
 * Fallback defaults if database query fails
 */
function getDefaultPackageFeatures(tier: SubscriptionTier): FeatureKey[] {
  switch (tier) {
    case 'free':
      return ['players', 'calendar', 'notes', 'files']
    case 'pro':
      return [
        'players',
        'calendar',
        'notes',
        'files',
        'forms',
        'reports',
        'spreadsheets',
        'canvas',
        'planner',
        'templates',
        'messages',
        'dataManagement',
      ]
    case 'enterprise':
      return [
        'aiWorkspace',
        'ai',
        'players',
        'forms',
        'reports',
        'calendar',
        'messages',
        'notes',
        'spreadsheets',
        'canvas',
        'files',
        'planner',
        'templates',
        'dataManagement',
      ]
  }
}

/**
 * Get all package defaults for all tiers
 */
export async function getAllPackageDefaults(): Promise<Record<SubscriptionTier, FeatureKey[]>> {
  const [free, pro, enterprise] = await Promise.all([
    getPackageDefaults('free'),
    getPackageDefaults('pro'),
    getPackageDefaults('enterprise'),
  ])
  
  return { free, pro, enterprise }
}

/**
 * Update package defaults for a tier
 */
export async function updatePackageDefaults(
  tier: SubscriptionTier,
  features: FeatureKey[]
): Promise<boolean> {
  try {
    await prisma.packageDefaults.upsert({
      where: { tier },
      update: { features: features as string[] },
      create: {
        tier,
        features: features as string[],
      },
    })
    return true
  } catch (error) {
    console.error('Error updating package defaults:', error)
    return false
  }
}

/**
 * Check if a feature is included in a subscription tier's package
 */
export async function isFeatureInPackage(
  feature: FeatureKey,
  tier: SubscriptionTier
): Promise<boolean> {
  const packageFeatures = await getPackageDefaults(tier)
  return packageFeatures.includes(feature)
}

/**
 * Tier display information for UI
 */
export const TIER_DISPLAY_INFO: Record<SubscriptionTier, {
  label: string
  description: string
  color: string
}> = {
  free: {
    label: 'Free',
    description: 'Basic features for small teams',
    color: 'bg-muted text-muted-foreground',
  },
  pro: {
    label: 'Pro',
    description: 'Full feature set for professional teams',
    color: 'bg-primary/10 text-primary',
  },
  enterprise: {
    label: 'Enterprise',
    description: 'All features with advanced capabilities',
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  },
}

/**
 * Get tier display info
 */
export function getTierDisplayInfo(tier: SubscriptionTier) {
  return TIER_DISPLAY_INFO[tier]
}
