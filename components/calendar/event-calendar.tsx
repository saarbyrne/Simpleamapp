'use client'

import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useState, useCallback, useMemo } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'training' | 'match' | 'medical' | 'meeting' | 'other'
  location?: string | null
  description?: string | null
}

interface EventCalendarProps {
  events: CalendarEvent[]
  onSelectEvent?: (event: CalendarEvent) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
  onNavigate?: (date: Date) => void
  defaultView?: View
}

const eventStyleGetter = (event: CalendarEvent) => {
  const typeColors: Record<string, { bg: string; border: string; text: string }> = {
    training: {
      bg: 'bg-blue-100 dark:bg-blue-950',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-900 dark:text-blue-100'
    },
    match: {
      bg: 'bg-green-100 dark:bg-green-950',
      border: 'border-l-4 border-green-500',
      text: 'text-green-900 dark:text-green-100'
    },
    medical: {
      bg: 'bg-red-100 dark:bg-red-950',
      border: 'border-l-4 border-red-500',
      text: 'text-red-900 dark:text-red-100'
    },
    meeting: {
      bg: 'bg-purple-100 dark:bg-purple-950',
      border: 'border-l-4 border-purple-500',
      text: 'text-purple-900 dark:text-purple-100'
    },
    other: {
      bg: 'bg-muted',
      border: 'border-l-4 border-muted-foreground',
      text: 'text-foreground'
    }
  }

  const colors = typeColors[event.type] || typeColors.other

  return {
    className: cn(
      colors.bg,
      colors.border,
      colors.text,
      'rounded-md px-2 py-1 text-sm font-medium'
    )
  }
}

export function EventCalendar({
  events,
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  defaultView = 'month'
}: EventCalendarProps) {
  const [view, setView] = useState<View>(defaultView)
  const [date, setDate] = useState(new Date())

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate)
    onNavigate?.(newDate)
  }, [onNavigate])

  const handleViewChange = useCallback((newView: View) => {
    setView(newView)
  }, [])

  const { components, formats } = useMemo(() => {
    return {
      components: {
        toolbar: ({ label, onNavigate: navigate, onView }: any) => (
          <div className="mb-4 flex items-center justify-between rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('PREV')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('TODAY')}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('NEXT')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-xl font-semibold">{label}</h2>

            <div className="flex gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        ),
      },
      formats: {
        timeGutterFormat: (date: Date) => format(date, 'HH:mm'),
        eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
          `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
        agendaTimeFormat: (date: Date) => format(date, 'HH:mm'),
        agendaDateFormat: (date: Date) => format(date, 'MMM dd'),
        dayHeaderFormat: (date: Date) => format(date, 'EEEE MMM dd'),
        dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
          `${format(start, 'MMM dd')} - ${format(end, 'MMM dd')}`,
      }
    }
  }, [view])

  return (
    <div className="h-full w-full">
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
          height: 100%;
        }

        .rbc-header {
          padding: 8px 4px;
          font-weight: 600;
          font-size: 0.875rem;
          border-bottom: 1px solid hsl(var(--border));
          background: hsl(var(--muted) / 0.3);
        }

        .rbc-today {
          background-color: hsl(var(--accent) / 0.1);
        }

        .rbc-off-range-bg {
          background: hsl(var(--muted) / 0.2);
        }

        .rbc-event {
          padding: 2px 5px;
          border-radius: 4px;
          border: none !important;
          outline: none !important;
        }

        .rbc-event:hover {
          opacity: 0.8;
        }

        .rbc-event-label {
          font-size: 0.75rem;
        }

        .rbc-event-content {
          font-size: 0.875rem;
        }

        .rbc-selected {
          background-color: inherit !important;
        }

        .rbc-day-bg:hover {
          background-color: hsl(var(--muted) / 0.5);
        }

        .rbc-time-slot {
          border-top: 1px solid hsl(var(--border));
        }

        .rbc-time-header-content {
          border-left: 1px solid hsl(var(--border));
        }

        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid hsl(var(--border));
        }

        .rbc-time-content {
          border-top: 1px solid hsl(var(--border));
        }

        .rbc-current-time-indicator {
          background-color: hsl(var(--primary));
          height: 2px;
        }

        .rbc-agenda-view {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
        }

        .rbc-agenda-view table {
          border: none;
        }

        .rbc-agenda-date-cell,
        .rbc-agenda-time-cell {
          white-space: normal;
          padding: 8px;
        }

        .rbc-agenda-event-cell {
          padding: 8px;
        }

        .rbc-time-header.rbc-overflowing {
          border-right: 1px solid hsl(var(--border));
        }

        .rbc-timeslot-group {
          border-left: 1px solid hsl(var(--border));
        }

        .rbc-month-view,
        .rbc-time-view {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .rbc-header + .rbc-header {
          border-left: 1px solid hsl(var(--border));
        }

        .rbc-month-row + .rbc-month-row {
          border-top: 1px solid hsl(var(--border));
        }

        .rbc-date-cell {
          padding: 4px;
          text-align: right;
        }

        .rbc-date-cell > a {
          color: inherit;
        }

        .rbc-time-gutter {
          white-space: nowrap;
        }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        popup
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        components={components}
        formats={formats}
        step={30}
        timeslots={2}
        defaultView={defaultView}
      />
    </div>
  )
}
