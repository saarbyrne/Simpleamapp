import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { getEnabledFeatures } from '@/lib/permissions/feature-access'

import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user metadata immediately (fast, no DB call)
  const fallbackUserName = user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.preferred_username ||
    user?.email?.split('@')[0] ||
    'Team member'

  // Fetch organization data and enabled features in parallel (both cached)
  let organizationName: string | null = null
  let organizationLogo: string | null = null
  let enabledFeatures: string[] = []
  try {
    const dbUser = await getCachedUserWithOrganization()
    organizationName = dbUser?.organization?.name ?? null
    organizationLogo = dbUser?.organization?.logo ?? null

    if (dbUser) {
      enabledFeatures = await getEnabledFeatures(
        dbUser.organizationId,
        dbUser.isPlatformAdmin
      )
    }
  } catch (error) {
    console.error('Failed to fetch organization data:', error)
  }

  return (
    <DashboardLayoutClient
      userName={fallbackUserName}
      userEmail={user?.email ?? null}
      userAvatar={null}
      organizationName={organizationName}
      organizationLogo={organizationLogo}
      enabledFeatures={enabledFeatures}
    >
      {children}
    </DashboardLayoutClient>
  )
}
