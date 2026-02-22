'use client'

import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useState, useCallback, useMemo, memo } from 'react'
import { useTranslations } from 'next-intl'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-overrides.css'
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
