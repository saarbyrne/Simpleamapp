'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from './rich-text-editor-lazy'
import { 
  createNote, 
  updateNote, 
  NotePrivacyLevel, 
  NoteWithAuthor,
  getPlayersForPicker,
  getEventsForPicker,
  createNoteLinks,
} from '@/app/actions/notes'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { EntityMultiSelect, type Entity } from './entity-multi-select'
import { format } from 'date-fns'

interface NoteEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingNote?: NoteWithAuthor | null
  linkedPersonId?: string
  linkedEventId?: string
  onSuccess?: () => void
}

const visibilityOptions = [
  { value: 'public', label: 'Public', description: 'Visible to everyone in organization' },
  { value: 'medical', label: 'Medical', description: 'Only visible to medical staff' },
  {
    value: 'mental_health',
    label: 'Mental Health',
    description: 'Only visible to mental health staff',
  },
  { value: 'coaches', label: 'Coaches', description: 'Only visible to coaches' },
  { value: 'private', label: 'Private', description: 'Only visible to you' },
]

export function NoteEditorDialog({
  open,
  onOpenChange,
  existingNote,
  linkedPersonId,
  linkedEventId,
  onSuccess,
}: NoteEditorDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<any>(null)
  const [privacyLevel, setPrivacyLevel] = useState<NotePrivacyLevel>('public')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Entity linking state
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  const [availablePlayers, setAvailablePlayers] = useState<Entity[]>([])
  const [availableEvents, setAvailableEvents] = useState<Entity[]>([])
  const [isLoadingEntities, setIsLoadingEntities] = useState(false)

  // Load entities when dialog opens
  useEffect(() => {
    if (open) {
      loadEntities()
    }
  }, [open])

  const loadEntities = async () => {
    setIsLoadingEntities(true)
    try {
      const [playersResult, eventsResult] = await Promise.all([
        getPlayersForPicker(),
        getEventsForPicker(),
      ])

      if (playersResult.success && playersResult.players) {
        setAvailablePlayers(
          playersResult.players.map((p) => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            subtitle: p.position && p.jerseyNumber
              ? `#${p.jerseyNumber} ${p.position}`
              : p.position || p.jerseyNumber
              ? `${p.jerseyNumber || ''}${p.position || ''}`
              : undefined,
          }))
        )
      }

      if (eventsResult.success && eventsResult.events) {
        setAvailableEvents(
          eventsResult.events.map((e) => ({
            id: e.id,
            name: e.title,
            subtitle: `${e.type} - ${format(new Date(e.startTime), 'PPp')}`,
          }))
        )
      }
    } catch (error) {
      console.error('Error loading entities:', error)
      toast.error('Failed to load players and events')
    } finally {
      setIsLoadingEntities(false)
    }
  }

  // Initialize form when dialog opens or note changes
  useEffect(() => {
    if (open) {
      if (existingNote) {
        setTitle(existingNote.title || '')
        setContent(existingNote.content)
        setPrivacyLevel(existingNote.privacyLevel as NotePrivacyLevel)
        setTags(existingNote.tags || [])
        
        // Load entity links from existing note
        if (existingNote.links && existingNote.links.length > 0) {
          const playerIds = existingNote.links
            .filter((link) => link.targetType === 'person')
            .map((link) => link.targetId)
          const eventIds = existingNote.links
            .filter((link) => link.targetType === 'event')
            .map((link) => link.targetId)
          
          setSelectedPlayerIds(playerIds)
          setSelectedEventIds(eventIds)
        } else {
          // Fallback to legacy fields for backward compatibility
          setSelectedPlayerIds(existingNote.linkedPersonId ? [existingNote.linkedPersonId] : [])
          setSelectedEventIds(existingNote.linkedEventId ? [existingNote.linkedEventId] : [])
        }
      } else {
        setTitle('')
        setContent({
          type: 'doc',
          content: [{ type: 'paragraph' }],
        })
        setPrivacyLevel('public')
        setTags([])
        
        // Pre-fill from props if provided
        setSelectedPlayerIds(linkedPersonId ? [linkedPersonId] : [])
        setSelectedEventIds(linkedEventId ? [linkedEventId] : [])
      }
      setTagInput('')
    }
  }, [open, existingNote, linkedPersonId, linkedEventId])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate content
    if (!content || typeof content !== 'object') {
      console.error('Invalid content:', content)
      toast.error('Content is invalid')
      return
    }

    setIsSubmitting(true)

    try {
      // Ensure content is a plain object - if it's null/undefined, use default
      const serializedContent = content || {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: ''
              }
            ]
          }
        ]
      }

      let result
      if (existingNote) {
        result = await updateNote(existingNote.id, {
          title: title || undefined,
          content: serializedContent,
          privacyLevel,
          tags,
        })
      } else {
        result = await createNote({
          title: title || undefined,
          content: serializedContent,
          privacyLevel,
          tags,
          linkedPersonId,
          linkedEventId,
        })
      }

      if (result.success && result.note) {
        // Create/update entity links
        const links = [
          ...selectedPlayerIds.map((id) => ({ targetType: 'person', targetId: id })),
          ...selectedEventIds.map((id) => ({ targetType: 'event', targetId: id })),
        ]

        if (links.length > 0) {
          const linkResult = await createNoteLinks(result.note.id, links)
          if (!linkResult.success) {
            console.error('Failed to create links:', linkResult.error)
            // Don't fail the whole operation, just log the error
          }
        } else {
          // If no links selected, clear any existing links
          await createNoteLinks(result.note.id, [])
        }

        toast.success(existingNote ? 'Note updated successfully' : 'Note created successfully')
        onOpenChange(false)
        if (onSuccess) {
          onSuccess()
        }
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to save note')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription>
            {existingNote
              ? 'Update your note below'
              : 'Add a new note with rich text formatting'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Enter a title for your note..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your note..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={privacyLevel} onValueChange={(v) => setPrivacyLevel(v as NotePrivacyLevel)}>
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Type a tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ms-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Linked Players Section */}
          <div className="space-y-2">
            <Label>Linked Players</Label>
            <EntityMultiSelect
              entities={availablePlayers}
              selectedIds={selectedPlayerIds}
              onChange={setSelectedPlayerIds}
              placeholder="Select players..."
              emptyMessage="No players found"
              entityType="player"
              isLoading={isLoadingEntities}
            />
          </div>

          {/* Linked Events Section */}
          <div className="space-y-2">
            <Label>Linked Events</Label>
            <EntityMultiSelect
              entities={availableEvents}
              selectedIds={selectedEventIds}
              onChange={setSelectedEventIds}
              placeholder="Select events..."
              emptyMessage="No events found"
              entityType="event"
              isLoading={isLoadingEntities}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : existingNote ? 'Update Note' : 'Create Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
