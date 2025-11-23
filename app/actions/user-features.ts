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
 */
export async function getUserEnabledFeatures(): Promise<{
  success: boolean
  features?: string[]
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user's organization
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true },
    })

    if (!dbUser) {
      return { success: false, error: 'User not found' }
    }

    const features = await getEnabledFeatures(dbUser.organizationId)

    return { success: true, features }
  } catch (error) {
    console.error('Error in getUserEnabledFeatures:', error)
    return { success: false, error: 'Failed to fetch enabled features' }
  }
}

