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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

export type BulkFieldType = 'select' | 'text' | 'multi-select'

export interface BulkFieldOption {
  value: string
  label: string | ReactNode
  description?: string
}

export interface BulkField {
  id: string
  type: BulkFieldType
  placeholder: string
  options?: BulkFieldOption[]
  width?: string
  allowClear?: boolean // Whether the field can be cleared (default: true)
}

export interface BulkActionsBarProps {
  selectedCount: number
  fields: BulkField[]
  onSave: (values: Record<string, string | string[] | null>) => Promise<void>
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
  const [values, setValues] = useState<Record<string, string | string[]>>({})
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
    const changed = Object.values(values).some((val) =>
      Array.isArray(val) ? val.length > 0 : val !== ''
    )
    setHasChanges(changed)
  }, [values])

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: Array.isArray(value)
        ? value
        : value === '__clear__'
          ? ''
          : value,
    }))
  }

  const handleSave = async () => {
    const updates: Record<string, string | string[] | null> = {}
    
    fields.forEach((field) => {
      const value = values[field.id]
      if (Array.isArray(value)) {
        if (value.length > 0) {
          updates[field.id] = value
        }
      } else if (value !== undefined && value !== '') {
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
          const storedValue = values[field.id]
          const fieldValue = typeof storedValue === 'string' ? storedValue : ''
          const multiValue = Array.isArray(storedValue) ? storedValue : []
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
                  {field.allowClear !== false && (
                    <SelectItem value="__clear__">Clear</SelectItem>
                  )}
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }

          if (field.type === 'multi-select' && field.options) {
            const selectedLabels = field.options
              .filter((option) => multiValue.includes(option.value))
              .map((option) =>
                typeof option.label === 'string' ? option.label : option.value
              )
            const displayLabel = selectedLabels.length > 0
              ? `${selectedLabels.slice(0, 2).join(', ')}` +
                (selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : '')
              : field.placeholder

            return (
              <Popover key={field.id}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn('h-10 justify-between gap-2', width)}
                  >
                    <span className="truncate text-left">
                      {displayLabel}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] p-3">
                  <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
                    {field.options.map((option) => {
                      const isChecked = multiValue.includes(option.value)
                      return (
                        <label
                          key={option.value}
                          className="flex items-start gap-3 rounded-md border border-border/60 p-2 text-sm"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const nextValues = checked
                                ? [...multiValue, option.value]
                                : multiValue.filter((val) => val !== option.value)
                              handleFieldChange(field.id, nextValues)
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <span className="font-medium">{option.label}</span>
                            {option.description && (
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            )}
                          </div>
                        </label>
                      )
                    })}
                    {field.allowClear !== false && multiValue.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFieldChange(field.id, [])}
                      >
                        Clear Selection
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
        {selectedCount} {selectedCount === 1 ? itemLabel : `${itemLabel}s`} selected
      </span>
    </div>
  )
}
