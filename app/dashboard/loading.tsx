import { Loader2 } from "lucide-react"
import { Icon } from "@/components/ui/icon"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Icon icon={Loader2} size="xl" color="primary" label="Loading" className="animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
