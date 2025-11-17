'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NoteCard } from './note-card'
import { NoteEditorDialog } from './note-editor-dialog'
import { getNotes, deleteNote, getNoteTags, NoteWithAuthor } from '@/app/actions/notes'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableFilters, type FilterConfig } from '@/components/data-table'

interface NotesListProps {
  linkedPersonId?: string
  linkedEventId?: string
  currentUserId?: string
  showFilters?: boolean
  showCreateButton?: boolean
  onToolbarRender?: (toolbar: React.ReactNode) => void
}

export function NotesList({
  linkedPersonId,
  linkedEventId,
  currentUserId,
  showFilters = true,
  showCreateButton = true,
  onToolbarRender,
}: NotesListProps) {
  const [notes, setNotes] = useState<NoteWithAuthor[]>([])
  const [filteredNotes, setFilteredNotes] = useState<NoteWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteWithAuthor | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [privacyLevelFilter, setPrivacyLevelFilter] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const hasActiveFilters = searchQuery || privacyLevelFilter !== 'all' || selectedTags.length > 0

  // Optimized filter configuration
  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: 'search',
        label: 'Search',
        type: 'search',
        placeholder: 'Search notes...',
      },
      {
        key: 'privacyLevel',
        label: 'Privacy Level',
        type: 'select',
        options: [
          { value: 'all', label: 'All I can see' },
          { value: 'public', label: 'Public only' },
          { value: 'medical', label: 'Medical only' },
          { value: 'mental_health', label: 'Mental Health only' },
          { value: 'coaches', label: 'Coaches only' },
          { value: 'my_private', label: 'My private notes' },
        ],
        placeholder: 'All privacy levels',
      },
    ],
    []
  )

  const filterValues = useMemo(
    () => ({
      search: searchQuery,
      privacyLevel: privacyLevelFilter,
    }),
    [searchQuery, privacyLevelFilter]
  )

  // Load notes on mount and when linked entities change
  useEffect(() => {
    loadNotes()
    loadTags()
  }, [linkedPersonId, linkedEventId])

  // Apply filters when notes or filter state changes
  useEffect(() => {
    applyFilters()
  }, [notes, searchQuery, privacyLevelFilter, selectedTags, currentUserId])

  const loadNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getNotes({
        linkedPersonId,
        linkedEventId,
      })

      if (result.success && result.notes) {
        setNotes(result.notes)
      } else {
        toast.error(result.error || 'Failed to load notes')
      }
    } catch (error) {
      toast.error('Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }, [linkedPersonId, linkedEventId])

  const loadTags = useCallback(async () => {
    const result = await getNoteTags()
    if (result.success && result.tags) {
      setAvailableTags(result.tags)
    }
  }, [])

  const applyFilters = useCallback(() => {
    let filtered = [...notes]

    // Apply search filter with optimized performance
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((note) => {
        const titleMatch = note.title?.toLowerCase().includes(query)
        const contentMatch = JSON.stringify(note.content).toLowerCase().includes(query)
        const tagsMatch = note.tags.some((tag) => tag.toLowerCase().includes(query))
        const authorMatch = note.author.name.toLowerCase().includes(query)
        return titleMatch || contentMatch || tagsMatch || authorMatch
      })
    }

    // Apply privacyLevel filter
    if (privacyLevelFilter !== 'all') {
      if (privacyLevelFilter === 'my_private') {
        filtered = filtered.filter(
          (note) => note.privacyLevel === 'private' && note.author.id === currentUserId
        )
      } else {
        filtered = filtered.filter((note) => note.privacyLevel === privacyLevelFilter)
      }
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.some((tag) => note.tags.includes(tag))
      )
    }

    setFilteredNotes(filtered)
  }, [notes, searchQuery, privacyLevelFilter, selectedTags, currentUserId])

  const handleCreateNote = useCallback(() => {
    setEditingNote(null)
    setIsEditorOpen(true)
  }, [])

  const handleEditNote = useCallback((note: NoteWithAuthor) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }, [])

  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      const result = await deleteNote(noteId)
      if (result.success) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId))
        toast.success('Note deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete note')
      }
    } catch (error) {
      toast.error('Failed to delete note')
    }
    setNoteToDelete(null)
  }, [])

  const confirmDelete = useCallback(() => {
    if (noteToDelete) {
      handleDeleteNote(noteToDelete)
    }
  }, [noteToDelete, handleDeleteNote])

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setPrivacyLevelFilter('all')
    setSelectedTags([])
  }, [])

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') setSearchQuery(value)
    else if (key === 'privacyLevel') setPrivacyLevelFilter(value)
  }, [])

  // Create toolbar content for parent component
  const toolbarContent = useMemo(() => {
    if (!showFilters) return null

    return (
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
        <DataTableFilters
          filters={filterConfig}
          values={filterValues}
          onFilterChange={handleFilterChange}
        />
      </div>
    )
  }, [showFilters, filterConfig, filterValues, handleFilterChange])

  // Pass toolbar to parent component
  useEffect(() => {
    if (onToolbarRender) {
      onToolbarRender(toolbarContent)
    }
  }, [onToolbarRender, toolbarContent])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tag filters - only show if there are tags available */}
      {showFilters && availableTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Filter by tags</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear all filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleToggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Selected:</span>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => handleToggleTag(tag)}
                    className="ms-1 rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header with count and create button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Notes {filteredNotes.length > 0 && `(${filteredNotes.length})`}
          </h2>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredNotes.length} of {notes.length} notes
            </p>
          )}
        </div>
        {showCreateButton && (
          <Button onClick={handleCreateNote}>
            <Plus className="me-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>

      {/* Notes list or empty state */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? 'No notes match your filters'
                : 'No notes yet. Use the Add Note button above to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              currentUserId={currentUserId}
              onEdit={handleEditNote}
              onDelete={(id) => setNoteToDelete(id)}
              showLinkedEntities={!linkedPersonId && !linkedEventId}
            />
          ))}
        </div>
      )}

      {/* Note editor dialog */}
      <NoteEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        existingNote={editingNote}
        linkedPersonId={linkedPersonId}
        linkedEventId={linkedEventId}
        onSuccess={loadNotes}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
