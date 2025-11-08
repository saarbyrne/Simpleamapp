'use client'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default function SidebarPreviewPage() {
  return (
    <DashboardShell currentPage="forms" title="Preview">
      <div className="flex flex-1 items-center justify-center bg-muted/30">
        <div className="rounded-lg border bg-background p-8 shadow-sm">
          <p className="text-muted-foreground">Sidebar preview content</p>
        </div>
      </div>
    </DashboardShell>
  )
}
