import { Skeleton } from "@/components/ui/skeleton"
import { DetailPageSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Player profile page loading skeleton
 *
 * Matches the actual player profile page structure:
 * - Header with avatar, name, and action buttons
 * - Tabs section
 * - Content sections using DetailPageSkeleton
 */
export default function PlayerProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Header bar - matches PageCard title structure */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Content sections */}
      <DetailPageSkeleton showHeader={false} sections={4} />
    </div>
  )
}

