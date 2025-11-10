'use client'

import { useState, useCallback } from 'react'
import { createTextColumn } from 'react-datasheet-grid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Person {
  id: string
  name: string
  role?: string
  photo?: string
}

interface PersonCellProps {
  persons: Person[]
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
}

export function PersonCell({ persons, value, onChange, disabled }: PersonCellProps) {
  const [open, setOpen] = useState(false)

  const selectedPerson = persons.find(p => p.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-full w-full justify-between font-normal px-2 hover:bg-transparent"
          disabled={disabled}
        >
          {selectedPerson ? (
            <span className="truncate">{selectedPerson.name}</span>
          ) : (
            <span className="text-muted-foreground">Select...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search person..." />
          <CommandEmpty>No person found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {persons.map((person) => (
              <CommandItem
                key={person.id}
                value={person.name}
                onSelect={() => {
                  onChange(person.id === value ? null : person.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === person.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="flex flex-col">
                  <span>{person.name}</span>
                  {person.role && (
                    <span className="text-xs text-muted-foreground">{person.role}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Create a custom column for react-datasheet-grid
export function createPersonColumn(persons: Person[]) {
  return createTextColumn({
    placeholder: 'Select person...',
  })
}
