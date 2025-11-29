import { DataManagementClient } from './data-management-client'
import { prisma } from '@/lib/db'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { createServerClient } from '@/lib/supabase/server'

export default async function DataManagementPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="container mx-auto p-6">Not authenticated</div>
  }

  const dbUser = await ensureUserWithOrganization(user)

  // Load organization data summary
  const [
    playersCount,
    staffCount,
    eventsCount,
    formsCount,
    customTablesCount,
  ] = await Promise.all([
    prisma.personOrganization.count({
      where: {
        organizationId: dbUser.organizationId,
        role: 'player',
      },
    }),
    prisma.personOrganization.count({
      where: {
        organizationId: dbUser.organizationId,
        role: { not: 'player' },
      },
    }),
    prisma.event.count({
      where: { organizationId: dbUser.organizationId },
    }),
    prisma.form.count({
      where: { organizationId: dbUser.organizationId },
    }),
    prisma.spreadsheet.count({
      where: {
        organizationId: dbUser.organizationId,
        isDeleted: false,
      },
    }),
  ])

  return (
    <DataManagementClient
      dataSummary={{
        players: playersCount,
        staff: staffCount,
        events: eventsCount,
        forms: formsCount,
        customTables: customTablesCount,
      }}
    />
  )
}
