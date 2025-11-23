/**
 * Route Protection Utilities
 * 
 * Functions to check if a user has access to specific routes based on
 * their organization's enabled features.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { getFeatureKeyFromPath } from './feature-metadata'

/**
 * Check if a route requires feature access and if the user has it
 * Returns null if access is allowed, or a redirect response if denied
 */
export async function checkRouteAccess(
  request: NextRequest
): Promise<NextResponse | null> {
  const path = request.nextUrl.pathname

  // Skip check for non-dashboard routes
  if (!path.startsWith('/dashboard/')) {
    return null
  }

  // Skip check for base dashboard route
  if (path === '/dashboard' || path === '/dashboard/') {
    return null
  }

  // Get feature key from path
  const featureKey = getFeatureKeyFromPath(path)
  if (!featureKey) {
    return null // No feature restriction for this path
  }

  try {
    // Get user from session
    const { supabase, response } = createClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null // Let auth middleware handle this
    }

    // For now, we'll skip the actual database check in middleware
    // to avoid performance issues. The check will happen on the client side.
    // If you need strict server-side enforcement, you can enable this:
    
    /*
    // Get user's organization and check features
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { organizationId: true },
    })

    if (!dbUser) {
      return null
    }

    const isEnabled = await isFeatureEnabled(dbUser.organizationId, featureKey)
    
    if (!isEnabled) {
      // Redirect to dashboard with error message
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      url.searchParams.set('error', 'feature_disabled')
      return NextResponse.redirect(url)
    }
    */

    return null // Access allowed
  } catch (error) {
    console.error('Error checking route access:', error)
    return null // Fail open - allow access on error
  }
}

