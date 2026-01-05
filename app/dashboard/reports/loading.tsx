import { Skeleton } from '@/components/ui/skeleton'
import { CardGridSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Reports page loading skeleton
 *
 * Matches the actual reports page layout:
 * - Page header with title and actions
 * - Grid of report cards (3 columns)
 */
export default function ReportsLoading() {
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
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Reports grid skeleton */}
      <CardGridSkeleton count={6} columns={3} />
    </div>
  )
}

