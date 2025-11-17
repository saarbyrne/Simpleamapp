'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Check, ChevronsUpDown, X, User, Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Entity {
  id: string
  name: string
  subtitle?: string
}

interface EntityMultiSelectProps {
  entities: Entity[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
  placeholder: string
  emptyMessage: string
  entityType: 'player' | 'event'
  isLoading?: boolean
}

export function EntityMultiSelect({
  entities,
  selectedIds,
  onChange,
  placeholder,
  emptyMessage,
  entityType,
  isLoading = false,
}: EntityMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedEntities = entities.filter((entity) =>
    selectedIds.includes(entity.id)
  )

  const handleToggle = (entityId: string) => {
    const newSelectedIds = selectedIds.includes(entityId)
      ? selectedIds.filter((id) => id !== entityId)
      : [...selectedIds, entityId]
    
    onChange(newSelectedIds)
  }

  const handleRemove = (entityId: string) => {
    onChange(selectedIds.filter((id) => id !== entityId))
  }

  const Icon = entityType === 'player' ? User : Calendar

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            disabled={isLoading}
          >
            <span className="truncate text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : selectedIds.length > 0 ? (
                `${selectedIds.length} selected`
              ) : (
                placeholder
              )}
            </span>
            <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${entityType}...`} />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {entities.map((entity) => {
                const isSelected = selectedIds.includes(entity.id)
                return (
                  <CommandItem
                    key={entity.id}
                    value={`${entity.name} ${entity.subtitle || ''}`}
                    onSelect={() => handleToggle(entity.id)}
                  >
                    <Check
                      className={cn(
                        'me-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <Icon className="me-2 h-4 w-4 opacity-50" />
                    <div className="flex flex-col">
                      <span>{entity.name}</span>
                      {entity.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {entity.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected entities as badges */}
      {selectedEntities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEntities.map((entity) => (
            <Badge
              key={entity.id}
              variant="secondary"
              className="gap-1 pe-1"
            >
              <Icon className="h-3 w-3" />
              {entity.name}
              <button
                type="button"
                onClick={() => handleRemove(entity.id)}
                className="ms-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

