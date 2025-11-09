'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Save, X } from 'lucide-react'
import { cn } from '@/components/ui/utils'

export type BulkFieldType = 'select' | 'text'

export interface BulkFieldOption {
  value: string
  label: string | ReactNode
}

export interface BulkField {
  id: string
  type: BulkFieldType
  placeholder: string
  options?: BulkFieldOption[]
  width?: string
}

export interface BulkActionsBarProps {
  selectedCount: number
  fields: BulkField[]
  onSave: (values: Record<string, string | null>) => Promise<void>
  onClear?: () => void
  isLoading?: boolean
  itemLabel?: string // e.g., "player", "item", "row"
  className?: string
}

export function BulkActionsBar({
  selectedCount,
  fields,
  onSave,
  onClear,
  isLoading = false,
  itemLabel = 'item',
  className,
}: BulkActionsBarProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Reset values when selection changes
  useEffect(() => {
    if (selectedCount === 0) {
      setValues({})
      setHasChanges(false)
    }
  }, [selectedCount])

  // Track changes
  useEffect(() => {
    const changed = Object.values(values).some((val) => val !== '')
    setHasChanges(changed)
  }, [values])

  const handleFieldChange = (fieldId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value === '__clear__' ? '' : value,
    }))
  }

  const handleSave = async () => {
    const updates: Record<string, string | null> = {}
    
    fields.forEach((field) => {
      const value = values[field.id]
      if (value !== undefined && value !== '') {
        updates[field.id] = value.trim() || null
      }
    })

    if (Object.keys(updates).length > 0) {
      await onSave(updates)
      // Reset after save
      setValues({})
      setHasChanges(false)
    }
  }

  const handleClear = () => {
    setValues({})
    setHasChanges(false)
    onClear?.()
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-3 px-4 py-3 bg-muted/50 border-b', className)}>
      {/* Inputs Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {fields.map((field) => {
          const fieldValue = values[field.id] || ''
          const width = field.width || 'w-[130px]'

          if (field.type === 'select' && field.options) {
            return (
              <Select
                key={field.id}
                value={fieldValue || undefined}
                onValueChange={(val) => handleFieldChange(field.id, val)}
              >
                <SelectTrigger className={cn('h-10 shrink-0', width)}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__">Clear</SelectItem>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }

          if (field.type === 'text') {
            return (
              <Input
                key={field.id}
                value={fieldValue}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={cn('h-10 shrink-0', width)}
              />
            )
          }

          return null
        })}

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="h-10"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isLoading}
            className="h-10"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Selected Count */}
      <span className="text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? itemLabel : `${itemLabel}s`} selected
      </span>
    </div>
  )
}

