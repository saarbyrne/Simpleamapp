import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell currentPage="players" title="Players">
      {children}
    </DashboardShell>
  )
}
