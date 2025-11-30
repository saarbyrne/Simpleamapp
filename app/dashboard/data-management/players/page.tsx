import { Suspense } from 'react'
import { PlayersTable } from './_components/players-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

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
      <Suspense fallback={<PlayersTableSkeleton />}>
        <PlayersTable />
      </Suspense>
    </div>
  )
}

/**
 * Skeleton for players table
 * Shows while player data is streaming from server
 */
function PlayersTableSkeleton() {
  return (
    <Card className="p-6">
      {/* Table toolbar */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Table header */}
      <div className="border-b pb-3 mb-3">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 py-2">
            {[...Array(6)].map((_, j) => (
              <Skeleton key={j} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  )
}
