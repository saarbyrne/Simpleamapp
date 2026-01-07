import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/profile'
import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'

import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'
import { Skeleton } from '@/components/ui/skeleton'

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

  // Try to get organization name (cached, fast)
  let organizationName: string | null = null
  try {
    const dbUser = await getCachedUserWithOrganization()
    organizationName = dbUser?.organization?.name ?? null
  } catch (error) {
    // Silently fail - organization name is optional
    console.error('Failed to fetch organization name:', error)
  }

  return (
    <Suspense fallback={
      <DashboardLayoutClient 
        userName={fallbackUserName} 
        userEmail={user?.email ?? null}
        userAvatar={null}
        organizationName={organizationName}
      >
        {children}
      </DashboardLayoutClient>
    }>
      <UserProfileWrapper 
        fallbackUserName={fallbackUserName}
        userEmail={user?.email ?? null}
        organizationName={organizationName}
      >
        {children}
      </UserProfileWrapper>
    </Suspense>
  )
}

async function UserProfileWrapper({
  fallbackUserName,
  userEmail,
  organizationName,
  children
}: {
  fallbackUserName: string
  userEmail: string | null
  organizationName?: string | null
  children: React.ReactNode
}) {
  // Skip database call for now to avoid connectivity issues
  return (
    <DashboardLayoutClient
      userName={fallbackUserName}
      userEmail={userEmail}
      userAvatar={null}
      organizationName={organizationName}
    >
      {children}
    </DashboardLayoutClient>
  )
}
