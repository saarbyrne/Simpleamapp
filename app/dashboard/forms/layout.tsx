import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { ReactNode } from 'react'

export default function FormsLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell currentPage="forms" title="Forms">
      {children}
    </DashboardShell>
  )
}
