'use client'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

type DashboardLayoutClientProps = {
  userName: string
  userEmail: string | null
  children: React.ReactNode
}

export function DashboardLayoutClient({
  userName,
  userEmail,
  children,
}: DashboardLayoutClientProps) {
  return (
    <SidebarProvider>
      <AppSidebar userName={userName} userEmail={userEmail} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 bg-gray-50 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
