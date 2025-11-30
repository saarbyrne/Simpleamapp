import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * Players page loading skeleton
 *
 * Matches the actual players data table layout:
 * - Page header with title and actions
 * - Data table with columns and rows
 */
export default function PlayersLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" /> {/* "Players" title */}
          <Skeleton className="h-4 w-64" /> {/* Description */}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" /> {/* Add Player button */}
          <Skeleton className="h-10 w-24" /> {/* Export button */}
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>

      {/* Data table skeleton */}
      <Card className="p-6">
        {/* Table toolbar */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-64" /> {/* Search */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" /> {/* Filter */}
            <Skeleton className="h-10 w-32" /> {/* Sort */}
          </div>
        </div>

        {/* Table header */}
        <div className="border-b pb-3 mb-3">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Table rows */}
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Skeleton className="h-4 w-40" /> {/* "Showing X of Y" */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" /> {/* Previous */}
            <Skeleton className="h-9 w-24" /> {/* Next */}
          </div>
        </div>
      </Card>
    </div>
  )
}
