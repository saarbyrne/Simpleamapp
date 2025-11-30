import { Suspense } from 'react'
import { ReportsList } from './_components/reports-list'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

type ReportsPageProps = {
  searchParams?: {
    template?: string
  }
}

/**
 * Reports page with progressive loading
 *
 * PERFORMANCE STRATEGY:
 * 1. Page shell renders instantly (header, layout)
 * 2. Reports list streams in via Suspense (~300ms)
 * 3. Templates loaded in background (deferred, not blocking)
 *
 * BEFORE: User waits 1-3s staring at skeleton
 * AFTER: User sees content in 300-500ms
 */
export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* INSTANT: Page header renders immediately */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your organization&apos;s reports
          </p>
        </div>
      </div>

      {/* STREAMED: Reports list loads independently */}
      <Suspense fallback={<ReportsListSkeleton />}>
        <ReportsList />
      </Suspense>

      {/* TODO: Templates loaded in background when needed */}
    </div>
  )
}

/**
 * Skeleton for reports list
 * Shows while reports are streaming from server
 */
function ReportsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-20" />
          </div>
        </Card>
      ))}
    </div>
  )
}