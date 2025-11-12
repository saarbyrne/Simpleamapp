'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { EventFormDialog } from '@/components/calendar/event-form-dialog'
import { EventQuickView } from '@/components/calendar/event-quick-view'
import { CalendarSkeleton } from '@/components/calendar/calendar-skeleton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

// Lazy load the heavy calendar component to improve initial page load
const EventCalendar = dynamic(
  () => import('@/components/calendar/event-calendar').then((mod) => ({ default: mod.EventCalendar })),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false, // Calendar is client-only
  }
)
import { getEvents, getEvent, deleteEvent, deleteEventSeries, type EventWithDetails } from '@/app/actions/events'
import { toast } from 'sonner'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, subMonths, addMonths, subWeeks, addWeeks, subDays, addDays } from 'date-fns'
import type { View } from 'react-big-calendar'
import type { CalendarEvent } from '@/components/calendar/event-calendar'
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
import { useTranslations } from 'next-intl'

export function CalendarClient() {
  const t = useTranslations()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRecurringActionDialog, setShowRecurringActionDialog] = useState(false)
  const [recurringAction, setRecurringAction] = useState<'edit' | 'delete' | null>(null)
  const [formDefaultValues, setFormDefaultValues] = useState<any>(null)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>('month')
  
  // Cache for loaded date ranges
  const loadedRangesRef = useRef<Map<string, CalendarEvent[]>>(new Map())
  const allCachedEventsRef = useRef<CalendarEvent[]>([])

  // Load initial events immediately on mount (non-blocking)
  useEffect(() => {
    loadEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculate date range for fetching (wider range for caching)
  const getFetchDateRange = useCallback((date: Date, view: View) => {
    let startDate: Date
    let endDate: Date

    switch (view) {
      case 'month':
        startDate = startOfMonth(subMonths(date, 1))
        endDate = endOfMonth(addMonths(date, 1))
        break
      case 'week':
        startDate = startOfWeek(subWeeks(date, 2))
        endDate = endOfWeek(addWeeks(date, 1))
        break
      case 'day':
        startDate = startOfDay(subDays(date, 7))
        endDate = endOfDay(addDays(date, 7))
        break
      default:
        startDate = startOfMonth(subMonths(date, 1))
        endDate = endOfMonth(addMonths(date, 1))
    }

    return { startDate, endDate }
  }, [])

  // Calculate display date range (what to show)
  const getDisplayDateRange = useCallback((date: Date, view: View) => {
    let startDate: Date
    let endDate: Date

    switch (view) {
      case 'month':
        startDate = startOfMonth(date)
        endDate = endOfMonth(date)
        break
      case 'week':
        startDate = startOfWeek(date)
        endDate = endOfWeek(date)
        break
      case 'day':
        startDate = startOfDay(date)
        endDate = endOfDay(date)
        break
      default:
        startDate = startOfMonth(date)
        endDate = endOfMonth(date)
    }

    return { startDate, endDate }
  }, [])

  // Load events with caching
  const loadEvents = useCallback(async (date?: Date, view?: View, forceReload = false) => {
    const targetDate = date || currentDate
    const targetView = view || currentView
    
    const displayRange = getDisplayDateRange(targetDate, targetView)
    const fetchRange = getFetchDateRange(targetDate, targetView)
    const cacheKey = `${fetchRange.startDate.getTime()}-${fetchRange.endDate.getTime()}`
    
    if (!forceReload && loadedRangesRef.current.has(cacheKey)) {
      const cachedEvents = loadedRangesRef.current.get(cacheKey)!
      const filteredEvents = cachedEvents.filter(event => 
        event.start >= displayRange.startDate && event.start <= displayRange.endDate
      )
      setEvents(filteredEvents)
      return
    }

    const cachedEvents = allCachedEventsRef.current
    const eventsInRange = cachedEvents.filter(event => 
      event.start >= displayRange.startDate && event.start <= displayRange.endDate
    )
    
    if (eventsInRange.length > 0 && !forceReload) {
      setEvents(eventsInRange)
    }

    try {
      const result = await getEvents(fetchRange.startDate, fetchRange.endDate)
      if ('error' in result) {
        toast.error(result.error)
        return
      }

      const calendarEvents: CalendarEvent[] = result.events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        type: event.type,
        location: event.location,
        description: event.description,
      }))

      loadedRangesRef.current.set(cacheKey, calendarEvents)
      
      const existingIds = new Set(allCachedEventsRef.current.map(e => e.id))
      const newEvents = calendarEvents.filter(e => !existingIds.has(e.id))
      allCachedEventsRef.current = [...allCachedEventsRef.current, ...newEvents]
      
      const filteredEvents = calendarEvents.filter(event => 
        event.start >= displayRange.startDate && event.start <= displayRange.endDate
      )
      
      setEvents(filteredEvents)
    } catch (error) {
      toast.error(t('calendar.failedToLoadEvents'))
      console.error(error)
    }
  }, [currentDate, currentView, getDisplayDateRange, getFetchDateRange, t])

  const handleCalendarNavigate = useCallback((date: Date) => {
    setCurrentDate(date)
    loadEvents(date, currentView, false)
  }, [currentView, loadEvents])

  const handleCalendarViewChange = useCallback((view: View) => {
    setCurrentView(view)
    loadEvents(currentDate, view, false)
  }, [currentDate, loadEvents])

  // Handle event selection - show cached data instantly, fetch details in background
  const handleSelectEvent = useCallback(async (event: CalendarEvent) => {
    const cachedEventData: EventWithDetails = {
      id: event.id,
      title: event.title,
      description: event.description || null,
      type: event.type,
      startTime: event.start,
      endTime: event.end,
      location: event.location || null,
      isRecurring: false,
      recurringRule: null,
      linkedFormId: null,
      organizationId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      attendance: [],
    }
    
    setSelectedEvent(cachedEventData)
    setShowQuickView(true)
    setIsLoadingDetails(true)
    
    // Fetch full details in background
    getEvent(event.id).then((result) => {
      setIsLoadingDetails(false)
      if ('error' in result) {
        console.error('Failed to load event details:', result.error)
        return
      }
      setSelectedEvent(result.event)
    })
  }, [])

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setFormDefaultValues({
      startTime: slotInfo.start,
      endTime: slotInfo.end,
    })
    setShowEventForm(true)
  }, [])

  const handleEventFormSuccess = useCallback(() => {
    loadedRangesRef.current.clear()
    allCachedEventsRef.current = []
    loadEvents(currentDate, currentView, true)
    setFormDefaultValues(null)
  }, [currentDate, currentView, loadEvents])

  const handleEditEvent = useCallback(() => {
    if (selectedEvent) {
      if (selectedEvent.isRecurring) {
        setRecurringAction('edit')
        setShowRecurringActionDialog(true)
      } else {
        setFormDefaultValues({
          id: selectedEvent.id,
          title: selectedEvent.title,
          description: selectedEvent.description,
          type: selectedEvent.type,
          startTime: new Date(selectedEvent.startTime),
          endTime: new Date(selectedEvent.endTime),
          location: selectedEvent.location,
        })
        setShowQuickView(false)
        setShowEventForm(true)
      }
    }
  }, [selectedEvent])

  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      if (selectedEvent.isRecurring) {
        setRecurringAction('delete')
        setShowRecurringActionDialog(true)
      } else {
        setEventToDelete(selectedEvent.id)
        setShowDeleteDialog(true)
      }
    }
  }, [selectedEvent])

  const handleRecurringThisOnly = useCallback(() => {
    if (!selectedEvent) return

    setShowRecurringActionDialog(false)

    if (recurringAction === 'edit') {
      setFormDefaultValues({
        id: selectedEvent.id,
        title: selectedEvent.title,
        description: selectedEvent.description,
        type: selectedEvent.type,
        startTime: new Date(selectedEvent.startTime),
        endTime: new Date(selectedEvent.endTime),
        location: selectedEvent.location,
      })
      setShowQuickView(false)
      setShowEventForm(true)
    } else if (recurringAction === 'delete') {
      setEventToDelete(selectedEvent.id)
      setShowDeleteDialog(true)
    }
  }, [selectedEvent, recurringAction])

  const handleRecurringAllInstances = useCallback(async () => {
    if (!selectedEvent) return

    setShowRecurringActionDialog(false)

    if (recurringAction === 'delete') {
      try {
        const result = await deleteEventSeries(selectedEvent.id)
        if ('error' in result) {
          toast.error(result.error)
        } else {
          toast.success(t('calendar.allEventInstancesDeleted'))
          setShowQuickView(false)
          setSelectedEvent(null)
          loadedRangesRef.current.clear()
          allCachedEventsRef.current = []
          loadEvents(currentDate, currentView, true)
        }
      } catch (error) {
        toast.error(t('calendar.failedToDeleteEventSeries'))
        console.error(error)
      }
    }
  }, [selectedEvent, recurringAction, currentDate, currentView, loadEvents, t])

  const confirmDelete = useCallback(async () => {
    if (!eventToDelete) return

    try {
      const result = await deleteEvent(eventToDelete)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success(t('calendar.eventDeleted'))
        setShowQuickView(false)
        setShowDeleteDialog(false)
        setEventToDelete(null)
        setSelectedEvent(null)
        loadedRangesRef.current.clear()
        allCachedEventsRef.current = []
        loadEvents(currentDate, currentView, true)
      }
    } catch (error) {
      toast.error(t('calendar.failedToDeleteEvent'))
      console.error(error)
    }
  }, [eventToDelete, currentDate, currentView, loadEvents, t])

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('calendar.title')}</h2>
          <p className="text-muted-foreground">
            {t('calendar.description')}
          </p>
        </div>
        <Button onClick={() => {
          setFormDefaultValues(null)
          setShowEventForm(true)
        }}>
          <Plus className="me-2 h-4 w-4" />
          {t('calendar.newEvent')}
        </Button>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-hidden">
        <EventCalendar
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onNavigate={handleCalendarNavigate}
          onViewChange={handleCalendarViewChange}
          defaultView={currentView}
        />
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

      {/* Event Quick View */}
      <EventQuickView
        event={selectedEvent}
        open={showQuickView}
        onOpenChange={setShowQuickView}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        isLoadingDetails={isLoadingDetails}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('calendar.deleteEvent')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('calendar.deleteEventConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false)
              setEventToDelete(null)
            }}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recurring Event Action Dialog */}
      <AlertDialog open={showRecurringActionDialog} onOpenChange={setShowRecurringActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {recurringAction === 'edit' ? t('calendar.editRecurringEvent') : t('calendar.deleteRecurringEvent')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('calendar.recurringEventActionPrompt', { action: recurringAction === 'edit' ? t('common.edit').toLowerCase() : t('common.delete').toLowerCase() })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
            <AlertDialogCancel onClick={() => {
              setShowRecurringActionDialog(false)
              setRecurringAction(null)
            }}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRecurringThisOnly} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              {t('calendar.thisEventOnly')}
            </AlertDialogAction>
            <AlertDialogAction onClick={handleRecurringAllInstances}>
              {t('calendar.allEventsInSeries')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

