import { Skeleton } from '@/components/ui/skeleton'

/**
 * Platform admin page loading skeleton
 *
 * Matches the actual platform admin page structure:
 * - Header section with border-b p-8
 * - Stats grid (4 cards)
 * - Recent activity cards (2 cards)
 */
export default function PlatformAdminLoading() {
  return (
    <div className="flex flex-col">
      {/* Page Header Skeleton */}
      <div className="border-b p-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="flex-1 space-y-6 p-8">
        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          ))}
        </div>

        {/* Recent Organizations and Users Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array(2).fill(0).map((_, cardIndex) => (
            <div key={cardIndex} className="rounded-lg border bg-card p-6">
              <div className="space-y-2 mb-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
