import { Suspense } from 'react'
import { PlayersTable } from './_components/players-table'
import { TablePageSkeleton } from '@/components/ui/skeleton-wrappers'

export const metadata = {
  title: 'Players | SAM',
  description: 'Manage player data',
}

/**
 * Players page with progressive loading
 *
 * PERFORMANCE STRATEGY:
 * 1. Page header renders instantly
 * 2. Player table streams in via Suspense (~400ms)
 * 3. Only first 100 players loaded initially
 *
 * BEFORE: 2-3s of skeleton while loading all players
 * AFTER: ~400ms to first players visible
 */
export default async function PlayersDataPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* INSTANT: Page header renders immediately */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Players</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all players in your organization
          </p>
        </div>
      </div>

      {/* STREAMED: Player table loads independently */}
      <Suspense fallback={<TablePageSkeleton rows={10} />}>
        <PlayersTable />
      </Suspense>
    </div>
  )
}
