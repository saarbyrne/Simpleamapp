import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.preferred_username ||
    user?.email?.split('@')[0] ||
    'Team member'

  return (
    <DashboardLayoutClient userName={userName} userEmail={user?.email ?? null}>
      {children}
    </DashboardLayoutClient>
  )
}
