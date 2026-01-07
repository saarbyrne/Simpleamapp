/**
 * Server Actions for User Feature Access
 * 
 * These actions are used by regular users to check their organization's
 * feature access.
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { getEnabledFeatures } from '@/lib/permissions/feature-access'
import { prisma } from '@/lib/db'

/**
 * Get enabled features for the current user's organization
 * Takes into account:
 * - Platform admin status (sees all features including unreleased)
 * - Feature release status (unreleased hidden from regular users)
 * - Subscription tier defaults
 * - Per-org overrides
 */
export async function getUserEnabledFeatures(): Promise<{
  success: boolean
  features?: string[]
  isPlatformAdmin?: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user's organization and platform admin status
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { 
        organizationId: true,
        isPlatformAdmin: true,
      },
    })

    if (!dbUser) {
      return { success: false, error: 'User not found' }
    }

    // Get enabled features (platform admins see all)
    const features = await getEnabledFeatures(
      dbUser.organizationId, 
      dbUser.isPlatformAdmin
    )

    return { 
      success: true, 
      features,
      isPlatformAdmin: dbUser.isPlatformAdmin,
    }
  } catch (error) {
    console.error('Error in getUserEnabledFeatures:', error)
    return { success: false, error: 'Failed to fetch enabled features' }
  }
}

/**
 * Check if the current user is a platform admin
 */
export async function checkIsPlatformAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { isPlatformAdmin: true },
    })

    return dbUser?.isPlatformAdmin ?? false
  } catch (error) {
    console.error('Error checking platform admin status:', error)
    return false
  }
}