import { Skeleton } from "@/components/ui/skeleton"

/**
 * Dashboard root loading skeleton
 * 
 * Note: Dashboard root redirects to /dashboard/players, so this is minimal.
 * Individual dashboard pages have their own loading.tsx files.
 */
export default function Loading() {
  return (
    <div className="space-y-4">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Content placeholder */}
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  )
}
