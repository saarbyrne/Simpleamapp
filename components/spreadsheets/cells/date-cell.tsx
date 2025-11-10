'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface DateCellProps {
  value: Date | string | null
  onChange: (value: Date | null) => void
  disabled?: boolean
}

export function DateCell({ value, onChange, disabled }: DateCellProps) {
  const [open, setOpen] = useState(false)

  const dateValue = value ? (value instanceof Date ? value : new Date(value)) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-full w-full justify-start text-left font-normal px-2 hover:bg-transparent',
            !dateValue && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue || undefined}
          onSelect={(date) => {
            onChange(date || null)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
