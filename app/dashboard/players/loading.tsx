import { Skeleton } from "@/components/ui/skeleton"

/**
 * Players page loading skeleton
 * 
 * Matches the actual players page structure which uses PageCard internally.
 * The actual page has a header section and then the PlayersTable component.
 */
export default function PlayersLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Content placeholder - PlayersTable uses PageCard internally */}
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  )
}
