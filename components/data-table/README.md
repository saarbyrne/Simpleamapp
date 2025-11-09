# DataTable Components

A modular, reusable table system built on TanStack Table v8 with advanced features including grouping, column reordering, resizing, bulk actions, and export capabilities.

## Features

- ✅ **Grouping** - Group rows by column values
- ✅ **Column Reordering** - Drag and drop columns to reorder
- ✅ **Column Resizing** - Resize columns by dragging borders
- ✅ **Column Visibility** - Show/hide columns dynamically
- ✅ **Bulk Actions** - Select multiple rows and perform actions
- ✅ **Export** - Export to CSV, JSON, or PDF
- ✅ **Filtering** - Reusable filter components
- ✅ **Sorting** - Multi-column sorting
- ✅ **Pagination** - Built-in pagination support

## Components

### `DataTable`

The main table component that handles all table functionality.

```tsx
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableGrouping: true, // Enable grouping for this column
    enableResizing: true, // Enable resizing
  },
  // ... more columns
]

<DataTable
  data={yourData}
  columns={columns}
  enableRowSelection={true}
  enableGrouping={true}
  enableColumnResizing={true}
  enableColumnReordering={true}
  enableBulkActions={true}
/>
```

### `DataTableFilters`

Reusable filter component for search and select filters.

```tsx
import { DataTableFilters, type FilterConfig } from '@/components/data-table'

const filterConfig: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
]

<DataTableFilters
  filters={filterConfig}
  values={{ search: '', status: 'all' }}
  onFilterChange={(key, value) => {
    // Handle filter change
  }}
/>
```

### `DataTableBulkActions`

Component for bulk actions when rows are selected.

```tsx
import { DataTableBulkActions, type BulkAction } from '@/components/data-table'

const bulkActions: BulkAction<YourDataType>[] = [
  {
    label: 'Archive',
    onClick: async (selectedRows) => {
      // Handle bulk archive
    },
  },
]

<DataTableBulkActions
  table={tableInstance}
  actions={bulkActions}
  onDelete={async (rows) => {
    // Handle bulk delete
  }}
/>
```

### `DataTableExport`

Export component for CSV, JSON, and PDF exports.

```tsx
import { DataTableExport } from '@/components/data-table'

<DataTableExport
  table={tableInstance}
  columns={columns}
  filename="my-export"
/>
```

### `DataTableColumnManager`

Component for managing column visibility and order.

```tsx
import { DataTableColumnManager } from '@/components/data-table'

<DataTableColumnManager
  table={tableInstance}
  onColumnOrderChange={(newOrder) => {
    // Handle column order change
  }}
/>
```

## Complete Example

```tsx
'use client'

import { useState, useMemo } from 'react'
import {
  DataTable,
  DataTableFilters,
  DataTableColumnManager,
  DataTableExport,
  type FilterConfig,
} from '@/components/data-table'
import { ColumnDef, SortingState, VisibilityState, PaginationState } from '@tanstack/react-table'

type Player = {
  id: string
  name: string
  position: string
  status: string
}

export function PlayersTable({ players }: { players: Player[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [search, setSearch] = useState('')

  const columns: ColumnDef<Player>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      enableGrouping: true,
    },
    {
      accessorKey: 'position',
      header: 'Position',
      enableGrouping: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ], [])

  const filteredData = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [players, search])

  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search players...',
    },
  ]

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <DataTableFilters
          filters={filterConfig}
          values={{ search }}
          onFilterChange={(key, value) => {
            if (key === 'search') setSearch(value)
          }}
        />
        <DataTableColumnManager table={tableInstance} />
        <DataTableExport table={tableInstance} columns={columns} filename="players" />
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        pagination={pagination}
        onPaginationChange={setPagination}
        enableRowSelection={true}
        enableGrouping={true}
        enableColumnResizing={true}
        enableColumnReordering={true}
        enableBulkActions={true}
      />
    </div>
  )
}
```

## Column Configuration

### Enabling Features per Column

```tsx
const columns: ColumnDef<YourType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableGrouping: true,      // Can group by this column
    enableSorting: true,        // Can sort by this column
    enableHiding: true,         // Can hide this column
    enableResizing: true,       // Can resize this column
    minSize: 100,              // Minimum column width
    maxSize: 500,              // Maximum column width
  },
]
```

## State Management

All table state can be controlled or uncontrolled:

- **Controlled**: Pass state and onChange handlers
- **Uncontrolled**: Omit state props, component manages internally

```tsx
// Controlled
<DataTable
  sorting={sorting}
  onSortingChange={setSorting}
  // ... other controlled props
/>

// Uncontrolled
<DataTable
  // No state props - component manages internally
/>
```

## Export Functions

You can also use export functions directly:

```tsx
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/table-utils'

// Export to CSV
exportToCSV(data, columns, { filename: 'export.csv' })

// Export to JSON
exportToJSON(data, { filename: 'export.json' })

// Export to PDF
await exportToPDF(data, columns, { filename: 'export.pdf' })
```

## Notes

- **PDF Export**: The PDF export uses a simple print-based approach. For production, consider installing `jspdf` and `jspdf-autotable` for better PDF generation.
- **Grouping**: Enable grouping by setting `enableGrouping={true}` and configuring columns with `enableGrouping: true`.
- **Column Reordering**: Uses `@dnd-kit` for drag-and-drop functionality.
- **Performance**: For large datasets, consider implementing server-side pagination/filtering.

