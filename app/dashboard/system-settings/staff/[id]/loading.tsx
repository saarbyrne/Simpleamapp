import { Skeleton } from '@/components/ui/skeleton'
import { DetailPageSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Staff member profile page loading skeleton
 *
 * Matches the actual staff profile page structure:
 * - Header with avatar, name, and action buttons
 * - Tabs section
 * - Content sections using DetailPageSkeleton
 */
export default function StaffMemberLoadingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Content sections */}
      <DetailPageSkeleton showHeader={false} sections={3} />
    </div>
  )
}
