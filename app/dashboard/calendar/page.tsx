import { Calendar } from '@/components/ui/calendar'

export default function CalendarPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          View and manage your schedule
        </p>
      </div>
      <div className="flex-1">
        <Calendar mode="single" className="rounded-md border" />
      </div>
    </div>
  )
}
