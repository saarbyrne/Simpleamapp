'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NoteCard } from './note-card'
import { NoteEditorDialog } from './note-editor-dialog'
import { getNotes, deleteNote, getNoteTags, NoteWithAuthor } from '@/app/actions/notes'
import { Search, Plus, Filter, X } from 'lucide-react'
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

interface NotesListProps {
  linkedPersonId?: string
  linkedEventId?: string
  currentUserId?: string
  showFilters?: boolean
  showCreateButton?: boolean
}

export function NotesList({
  linkedPersonId,
  linkedEventId,
  currentUserId,
  showFilters = true,
  showCreateButton = true,
}: NotesListProps) {
  const router = useRouter()
  const [notes, setNotes] = useState<NoteWithAuthor[]>([])
  const [filteredNotes, setFilteredNotes] = useState<NoteWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteWithAuthor | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    loadNotes()
    loadTags()
  }, [linkedPersonId, linkedEventId])

  useEffect(() => {
    applyFilters()
  }, [notes, searchQuery, visibilityFilter, selectedTags])

  const loadNotes = async () => {
    setIsLoading(true)
    const result = await getNotes({
      linkedPersonId,
      linkedEventId,
    })

    if (result.success && result.notes) {
      setNotes(result.notes)
      setFilteredNotes(result.notes)
    } else {
      toast.error(result.error || 'Failed to load notes')
    }
    setIsLoading(false)
  }

  const loadTags = async () => {
    const result = await getNoteTags()
    if (result.success && result.tags) {
      setAvailableTags(result.tags)
    }
  }

  const applyFilters = () => {
    let filtered = [...notes]

    // Apply search filter
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

    // Apply visibility filter
    if (visibilityFilter !== 'all') {
      if (visibilityFilter === 'my_private') {
        filtered = filtered.filter(
          (note) => note.visibility === 'private' && note.author.id === currentUserId
        )
      } else {
        filtered = filtered.filter((note) => note.visibility === visibilityFilter)
      }
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.some((tag) => note.tags.includes(tag))
      )
    }

    setFilteredNotes(filtered)
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsEditorOpen(true)
  }

  const handleEditNote = (note: NoteWithAuthor) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  const handleDeleteNote = async (noteId: string) => {
    const result = await deleteNote(noteId)
    if (result.success) {
      toast.success('Note deleted successfully')
      loadNotes()
    } else {
      toast.error(result.error || 'Failed to delete note')
    }
    setNoteToDelete(null)
  }

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setVisibilityFilter('all')
    setSelectedTags([])
  }

  const hasActiveFilters = searchQuery || visibilityFilter !== 'all' || selectedTags.length > 0

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
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="ms-auto text-xs"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ps-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All I can see</SelectItem>
                      <SelectItem value="public">Public only</SelectItem>
                      <SelectItem value="medical">Medical only</SelectItem>
                      <SelectItem value="mental_health">Mental Health only</SelectItem>
                      <SelectItem value="coaches">Coaches only</SelectItem>
                      <SelectItem value="my_private">My private notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.length > 0 ? (
                      availableTags.slice(0, 5).map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleToggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags yet</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Selected tags:</span>
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
          </CardContent>
        </Card>
      )}

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

      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? 'No notes match your filters'
                : 'No notes yet. Create your first note to get started.'}
            </p>
            {!hasActiveFilters && showCreateButton && (
              <Button onClick={handleCreateNote} className="mt-4">
                <Plus className="me-2 h-4 w-4" />
                Create Note
              </Button>
            )}
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

      <NoteEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        existingNote={editingNote}
        linkedPersonId={linkedPersonId}
        linkedEventId={linkedEventId}
        onSuccess={loadNotes}
      />

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
              onClick={() => noteToDelete && handleDeleteNote(noteToDelete)}
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
