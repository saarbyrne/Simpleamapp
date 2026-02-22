import { Skeleton } from '@/components/ui/skeleton'

export default function CalendarLoading() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      {/* Calendar grid skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="grid grid-cols-7 border-b">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-3 text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 border-b last:border-b-0">
            {Array.from({ length: 7 }).map((_, col) => (
              <div key={col} className="min-h-[80px] p-2 border-r last:border-r-0">
                <Skeleton className="h-4 w-6 mb-1" />
                {(row + col) % 3 === 0 && <Skeleton className="h-5 w-full rounded" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
