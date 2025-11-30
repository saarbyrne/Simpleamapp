import { DataManagementClient } from './data-management-client'
import { prisma } from '@/lib/db'
import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { unstable_cache } from 'next/cache'

export const revalidate = 60 // Cache for 60 seconds

export default async function DataManagementPage() {
  const dbUser = await getCachedUserWithOrganization()

  if (!dbUser) {
    return <div className="container mx-auto p-6">Not authenticated</div>
  }

  // Cache data summary counts for 60 seconds
  const getCachedDataSummary = unstable_cache(
    async (organizationId: string) => {
      return await Promise.all([
        prisma.personOrganization.count({
          where: {
            organizationId,
            role: 'player',
          },
        }),
        prisma.personOrganization.count({
          where: {
            organizationId,
            role: { not: 'player' },
          },
        }),
        prisma.event.count({
          where: { organizationId },
        }),
        prisma.form.count({
          where: { organizationId },
        }),
        prisma.spreadsheet.count({
          where: {
            organizationId,
            isDeleted: false,
          },
        }),
      ])
    },
    [`data-summary-${dbUser.organizationId}`],
    { revalidate: 60, tags: ['data-summary', `org-${dbUser.organizationId}`] }
  )

  const [
    playersCount,
    staffCount,
    eventsCount,
    formsCount,
    customTablesCount,
  ] = await getCachedDataSummary(dbUser.organizationId)

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
