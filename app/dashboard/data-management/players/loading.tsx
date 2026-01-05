import { Skeleton } from '@/components/ui/skeleton'
import { TablePageSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Players data management page loading skeleton
 *
 * Matches the actual players data table layout:
 * - Page header with title and actions
 * - Stats cards (3 cards)
 * - Data table with filters, columns, rows, and pagination
 */
export default function PlayersLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Data table skeleton */}
      <TablePageSkeleton rows={10} />
    </div>
  )
}
