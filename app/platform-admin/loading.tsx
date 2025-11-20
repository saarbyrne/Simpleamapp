import { Loader2 } from 'lucide-react'

export default function PlatformAdminLoading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">Loading platform admin...</p>
    </div>
  )
}
