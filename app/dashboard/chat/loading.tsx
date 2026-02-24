import { Skeleton } from '@/components/ui/skeleton'

export default function ChatLoading() {
  return (
    <div className="flex h-full">
      {/* Chat list sidebar */}
      <div className="w-80 border-r p-4 space-y-3">
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
      {/* Chat area */}
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
  )
}
