'use client'

import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { useEffect, useState } from 'react'
import { getEvent } from '@/app/actions/events'

export default function CalendarEventsLayout({ children }: { children: ReactNode }) {
  const params = useParams()
  const eventId = params?.eventId as string | undefined
  const [eventTitle, setEventTitle] = useState<string>('Event')

  useEffect(() => {
    if (eventId) {
      getEvent(eventId).then((result) => {
        if ('event' in result) {
          setEventTitle(result.event.title)
        }
      })
    }
  }, [eventId])

  const breadcrumbs = eventId
    ? [
        { label: 'Calendar', href: '/dashboard/calendar' },
        { label: eventTitle },
      ]
    : [{ label: 'Calendar', href: '/dashboard/calendar' }]

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex-1 overflow-auto bg-background p-6">
        {children}
      </div>
    </>
  )
}
