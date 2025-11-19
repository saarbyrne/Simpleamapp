import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/profile'

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

  return (
    <Suspense fallback={
      <DashboardLayoutClient 
        userName={fallbackUserName} 
        userEmail={user?.email ?? null}
        userAvatar={null}
      >
        {children}
      </DashboardLayoutClient>
    }>
      <UserProfileWrapper 
        fallbackUserName={fallbackUserName}
        userEmail={user?.email ?? null}
      >
        {children}
      </UserProfileWrapper>
    </Suspense>
  )
}

async function UserProfileWrapper({
  fallbackUserName,
  userEmail,
  children
}: {
  fallbackUserName: string
  userEmail: string | null
  children: React.ReactNode
}) {
  // Skip database call for now to avoid connectivity issues
  return (
    <DashboardLayoutClient
      userName={fallbackUserName}
      userEmail={userEmail}
      userAvatar={null}
    >
      {children}
    </DashboardLayoutClient>
  )
}
