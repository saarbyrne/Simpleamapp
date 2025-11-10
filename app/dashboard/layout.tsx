import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/profile'

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

  // Fetch user profile to get avatar and name from database
  const profileResult = await getCurrentUserProfile()
  
  const userName = profileResult.success && profileResult.data
    ? profileResult.data.name
    : user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.user_metadata?.preferred_username ||
      user?.email?.split('@')[0] ||
      'Team member'

  const userAvatar = profileResult.success && profileResult.data
    ? profileResult.data.avatar
    : null

  return (
    <DashboardLayoutClient 
      userName={userName} 
      userEmail={user?.email ?? null}
      userAvatar={userAvatar}
    >
      {children}
    </DashboardLayoutClient>
  )
}
