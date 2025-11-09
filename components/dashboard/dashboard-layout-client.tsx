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
      <SidebarInset className="flex flex-col">
        <div className="sticky top-0 z-10 shrink-0 w-full overflow-x-hidden bg-background">
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
          </header>
        </div>
        <div className="flex flex-1 flex-col gap-4 bg-background p-4 overflow-y-auto overflow-x-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
