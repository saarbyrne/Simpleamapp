'use client'

import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useState, useCallback, useMemo, memo } from 'react'
import { useTranslations } from 'next-intl'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  onViewChange?: (view: View) => void
  defaultView?: View
}

const eventStyleGetter = (event: CalendarEvent) => {
  const typeColors: Record<string, { bg: string; border: string; text: string }> = {
    training: {
      bg: 'bg-primary/20',
      border: 'border-l-4 border-primary',
      text: 'text-foreground'
    },
    match: {
      bg: 'bg-chart-2/20',
      border: 'border-l-4 border-chart-2',
      text: 'text-foreground'
    },
    medical: {
      bg: 'bg-destructive/20',
      border: 'border-l-4 border-destructive',
      text: 'text-foreground'
    },
    meeting: {
      bg: 'bg-accent',
      border: 'border-l-4 border-accent-foreground',
      text: 'text-accent-foreground'
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

// Memoized toolbar component
const Toolbar = memo(({ label, onNavigate: navigate, onView, view, t }: any) => (
  <div className="mb-0 flex items-center justify-between border-b bg-card p-4 rounded-t-lg">
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
        {t('calendar.today')}
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
        {t('calendar.month')}
      </Button>
      <Button
        variant={view === 'week' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onView('week')}
      >
        {t('calendar.week')}
      </Button>
      <Button
        variant={view === 'day' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onView('day')}
      >
        {t('calendar.day')}
      </Button>
    </div>
  </div>
))
Toolbar.displayName = 'Toolbar'

export function EventCalendar({
  events,
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  onViewChange,
  defaultView = 'month'
}: EventCalendarProps) {
  const t = useTranslations()
  const [view, setView] = useState<View>(defaultView)
  const [date, setDate] = useState(new Date())

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate)
    onNavigate?.(newDate)
  }, [onNavigate])

  const handleViewChange = useCallback((newView: View) => {
    setView(newView)
    onViewChange?.(newView)
  }, [onViewChange])

  // Memoize event style getter
  const memoizedEventStyleGetter = useCallback((event: CalendarEvent) => {
    return eventStyleGetter(event)
  }, [])

  const { components, formats } = useMemo(() => {
    return {
      components: {
        toolbar: (props: any) => <Toolbar {...props} view={view} t={t} />,
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
  }, [view, t])

  return (
    <Card className="h-full w-full p-0 overflow-hidden">
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
          height: 100%;
          background-color: var(--card);
        }

        .rbc-header {
          padding: 8px 4px;
          font-weight: 600;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border);
          background-color: var(--card);
        }

        .rbc-day-bg {
          background-color: var(--card) !important;
        }

        .rbc-day-slot {
          background-color: var(--card) !important;
        }

        .rbc-time-slot {
          border-top: 1px solid var(--border);
          background-color: var(--card) !important;
        }

        .rbc-month-row {
          background-color: var(--card) !important;
        }

        .rbc-month-row .rbc-day-bg {
          background-color: var(--card) !important;
        }

        .rbc-today {
          background-color: color-mix(in oklch, var(--accent) 10%, transparent) !important;
        }

        .rbc-today .rbc-day-bg {
          background-color: color-mix(in oklch, var(--accent) 10%, transparent) !important;
        }

        .rbc-off-range-bg {
          background: color-mix(in oklch, var(--muted) 20%, transparent) !important;
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
          background-color: color-mix(in oklch, var(--muted) 50%, transparent) !important;
        }

        .rbc-time-header-content {
          border-left: 1px solid var(--border);
        }

        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid var(--border);
        }

        .rbc-time-content {
          border-top: 1px solid var(--border);
        }

        .rbc-current-time-indicator {
          background-color: var(--primary);
          height: 2px;
        }

        .rbc-agenda-view {
          border: none;
          border-radius: 0;
          background-color: var(--card);
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
          border-right: 1px solid var(--border);
        }

        .rbc-timeslot-group {
          border-left: 1px solid var(--border);
        }

        .rbc-month-view,
        .rbc-time-view {
          border: none;
          border-radius: 0;
          overflow: hidden;
          background-color: var(--card);
        }

        .rbc-header + .rbc-header {
          border-left: 1px solid var(--border);
        }

        .rbc-month-row + .rbc-month-row {
          border-top: 1px solid var(--border);
        }

        .rbc-toolbar {
          background-color: var(--card);
          border-bottom: 1px solid var(--border);
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
        eventPropGetter={memoizedEventStyleGetter}
        components={components}
        formats={formats}
        step={30}
        timeslots={2}
        defaultView={defaultView}
      />
    </Card>
  )
}
