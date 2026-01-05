import { Skeleton } from '@/components/ui/skeleton'
import { TablePageSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Staff page loading skeleton
 *
 * Matches the actual staff table page structure:
 * - Header with title and action button
 * - Data table with filters, columns, rows, and pagination
 */
export default function StaffLoadingPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <TablePageSkeleton rows={10} />
    </div>
  )
}
