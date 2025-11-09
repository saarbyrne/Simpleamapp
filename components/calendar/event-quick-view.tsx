'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Users, ExternalLink, Edit, Trash2, RefreshCw } from 'lucide-react'
import { type EventWithDetails } from '@/app/actions/events'
import { useRouter } from 'next/navigation'

interface EventQuickViewProps {
  event: EventWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

const eventTypeColors: Record<string, string> = {
  training: 'bg-primary/10 text-primary border-primary/20',
  match: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  medical: 'bg-destructive/10 text-destructive border-destructive/20',
  meeting: 'bg-accent/20 text-accent-foreground border-accent',
  other: 'bg-muted text-muted-foreground border-muted-foreground/20',
}

export function EventQuickView({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: EventQuickViewProps) {
  const router = useRouter()

  if (!event) {
    return null
  }

  const handleViewDetails = () => {
    onOpenChange(false)
    router.push(`/dashboard/calendar/events/${event.id}`)
  }

  const attendingCount = event.attendance?.filter(a => a.status === 'attending').length || 0
  const totalCount = event.attendance?.length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
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
                  {format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
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
            {totalCount > 0 && (
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  {attendingCount} of {totalCount} attending
                </div>
              </div>
            )}

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
      </DialogContent>
    </Dialog>
  )
}
