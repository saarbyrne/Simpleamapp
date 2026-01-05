import { Skeleton } from '@/components/ui/skeleton'

/**
 * AI Workspace loading skeleton
 *
 * Matches the actual AI workspace layout:
 * - Top bar with title and actions
 * - Split panel layout (left: conversation, right: canvas)
 * - Bottom input area
 */
export default function Loading() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar Skeleton */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation */}
        <div className="flex w-[38%] flex-col border-r">
          {/* Messages Skeleton */}
          <div className="flex-1 space-y-4 p-4">
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="max-w-[80%] space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>

          {/* Input Area Skeleton */}
          <div className="border-t p-4">
            <Skeleton className="h-20 w-full rounded" />
          </div>
        </div>

        {/* Resize Handle */}
        <div className="w-1 bg-border" />

        {/* Right Panel - Canvas */}
        <div className="flex flex-1 items-center justify-center bg-muted/30">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
