'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEvent, deleteEvent, deleteEventSeries, type EventWithDetails } from '@/app/actions/events'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate, formatTime } from '@/lib/date-utils'
import { useBreadcrumb } from '@/lib/breadcrumb-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AttendanceManager } from '@/components/calendar/attendance-manager'
import { EventFormDialog } from '@/components/calendar/event-form-dialog'
import {
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Users,
  Table,
  FileText,
  PenTool,
  ClipboardList,
  FolderOpen,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

const eventTypeColors: Record<string, string> = {
  training: 'bg-primary/20 text-foreground border-primary',
  match: 'bg-chart-2/20 text-foreground border-chart-2',
  medical: 'bg-destructive/20 text-foreground border-destructive',
  meeting: 'bg-accent text-accent-foreground border-accent-foreground',
  other: 'bg-muted text-foreground border-border',
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const { preferences } = useUserPreferences()
  const { setCustomLabel } = useBreadcrumb()

  const [event, setEvent] = useState<EventWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRecurringActionDialog, setShowRecurringActionDialog] = useState(false)
  const [recurringAction, setRecurringAction] = useState<'edit' | 'delete' | null>(null)

  const loadEvent = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getEvent(eventId)
      if ('error' in result) {
        toast.error(result.error)
        router.push('/dashboard/calendar')
      } else {
        setEvent(result.event)
        // Set the event title in breadcrumb context
        setCustomLabel(eventId, result.event.title)
      }
    } catch (error) {
      toast.error('Failed to load event')
      router.push('/dashboard/calendar')
    } finally {
      setIsLoading(false)
    }
  }, [eventId, setCustomLabel, router])

  useEffect(() => {
    loadEvent()
    
    // Cleanup: remove custom label when component unmounts or eventId changes
    return () => {
      setCustomLabel(eventId, null)
    }
  }, [eventId, setCustomLabel, loadEvent])

  const handleEdit = () => {
    if (event?.isRecurring) {
      setRecurringAction('edit')
      setShowRecurringActionDialog(true)
    } else {
      setShowEditDialog(true)
    }
  }

  const handleDelete = () => {
    if (event?.isRecurring) {
      setRecurringAction('delete')
      setShowRecurringActionDialog(true)
    } else {
      setShowDeleteDialog(true)
    }
  }

  const handleRecurringThisOnly = () => {
    setShowRecurringActionDialog(false)
    if (recurringAction === 'edit') {
      setShowEditDialog(true)
    } else if (recurringAction === 'delete') {
      setShowDeleteDialog(true)
    }
  }

  const handleRecurringAllInstances = async () => {
    setShowRecurringActionDialog(false)
    if (!event) return

    if (recurringAction === 'delete') {
      try {
        const result = await deleteEventSeries(event.id)
        if ('error' in result) {
          toast.error(result.error)
        } else {
          toast.success('All event instances deleted successfully')
          router.push('/dashboard/calendar')
        }
      } catch (error) {
        toast.error('Failed to delete event series')
      }
    }
  }

  const confirmDelete = async () => {
    if (!event) return

    try {
      const result = await deleteEvent(event.id)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success('Event deleted successfully')
        router.push('/dashboard/calendar')
      }
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return null
  }

  const attendingCount = event.attendance?.filter(a => a.status === 'attending').length || 0
  const totalCount = event.attendance?.length || 0

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={eventTypeColors[event.type] || eventTypeColors.other}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {event.isRecurring && (
              <Badge variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Recurring Event
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startTime, preferences || undefined)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(event.startTime, preferences || undefined)} - {formatTime(event.endTime, preferences || undefined)}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
            {totalCount > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {attendingCount} of {totalCount} attending
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="me-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="me-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Users className="me-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="spreadsheets">
            <Table className="me-2 h-4 w-4" />
            Spreadsheets
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="me-2 h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="drawings">
            <PenTool className="me-2 h-4 w-4" />
            Canvas
          </TabsTrigger>
          <TabsTrigger value="forms">
            <ClipboardList className="me-2 h-4 w-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="files">
            <FolderOpen className="me-2 h-4 w-4" />
            Files
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto py-6">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                {event.description && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}

                {!event.description && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No description</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a description to provide more details about this event
                    </p>
                    <Button variant="outline" className="mt-4" onClick={handleEdit}>
                      <Edit className="me-2 h-4 w-4" />
                      Add Description
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <AttendanceManager
                eventId={event.id}
                attendees={event.attendance as any}
                onUpdate={loadEvent}
              />
            </TabsContent>

            <TabsContent value="spreadsheets" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Table className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Event Spreadsheets</h3>
                <p className="mb-4 max-w-md text-sm text-muted-foreground">
                  Link spreadsheet modules to track performance data, stats, and metrics for this event.
                  Data will sync automatically when spreadsheets are created.
                </p>
                <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                  <p className="text-sm font-medium">Integration Ready</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the Spreadsheets module to enable this feature
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Event Notes</h3>
                <p className="mb-4 max-w-md text-sm text-muted-foreground">
                  Link note modules for coach observations, medical notes, and other documentation.
                  Notes will appear here when the Notes module is implemented.
                </p>
                <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                  <p className="text-sm font-medium">Integration Ready</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the Notes module to enable this feature
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drawings" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <PenTool className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Event Canvas</h3>
                <p className="mb-4 max-w-md text-sm text-muted-foreground">
                  Link canvas modules for formations, tactics, and session plans.
                  Canvas content will appear here when the Canvas module is implemented.
                </p>
                <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                  <p className="text-sm font-medium">Integration Ready</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the Canvas module to enable this feature
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forms" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Event Forms</h3>
                <p className="mb-4 max-w-md text-sm text-muted-foreground">
                  Link form modules to distribute wellness checks, post-event surveys, and assessments.
                  Forms linked to this event will appear here automatically.
                </p>
                <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                  <p className="text-sm font-medium">Integration Ready</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The Forms module exists - integration can be enabled when needed
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Event Files</h3>
                <p className="mb-4 max-w-md text-sm text-muted-foreground">
                  Link file modules for scouting reports, videos, and other documents.
                  Files will appear here when the Files module is implemented.
                </p>
                <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                  <p className="text-sm font-medium">Integration Ready</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the Files module to enable this feature
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

      {/* Edit Dialog */}
      <EventFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          loadEvent()
          setShowEditDialog(false)
        }}
        defaultValues={
          event
            ? {
                id: event.id,
                title: event.title,
                description: event.description ?? undefined,
                type: event.type as 'training' | 'match' | 'medical' | 'meeting' | 'other',
                startTime: new Date(event.startTime),
                endTime: new Date(event.endTime),
                location: event.location ?? undefined,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recurring Event Action Dialog */}
      <AlertDialog open={showRecurringActionDialog} onOpenChange={setShowRecurringActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {recurringAction === 'edit' ? 'Edit Recurring Event' : 'Delete Recurring Event'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This is a recurring event. What would you like to {recurringAction}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
            <AlertDialogCancel onClick={() => setShowRecurringActionDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRecurringThisOnly}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              This event only
            </AlertDialogAction>
            <AlertDialogAction onClick={handleRecurringAllInstances}>
              All events in series
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
