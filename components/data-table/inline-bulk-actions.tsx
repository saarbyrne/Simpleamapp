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
  
  useEffect(() => {
    // Calculate selected count after component mounts to avoid SSR/hydration issues
    // Use setTimeout to ensure this runs after render phase
    const timer = setTimeout(() => {
      try {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        setSelectedCount(selectedRows.length)
      } catch (error) {
        // Fallback: count selected rows from state only (safe, doesn't trigger updates)
        const rowSelection = table.getState().rowSelection
        setSelectedCount(Object.keys(rowSelection).length)
      }
    }, 0)
    
    return () => clearTimeout(timer)
  }, [
    // Use JSON.stringify to create stable dependency strings
    JSON.stringify(table.getState().rowSelection),
    JSON.stringify(table.getState().columnFilters),
    table.getState().globalFilter,
  ])

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

  // Add status field
  fields.push({
    id: 'status',
    type: 'select',
    placeholder: 'Status',
    width: 'w-[130px]',
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
      status?: 'active' | 'injured' | 'inactive' | null
      nationality?: string | null
    } = {}

    if (values.position !== undefined) {
      updates.position = values.position
    }
    if (values.status !== undefined) {
      updates.status = (values.status as 'active' | 'injured' | 'inactive') || null
    }
    if (values.nationality !== undefined) {
      updates.nationality = values.nationality
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

