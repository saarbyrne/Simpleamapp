'use client'

import { TableFilters, type TableFilter } from '@/components/ui/table-filters'

export interface FilterConfig {
  key: string
  label: string
  type: 'search' | 'select' | 'dateRange'
  options?: { value: string; label: string }[]
  placeholder?: string
}

export interface DataTableFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onFilterChange: (key: string, value: any) => void
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
  // Convert FilterConfig to TableFilter format
  const tableFilters: TableFilter[] = filters.map((filter) => {
    const tableFilter: TableFilter = {
      key: filter.key,
      label: filter.label,
      type: filter.type,
      placeholder: filter.placeholder,
    }

    // Add options for select filters
    if (filter.type === 'select' && filter.options) {
      tableFilter.options = filter.options
      // Make nationality selector wider to prevent text wrapping
      if (filter.key === 'nationality') {
        tableFilter.width = 'w-[160px]'
      }
    }

    return tableFilter
  })

  return (
    <TableFilters
      filters={tableFilters}
      values={values}
      onFilterChange={onFilterChange}
      searchPlaceholder={searchPlaceholder}
      className={className}
    />
  )
}

