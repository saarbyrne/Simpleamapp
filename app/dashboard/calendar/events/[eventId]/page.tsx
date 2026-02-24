import { redirect } from 'next/navigation'
import { getCachedSupabaseUser } from '@/lib/auth/cached-user'
import { getEvent } from '@/app/actions/events'
import { EventDetailClient } from './_components/event-detail-client'

export const revalidate = 300

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>
}

/**
 * Event detail page - Server component shell
 *
 * Fetches event data and user ID server-side, eliminating
 * client-side useEffect data fetching and Supabase auth calls.
 */
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params
  const [user, eventResult] = await Promise.all([
    getCachedSupabaseUser(),
    getEvent(eventId),
  ])

  if ('error' in eventResult) {
    redirect('/dashboard/calendar')
  }

  return (
    <EventDetailClient
      event={eventResult.event}
      eventId={eventId}
      currentUserId={user?.id}
    />
  )
}
