'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { NoteCard } from './note-card'
import { NoteEditorDialog } from './note-editor-dialog'
import { NotesBulkActions } from './notes-bulk-actions'
import { getNotes, deleteNote, getNoteTags, NoteWithAuthor, bulkUpdateNotes, bulkDeleteNotes } from '@/app/actions/notes'
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
import { useVirtualizer } from '@tanstack/react-virtual'

interface NotesListProps {
  linkedPersonId?: string
  linkedEventId?: string
  currentUserId?: string
  showFilters?: boolean
  showCreateButton?: boolean
  onToolbarRender?: (toolbar: React.ReactNode) => void
  onCreateNoteCallback?: (callback: () => void) => void
}

export function NotesList({
  linkedPersonId,
  linkedEventId,
  currentUserId,
  showFilters = true,
  showCreateButton = true,
  onToolbarRender,
  onCreateNoteCallback,
}: NotesListProps) {
  const [notes, setNotes] = useState<NoteWithAuthor[]>([])
  const [filteredNotes, setFilteredNotes] = useState<NoteWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteWithAuthor | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [privacyLevelFilter, setPrivacyLevelFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const hasActiveFilters = searchQuery || privacyLevelFilter !== 'all' || selectedTags.length > 0 || dateFrom !== undefined || dateTo !== undefined

  // Virtualization setup
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: filteredNotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated height of each note card (adjust as needed)
    overscan: 5, // Render 5 extra items above/below viewport
  })

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
        label: 'Privacy',
        type: 'select',
        options: [
          { value: 'all', label: 'All' },
          { value: 'public', label: 'Public' },
          { value: 'medical', label: 'Medical' },
          { value: 'mental_health', label: 'Mental Health' },
          { value: 'coaches', label: 'Coaches' },
          { value: 'my_private', label: 'My Private' },
        ],
        placeholder: 'All',
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        type: 'dateRange',
        placeholder: 'Select date range',
      },
    ],
    []
  )

  const filterValues = useMemo(
    () => ({
      search: searchQuery,
      privacyLevel: privacyLevelFilter,
      dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
    }),
    [searchQuery, privacyLevelFilter, dateFrom, dateTo]
  )

  // Load notes on mount and when linked entities change
  useEffect(() => {
    loadNotes()
    loadTags()
  }, [linkedPersonId, linkedEventId])

  // Apply filters when notes or filter state changes
  useEffect(() => {
    applyFilters()
  }, [notes, searchQuery, privacyLevelFilter, selectedTags, currentUserId, dateFrom, dateTo])

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

    // Apply date range filter
    if (dateFrom || dateTo) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.createdAt)
        if (dateFrom && dateTo) {
          return noteDate >= dateFrom && noteDate <= dateTo
        } else if (dateFrom) {
          return noteDate >= dateFrom
        } else if (dateTo) {
          return noteDate <= dateTo
        }
        return true
      })
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.some((tag) => note.tags.includes(tag))
      )
    }

    setFilteredNotes(filtered)
  }, [notes, searchQuery, privacyLevelFilter, selectedTags, currentUserId, dateFrom, dateTo])

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

  const handleToggleSelectNote = useCallback((noteId: string) => {
    setSelectedNotes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(noteId)) {
        newSet.delete(noteId)
      } else {
        newSet.add(noteId)
      }
      return newSet
    })
  }, [])

  const handleToggleSelectAll = useCallback(() => {
    if (selectedNotes.size === filteredNotes.length) {
      setSelectedNotes(new Set())
    } else {
      setSelectedNotes(new Set(filteredNotes.map((note) => note.id)))
    }
  }, [selectedNotes.size, filteredNotes])

  const handleBulkUpdate = useCallback(async (updates: any) => {
    setIsBulkUpdating(true)
    try {
      const result = await bulkUpdateNotes(Array.from(selectedNotes), updates)
      if (result.success) {
        toast.success(result.message || 'Notes updated successfully')
        await loadNotes()
        setSelectedNotes(new Set())
      } else {
        toast.error(result.error || 'Failed to update notes')
      }
    } catch (error) {
      toast.error('Failed to update notes')
    } finally {
      setIsBulkUpdating(false)
    }
  }, [selectedNotes, loadNotes])

  const handleBulkDelete = useCallback(async () => {
    setIsBulkUpdating(true)
    try {
      const result = await bulkDeleteNotes(Array.from(selectedNotes))
      if (result.success) {
        toast.success(result.message || 'Notes deleted successfully')
        await loadNotes()
        setSelectedNotes(new Set())
      } else {
        toast.error(result.error || 'Failed to delete notes')
      }
    } catch (error) {
      toast.error('Failed to delete notes')
    } finally {
      setIsBulkUpdating(false)
    }
  }, [selectedNotes, loadNotes])

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setPrivacyLevelFilter('all')
    setDateFrom(undefined)
    setDateTo(undefined)
    setSelectedTags([])
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    if (key === 'search') setSearchQuery(value)
    else if (key === 'privacyLevel') setPrivacyLevelFilter(value)
    else if (key === 'dateRange') {
      if (value?.from) {
        setDateFrom(value.from)
        setDateTo(value.to) // Can be undefined for single date
      } else {
        setDateFrom(undefined)
        setDateTo(undefined)
      }
    }
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
    if (onToolbarRender && toolbarContent) {
      onToolbarRender(toolbarContent)
    }
  }, [onToolbarRender, toolbarContent])

  // Pass create note callback to parent
  useEffect(() => {
    if (onCreateNoteCallback) {
      onCreateNoteCallback(handleCreateNote)
    }
  }, [onCreateNoteCallback, handleCreateNote])

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
      {/* Bulk Actions Bar */}
      {selectedNotes.size > 0 && (
        <NotesBulkActions
          selectedCount={selectedNotes.size}
          onUpdate={handleBulkUpdate}
          onDelete={handleBulkDelete}
          onCancel={() => setSelectedNotes(new Set())}
          isLoading={isBulkUpdating}
        />
      )}

      {/* Header with count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
        </div>
      )}

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
          {/* Select all checkbox aligned with note checkboxes */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedNotes.size === filteredNotes.length && filteredNotes.length > 0}
              onCheckedChange={handleToggleSelectAll}
              aria-label="Select all notes"
              className="mt-0"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-muted-foreground">Select all</span>
            </div>
          </div>

          {/* Virtualized notes list */}
          <div
            ref={parentRef}
            className="h-[600px] overflow-auto"
            style={{
              contain: 'strict', // CSS containment for better performance
            }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const note = filteredNotes[virtualRow.index]
                return (
                  <div
                    key={note.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedNotes.has(note.id)}
                        onCheckedChange={() => handleToggleSelectNote(note.id)}
                        aria-label={`Select note ${note.title || 'Untitled'}`}
                        className="mt-6"
                      />
                      <div className="flex-1">
                        <NoteCard
                          note={note}
                          currentUserId={currentUserId}
                          onEdit={handleEditNote}
                          onDelete={(id) => setNoteToDelete(id)}
                          showLinkedEntities={!linkedPersonId && !linkedEventId}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
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