import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * Reports page loading skeleton
 *
 * Matches the actual reports page layout:
 * - Page header with title and actions
 * - Grid of report cards (3 columns)
 * - Each card shows report structure
 */
export default function ReportsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" /> {/* "Reports" title */}
          <Skeleton className="h-4 w-64" /> {/* Description */}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" /> {/* New Report button */}
          <Skeleton className="h-10 w-40" /> {/* From Template button */}
        </div>
      </div>

      {/* Filters/tabs skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Reports grid skeleton - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 space-y-4">
            {/* Report card header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" /> {/* Report title */}
                <Skeleton className="h-4 w-1/2" /> {/* Report type */}
              </div>
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Menu button */}
            </div>

            {/* Report description */}
            <Skeleton className="h-16 w-full" />

            {/* Report metadata */}
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-4 w-20" /> {/* Last run */}
              <Skeleton className="h-4 w-16" /> {/* Schedule */}
            </div>

            {/* Report actions */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 flex-1" /> {/* View button */}
              <Skeleton className="h-9 w-20" /> {/* Run button */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
