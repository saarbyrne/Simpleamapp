import { Suspense } from 'react'
import { getCachedSupabaseUser } from '@/lib/auth/cached-user'
import { NotesPageClient } from './_components/notes-page-client'
import { CardListSkeleton } from '@/components/ui/skeleton-wrappers'

export const revalidate = 300

/**
 * Notes page - Server component shell
 *
 * Fetches the current user ID server-side (no client-side Supabase call),
 * then delegates to the client component for interactive UI.
 */
export default async function NotesPage() {
  const user = await getCachedSupabaseUser()

  return (
    <Suspense fallback={<CardListSkeleton count={3} showFilters={true} />}>
      <NotesPageClient currentUserId={user?.id} />
    </Suspense>
  )
}
