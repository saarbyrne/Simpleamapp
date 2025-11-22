'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { CalendarEvent } from './event-calendar'
import type { View } from 'react-big-calendar'

// Export the type for consumers
export type { CalendarEvent }

/**
 * Lazy-loaded Event Calendar component
 * Reduces initial bundle size by ~150KB
 * Calendar and its CSS only load when calendar feature is accessed
 */
const EventCalendar = dynamic(() => import('./event-calendar').then(mod => ({ default: mod.EventCalendar })), {
  loading: () => (
    <div className="rounded-lg border">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  ),
  ssr: false // Calendar requires client-side rendering
})

export { EventCalendar }

interface EventCalendarProps {
  events: CalendarEvent[]
  onSelectEvent?: (event: CalendarEvent) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
  onNavigate?: (date: Date) => void
  onViewChange?: (view: View) => void
  defaultDate?: Date
  defaultView?: View
  className?: string
}

export type { EventCalendarProps }
