'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/components/ui/utils'

export type FilterType = 'search' | 'select'

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
  values: Record<string, string>
  onFilterChange: (key: string, value: string) => void
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
            <Input
              key={filter.key}
              placeholder={filter.placeholder || searchPlaceholder}
              value={values[filter.key] || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className={cn('h-10 w-[200px] shrink-0', filter.width)}
            />
          )
        }

        if (filter.type === 'select' && filter.options) {
          const width = filter.width || 'w-[130px]'
          
          return (
            <Select
              key={filter.key}
              value={values[filter.key] || 'all'}
              onValueChange={(value) => onFilterChange(filter.key, value)}
            >
              <SelectTrigger className={cn('h-10 shrink-0 [&>span]:text-start [&>span]:justify-start', width)}>
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

