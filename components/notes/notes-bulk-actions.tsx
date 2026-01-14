'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Save, X, Trash2 } from 'lucide-react'
import { NotePrivacyLevel } from '@/app/actions/notes'
import { cn } from '@/lib/utils'

interface NotesBulkActionsProps {
  selectedCount: number
  onUpdate: (updates: { privacyLevel?: NotePrivacyLevel; tags?: string[] }) => Promise<void>
  onDelete: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function NotesBulkActions({
  selectedCount,
  onUpdate,
  onDelete,
  onCancel,
  isLoading = false,
}: NotesBulkActionsProps) {
  const [privacyLevel, setPrivacyLevel] = useState<string>('')
  const [tagInput, setTagInput] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes
  useEffect(() => {
    const changed = privacyLevel !== '' || tagInput !== ''
    setHasChanges(changed)
  }, [privacyLevel, tagInput])

  // Reset when selection changes
  useEffect(() => {
    if (selectedCount === 0) {
      setPrivacyLevel('')
      setTagInput('')
      setHasChanges(false)
    }
  }, [selectedCount])

  const handleSave = async () => {
    const updates: { privacyLevel?: NotePrivacyLevel; tags?: string[] } = {}
    
    if (privacyLevel && privacyLevel !== '__clear__') {
      updates.privacyLevel = privacyLevel as NotePrivacyLevel
    }

    if (tagInput.trim()) {
      // Split by comma and clean up
      updates.tags = tagInput.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    if (Object.keys(updates).length > 0) {
      await onUpdate(updates)
      setPrivacyLevel('')
      setTagInput('')
      setHasChanges(false)
    }
  }

  const handleClear = () => {
    setPrivacyLevel('')
    setTagInput('')
    setHasChanges(false)
    onCancel()
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 px-0 py-3 bg-muted/50 border-b">
      {/* Inputs Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={privacyLevel || undefined}
          onValueChange={setPrivacyLevel}
        >
          <SelectTrigger className="h-10 w-[140px] shrink-0">
            <SelectValue placeholder="Privacy Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__clear__">Clear</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="mental_health">Mental Health</SelectItem>
            <SelectItem value="coaches">Coaches</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tags (comma separated)"
          className="h-10 w-[220px] shrink-0"
        />

        {/* Actions */}
        <div className="flex items-center gap-2 ms-auto">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="h-10"
          >
            <Save className="h-4 w-4 me-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
            className="h-10"
          >
            <Trash2 className="h-4 w-4 me-2" />
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isLoading}
            className="h-10"
          >
            <X className="h-4 w-4 me-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Selected Count */}
      <span className="text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? 'note' : 'notes'} selected
      </span>
    </div>
  )
}

