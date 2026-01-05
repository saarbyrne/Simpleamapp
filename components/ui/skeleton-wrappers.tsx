import { Skeleton } from '@/components/ui/skeleton'

/**
 * Standardized skeleton loading components for consistent loading states
 * across the application. These match the PageCard variant="table" layout
 * structure with no horizontal padding (relies on PageFrame's p-4).
 */

interface TablePageSkeletonProps {
  /** Show filters toolbar section */
  showFilters?: boolean
  /** Show table section */
  showTable?: boolean
  /** Number of table rows to display */
  rows?: number
  /** Show pagination section */
  showPagination?: boolean
}

/**
 * Skeleton for table pages with filters, data table, and pagination
 * Used with PageCard variant="table"
 */
export function TablePageSkeleton({
  showFilters = true,
  showTable = true,
  rows = 10,
  showPagination = true,
}: TablePageSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Filters toolbar - no padding, matches actual */}
      {showFilters && (
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {/* Table with white background */}
      {showTable && (
        <div className="rounded-lg border bg-card">
          {/* Table header */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-6 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>
          </div>

          {/* Table rows */}
          <div className="p-4 space-y-3">
            {Array(rows)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  {Array(6)
                    .fill(0)
                    .map((_, j) => (
                      <Skeleton key={j} className="h-8 w-full" />
                    ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pagination - no padding */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      )}
    </div>
  )
}

interface CardListSkeletonProps {
  /** Number of cards to display */
  count?: number
  /** Show filters toolbar section */
  showFilters?: boolean
}

/**
 * Skeleton for vertical list of cards (Notes, Templates)
 * Used with PageCard variant="table"
 */
export function CardListSkeleton({
  count = 3,
  showFilters = true,
}: CardListSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Filters toolbar - no padding */}
      {showFilters && (
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {/* Cards with white background */}
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
    </div>
  )
}

interface CardGridSkeletonProps {
  /** Number of cards to display */
  count?: number
  /** Grid columns on large screens */
  columns?: 2 | 3 | 4
  /** Show page header with title and actions */
  showHeader?: boolean
}

/**
 * Skeleton for grid layout cards (Reports, Dashboard)
 * Used with PageCard variant="table"
 */
export function CardGridSkeleton({
  count = 6,
  columns = 3,
  showHeader = true,
}: CardGridSkeletonProps) {
  const gridClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Page header matching PageCard variant="table" */}
      {showHeader && (
        <div className="flex items-center justify-between min-w-0 px-0 py-6">
          <div className="flex flex-col gap-1 min-w-0">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="shrink-0 flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}

      {/* Card grid content matching PageCard variant="table" */}
      <div className="space-y-4 min-w-0 overflow-x-hidden">
        <div className={`grid ${gridClass} gap-6`}>
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

interface DetailPageSkeletonProps {
  /** Show header section with avatar/title */
  showHeader?: boolean
  /** Number of content sections */
  sections?: number
}

/**
 * Skeleton for detail/profile pages
 * Used with PageCard variant="table"
 */
export function DetailPageSkeleton({
  showHeader = true,
  sections = 3,
}: DetailPageSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Header with avatar and title */}
      {showHeader && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      )}

      {/* Content sections */}
      {Array(sections)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
    </div>
  )
}
