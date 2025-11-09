'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReactNode } from 'react'

export interface FilterConfig {
  key: string
  label: string
  type: 'search' | 'select'
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface DataTableFiltersProps {
  filters: FilterConfig[]
  values: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  searchPlaceholder?: string
  className?: string
}

export function DataTableFilters({
  filters,
  values,
  onFilterChange,
  searchPlaceholder = 'Search...',
  className,
}: DataTableFiltersProps) {
  return (
    <div className={`flex flex-nowrap items-center gap-2 overflow-x-auto ${className || ''}`}>
      {filters.map((filter) => {
        if (filter.type === 'search') {
          return (
            <Input
              key={filter.key}
              placeholder={filter.placeholder || searchPlaceholder}
              value={values[filter.key] || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="h-10 w-[200px] shrink-0"
            />
          )
        }

        if (filter.type === 'select' && filter.options) {
          return (
            <Select
              key={filter.key}
              value={values[filter.key] || 'all'}
              onValueChange={(value) => onFilterChange(filter.key, value)}
            >
              <SelectTrigger className="h-10 w-[130px] shrink-0 [&>span]:text-left [&>span]:justify-start">
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        return null
      })}
    </div>
  )
}

