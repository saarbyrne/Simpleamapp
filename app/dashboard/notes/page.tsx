'use client'

import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react'
import { PageCard } from '@/components/ui/page-card'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CardListSkeleton } from '@/components/ui/skeleton-wrappers'

// Lazy load the NotesList component
const NotesList = lazy(() =>
  import('@/components/notes').then(module => ({ default: module.NotesList }))
)

export default function NotesPage() {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()
  const [toolbarContent, setToolbarContent] = useState<React.ReactNode>(null)
  const [onCreateNote, setOnCreateNote] = useState<(() => void) | null>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setCurrentUserId(user.id)
      }
    }

    loadUser()
  }, [])

  const handleCreateNoteCallback = useCallback((callback: () => void) => {
    setOnCreateNote(() => callback)
  }, [])

  return (
    <PageCard
      variant="table"
      title="Notes"
      description="Create and manage notes with rich text formatting, privacy controls, and entity linking"
      headerActions={
        onCreateNote ? (
          <Button onClick={onCreateNote}>
            <Plus className="me-2 h-4 w-4" />
            Add Note
          </Button>
        ) : null
      }
      toolbar={toolbarContent}
    >
      <Suspense fallback={<CardListSkeleton count={3} showFilters={true} />}>
        <NotesList
          currentUserId={currentUserId}
          showFilters={true}
          showCreateButton={false}
          onToolbarRender={setToolbarContent}
          onCreateNoteCallback={handleCreateNoteCallback}
        />
      </Suspense>
    </PageCard>
  )
}
