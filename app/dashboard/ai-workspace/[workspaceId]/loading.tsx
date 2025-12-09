export default function Loading() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar Skeleton */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation */}
        <div className="flex w-[38%] flex-col border-r">
          {/* Messages Skeleton */}
          <div className="flex-1 space-y-4 p-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="max-w-[80%] space-y-2">
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>

          {/* Input Area Skeleton */}
          <div className="border-t p-4">
            <div className="h-20 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Resize Handle */}
        <div className="w-1 bg-border" />

        {/* Right Panel - Canvas */}
        <div className="flex flex-1 items-center justify-center bg-muted/30">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-48 mx-auto animate-pulse rounded bg-muted" />
              <div className="h-4 w-64 mx-auto animate-pulse rounded bg-muted/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
