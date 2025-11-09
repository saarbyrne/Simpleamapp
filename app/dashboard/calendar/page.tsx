'use client'

import { useState, useEffect, useCallback } from 'react'
import { EventCalendar, CalendarEvent } from '@/components/calendar/event-calendar'
import { EventFormDialog } from '@/components/calendar/event-form-dialog'
import { EventDetailDialog } from '@/components/calendar/event-detail-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getEvents, deleteEvent, type EventWithDetails } from '@/app/actions/events'
import { toast } from 'sonner'
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

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formDefaultValues, setFormDefaultValues] = useState<any>(null)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // Load events
  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getEvents()
      if ('error' in result) {
        toast.error(result.error)
      } else {
        // Transform events for calendar
        const calendarEvents: CalendarEvent[] = result.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          type: event.type,
          location: event.location,
          description: event.description,
        }))
        setEvents(calendarEvents)
      }
    } catch (error) {
      toast.error('Failed to load events')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Handle event selection
  const handleSelectEvent = useCallback(async (event: CalendarEvent) => {
    // Fetch full event details
    const result = await getEvents()
    if ('error' in result) {
      toast.error(result.error)
      return
    }

    const fullEvent = result.events.find((e: any) => e.id === event.id)
    if (fullEvent) {
      setSelectedEvent(fullEvent as EventWithDetails)
      setShowEventDetail(true)
    }
  }, [])

  // Handle slot selection (create new event)
  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setFormDefaultValues({
      startTime: slotInfo.start,
      endTime: slotInfo.end,
    })
    setShowEventForm(true)
  }, [])

  // Handle event creation/update success
  const handleEventFormSuccess = useCallback(() => {
    loadEvents()
    setFormDefaultValues(null)
  }, [loadEvents])

  // Handle edit event
  const handleEditEvent = useCallback(() => {
    if (selectedEvent) {
      setFormDefaultValues({
        id: selectedEvent.id,
        title: selectedEvent.title,
        description: selectedEvent.description,
        type: selectedEvent.type,
        startTime: new Date(selectedEvent.startTime),
        endTime: new Date(selectedEvent.endTime),
        location: selectedEvent.location,
      })
      setShowEventDetail(false)
      setShowEventForm(true)
    }
  }, [selectedEvent])

  // Handle delete event
  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      setEventToDelete(selectedEvent.id)
      setShowDeleteDialog(true)
    }
  }, [selectedEvent])

  // Confirm delete
  const confirmDelete = useCallback(async () => {
    if (!eventToDelete) return

    try {
      const result = await deleteEvent(eventToDelete)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success('Event deleted successfully')
        setShowEventDetail(false)
        setShowDeleteDialog(false)
        setEventToDelete(null)
        setSelectedEvent(null)
        loadEvents()
      }
    } catch (error) {
      toast.error('Failed to delete event')
      console.error(error)
    }
  }, [eventToDelete, loadEvents])

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage your events, matches, and training sessions
          </p>
        </div>
        <Button onClick={() => {
          setFormDefaultValues(null)
          setShowEventForm(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading events...</p>
            </div>
          </div>
        ) : (
          <EventCalendar
            events={events}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
          />
        )}
      </div>

      {/* Event Form Dialog */}
      <EventFormDialog
        open={showEventForm}
        onOpenChange={(open) => {
          setShowEventForm(open)
          if (!open) {
            setFormDefaultValues(null)
          }
        }}
        onSuccess={handleEventFormSuccess}
        defaultValues={formDefaultValues}
      />

      {/* Event Detail Dialog */}
      <EventDetailDialog
        open={showEventDetail}
        onOpenChange={setShowEventDetail}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
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
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false)
              setEventToDelete(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
