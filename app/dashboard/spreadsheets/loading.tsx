import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * Spreadsheets page loading skeleton
 *
 * Matches the actual spreadsheets page layout:
 * - Sidebar with folders
 * - Main area with header and spreadsheet grid
 */
export default function SpreadsheetsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <aside className="w-64 space-y-4 hidden lg:block">
          <Skeleton className="h-8 w-32" /> {/* "Folders" title */}
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" /> {/* Folder icon */}
                <Skeleton className="h-6 w-full" /> {/* Folder name */}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" /> {/* "Spreadsheets" title */}
              <Skeleton className="h-4 w-64" /> {/* Description */}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-40" /> {/* New Spreadsheet */}
              <Skeleton className="h-10 w-36" /> {/* From Template */}
            </div>
          </div>

          {/* Filters/search skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1 max-w-md" /> {/* Search */}
            <Skeleton className="h-10 w-32" /> {/* Filter */}
            <Skeleton className="h-10 w-32" /> {/* Sort */}
          </div>

          {/* Spreadsheets grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" /> {/* Sheet name */}
                    <Skeleton className="h-3 w-1/2" /> {/* Template */}
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full" /> {/* Star */}
                </div>

                {/* Description */}
                <Skeleton className="h-12 w-full" />

                {/* Tags */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Skeleton className="h-4 w-24" /> {/* Updated date */}
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Menu */}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
