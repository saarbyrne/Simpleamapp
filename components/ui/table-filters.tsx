'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Search } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/components/ui/utils'

export type FilterType = 'search' | 'select' | 'dateRange'

export interface FilterOption {
  value: string
  label: string
}

export interface TableFilter {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[]
  placeholder?: string
  width?: string
}

export interface TableFiltersProps {
  filters: TableFilter[]
  values: Record<string, any>
  onFilterChange: (key: string, value: any) => void
  searchPlaceholder?: string
  className?: string
}

export function TableFilters({
  filters,
  values,
  onFilterChange,
  searchPlaceholder = 'Search...',
  className,
}: TableFiltersProps) {
  return (
    <div className={cn('flex flex-nowrap items-center gap-2', className)}>
      {filters.map((filter) => {
        if (filter.type === 'search') {
          return (
            <div key={filter.key} className="relative w-[240px] flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10 bg-background">
              <Search className="h-4 w-4 text-muted-foreground me-2 flex-shrink-0" />
              <Input
                type="text"
                placeholder={filter.placeholder || searchPlaceholder}
                value={values[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 px-0 py-0 h-full"
              />
            </div>
          )
        }

        if (filter.type === 'select' && filter.options) {
          const width = filter.width || 'w-[130px]'
          // Use placeholder if provided, otherwise create descriptive placeholder from label
          // This helps identify what the filter is for
          const placeholder = filter.placeholder || `Filter by ${filter.label.toLowerCase()}`
          
          // Get current value - if it's "all" or empty, use undefined to show placeholder
          // This ensures the placeholder is visible when no specific filter is selected
          const currentValue = values[filter.key]
          const selectValue = currentValue && currentValue !== 'all' ? currentValue : undefined
          
          return (
            <Select
              key={filter.key}
              value={selectValue}
              onValueChange={(value) => {
                // If "All" is selected, pass "all" to clear the filter and show placeholder
                // Otherwise pass the selected value
                onFilterChange(filter.key, value === '__clear__' ? 'all' : value)
              }}
            >
              <SelectTrigger className={cn('h-10 shrink-0 [&>span]:text-start [&>span]:justify-start', width)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {/* Add "All" option to allow clearing the filter and show placeholder */}
                <SelectItem value="__clear__">All</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        if (filter.type === 'dateRange') {
          const dateRange = values[filter.key] as DateRange | undefined
          
          return (
            <Popover key={filter.key}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-10 w-[240px] justify-start text-start font-normal shrink-0',
                    !dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="me-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>{filter.placeholder || 'Pick a date range'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 min-w-[600px]" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => onFilterChange(filter.key, range)}
                  numberOfMonths={2}
                  className="flex"
                />
                {dateRange && (
                  <div className="border-t p-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFilterChange(filter.key, undefined)}
                      className="h-8"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )
        }

        return null
      })}
    </div>
  )
}
