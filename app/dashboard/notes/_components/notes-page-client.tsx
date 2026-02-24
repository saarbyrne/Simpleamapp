'use client'

import React, { useState, useCallback } from 'react'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { NotesList } from '@/components/notes'

interface NotesPageClientProps {
  currentUserId?: string
}

export function NotesPageClient({ currentUserId }: NotesPageClientProps) {
  const [toolbarContent, setToolbarContent] = useState<React.ReactNode>(null)
  const [onCreateNote, setOnCreateNote] = useState<(() => void) | null>(null)

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
      <NotesList
        currentUserId={currentUserId}
        showFilters={true}
        showCreateButton={false}
        onToolbarRender={setToolbarContent}
        onCreateNoteCallback={handleCreateNoteCallback}
      />
    </PageCard>
  )
}
