import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Dynamically import calendar client to reduce initial bundle size
const CalendarClient = dynamic(() => import('./calendar-client').then(mod => ({ default: mod.CalendarClient })), {
  loading: () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  ),
  ssr: false,
})

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    }>
      <CalendarClient />
    </Suspense>
  )
}
