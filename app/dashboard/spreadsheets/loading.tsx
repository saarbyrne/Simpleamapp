import { Skeleton } from '@/components/ui/skeleton'
import { CardGridSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Spreadsheets page loading skeleton
 *
 * Matches the actual spreadsheets page layout:
 * - Sidebar with folders
 * - Main area with header and spreadsheet grid
 */
export default function SpreadsheetsLoading() {
  return (
    <div className="flex gap-6">
      {/* Sidebar skeleton */}
      <aside className="w-64 space-y-4 hidden lg:block">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Filters/search skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Spreadsheets grid skeleton */}
        <CardGridSkeleton count={9} columns={3} />
      </div>
    </div>
  )
}
