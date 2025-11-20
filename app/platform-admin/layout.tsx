import { redirect } from 'next/navigation'
import { requirePlatformAdmin } from '@/lib/platform-admin'
import { PlatformAdminSidebar } from '@/components/platform-admin/platform-admin-sidebar'

type PlatformAdminLayoutProps = {
  children: React.ReactNode
}

export default async function PlatformAdminLayout({ children }: PlatformAdminLayoutProps) {
  // Check if user is a platform admin
  try {
    const admin = await requirePlatformAdmin()

    return (
      <div className="flex h-screen overflow-hidden">
        <PlatformAdminSidebar adminName={admin.name} adminEmail={admin.email} />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    )
  } catch (error) {
    // User is not a platform admin or not authenticated
    redirect('/dashboard')
  }
}

export const metadata = {
  title: 'Platform Admin',
  description: 'Platform administration for SaaS management',
}
