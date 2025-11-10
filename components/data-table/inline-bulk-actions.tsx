'use client'

import { useState, useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { BulkActionsBar, type BulkField } from '@/components/ui/bulk-actions-bar'

interface NationalityOption {
  code: string
  name: string
  flag: string
}

interface InlineBulkActionsProps<TData> {
  table: Table<TData>
  onSave: (updates: {
    position?: string | null
    status?: 'active' | 'injured' | 'inactive' | null
    nationality?: string | null
  }) => Promise<void>
  positionOptions?: string[]
  nationalityOptions?: ReadonlyArray<NationalityOption>
  isLoading?: boolean
}

export function InlineBulkActions<TData>({
  table,
  onSave,
  positionOptions = [],
  nationalityOptions = [],
  isLoading = false,
}: InlineBulkActionsProps<TData>) {
  // Use state to track selected count, updated in useEffect to avoid state updates during render
  const [selectedCount, setSelectedCount] = useState(0)
  
  // Extract state values to stable variables for dependency array
  const rowSelection = table.getState().rowSelection
  const columnFilters = table.getState().columnFilters
  const globalFilter = table.getState().globalFilter
  
  useEffect(() => {
    // Calculate selected count after component mounts to avoid SSR/hydration issues
    // Use setTimeout to ensure this runs after render phase
    const timer = setTimeout(() => {
      try {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        setSelectedCount(selectedRows.length)
      } catch (error) {
        // Fallback: count selected rows from state only (safe, doesn't trigger updates)
        setSelectedCount(Object.keys(rowSelection).length)
      }
    }, 0)
    
    return () => clearTimeout(timer)
  }, [table, rowSelection, columnFilters, globalFilter])

  const fields: BulkField[] = []

  // Add position field if options are available
  if (positionOptions.length > 0) {
    fields.push({
      id: 'position',
      type: 'select',
      placeholder: 'Position',
      width: 'w-[130px]',
      options: positionOptions.map((option) => ({
        value: option,
        label: option,
      })),
    })
  }

  // Add status field (required - cannot be cleared)
  fields.push({
    id: 'status',
    type: 'select',
    placeholder: 'Status',
    width: 'w-[130px]',
    allowClear: false, // Status is required, cannot be cleared
    options: [
      { value: 'active', label: 'Active' },
      { value: 'injured', label: 'Injured' },
      { value: 'inactive', label: 'Inactive' },
    ],
  })

  // Add nationality field if options are available
  if (nationalityOptions.length > 0) {
    fields.push({
      id: 'nationality',
      type: 'select',
      placeholder: 'Nationality',
      width: 'w-[160px]',
      options: nationalityOptions.map((option) => ({
        value: option.name,
        label: (
          <span className="flex items-center gap-2">
            <span>{option.flag}</span>
            <span>{option.name}</span>
          </span>
        ),
      })),
    })
  }

  const handleSave = async (values: Record<string, string | null>) => {
    const updates: {
      position?: string | null
      status?: 'active' | 'injured' | 'inactive'
      nationality?: string | null
    } = {}

    if (values.position !== undefined && values.position !== null && values.position !== '') {
      updates.position = values.position
    } else if (values.position === '') {
      // Allow clearing position (it's nullable in schema)
      updates.position = null
    }

    // Status is required - only include if a valid value is provided
    // Don't allow clearing/nullifying status
    if (values.status !== undefined && values.status !== null && values.status !== '') {
      const statusValue = values.status as 'active' | 'injured' | 'inactive'
      if (['active', 'injured', 'inactive'].includes(statusValue)) {
        updates.status = statusValue
      }
    }

    if (values.nationality !== undefined && values.nationality !== null && values.nationality !== '') {
      updates.nationality = values.nationality
    } else if (values.nationality === '') {
      // Allow clearing nationality (it's nullable in schema)
      updates.nationality = null
    }

    await onSave(updates)
  }

  const handleClear = () => {
    table.resetRowSelection()
  }

  return (
    <BulkActionsBar
      selectedCount={selectedCount}
      fields={fields}
      onSave={handleSave}
      onClear={handleClear}
      isLoading={isLoading}
      itemLabel="player"
    />
  )
}

