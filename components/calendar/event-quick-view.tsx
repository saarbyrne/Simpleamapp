'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Calendar, Clock, MapPin, Users, ExternalLink, Edit, Trash2, RefreshCw, X } from 'lucide-react'
import { type EventWithDetails } from '@/app/actions/events'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate, formatTime, formatDateRange } from '@/lib/date-utils'

interface EventQuickViewProps {
  event: EventWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
  isLoadingDetails?: boolean
}

const eventTypeColors: Record<string, string> = {
  training: 'bg-primary/20 text-foreground border-primary',
  match: 'bg-chart-2/20 text-foreground border-chart-2',
  medical: 'bg-destructive/20 text-foreground border-destructive',
  meeting: 'bg-accent text-accent-foreground border-accent-foreground',
  other: 'bg-muted text-foreground border-border',
}

export function EventQuickView({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  isLoadingDetails = false,
}: EventQuickViewProps) {
  const router = useRouter()
  const { preferences } = useUserPreferences()

  if (!event) {
    return null
  }

  const handleViewDetails = () => {
    onOpenChange(false)
    router.push(`/dashboard/calendar/events/${event.id}`)
  }

  const attendingCount = event.attendance?.filter(a => a.status === 'attending').length || 0
  const totalCount = event.attendance?.length || 0

  // Format date and time using user preferences
  const formattedDate = formatDate(event.startTime, preferences || undefined)
  const formattedTimeRange = `${formatTime(event.startTime, preferences || undefined)} - ${formatTime(event.endTime, preferences || undefined)}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg sm:rounded-lg p-0",
            "duration-0 data-[state=open]:animate-none data-[state=closed]:animate-none"
          )}
        >
          <DialogTitle className="sr-only">{event.title}</DialogTitle>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={eventTypeColors[event.type] || eventTypeColors.other}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  {event.isRecurring && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Recurring
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pb-3">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 space-y-0.5 text-sm">
                <div className="font-medium">
                  {formattedDate}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formattedTimeRange}
                </div>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm">{event.location}</div>
              </div>
            )}

            {/* Attendance */}
            {isLoadingDetails ? (
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm text-muted-foreground">
                  Loading attendance...
                </div>
              </div>
            ) : totalCount > 0 ? (
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  {attendingCount} of {totalCount} attending
                </div>
              </div>
            ) : null}

            {/* Description preview */}
            {event.description && (
              <div className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit()
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </DialogPrimitive.Content>
    </DialogPortal>
    </Dialog>
  )
}
