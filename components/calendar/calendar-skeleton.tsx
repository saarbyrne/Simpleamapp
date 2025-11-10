export function CalendarSkeleton() {
  return (
    <div className="h-full w-full animate-pulse">
      <div className="mb-4 flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-muted" />
          <div className="h-10 w-20 rounded-md bg-muted" />
          <div className="h-10 w-10 rounded-md bg-muted" />
        </div>
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded-md bg-muted" />
          <div className="h-9 w-20 rounded-md bg-muted" />
          <div className="h-9 w-20 rounded-md bg-muted" />
        </div>
      </div>
      <div className="h-full rounded-lg border bg-card p-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-24 rounded-md bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
