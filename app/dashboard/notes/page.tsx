'use client'

import React, { useEffect, useState } from 'react'
import { PageCard } from '@/components/ui/page-card'
import { NotesList } from '@/components/notes/notes-list'
import { createClient } from '@/lib/supabase/client'
import { StickyNote } from 'lucide-react'

export default function NotesPage() {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()
  const [toolbarContent, setToolbarContent] = useState<React.ReactNode>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // In a real app, you'd fetch the actual user ID from your database
        // For now, we'll use the auth user ID as a placeholder
        setCurrentUserId(user.id)
      }
    }

    loadUser()
  }, [])

  return (
    <PageCard
      title="Notes"
      description="Create and manage notes with rich text formatting, privacy controls, and entity linking"
      toolbar={toolbarContent}
    >
      <NotesList
        currentUserId={currentUserId}
        showFilters={true}
        showCreateButton={true}
        onToolbarRender={setToolbarContent}
      />
    </PageCard>
  )
}
