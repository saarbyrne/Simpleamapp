'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
  ColumnOrderState,
  ColumnSizingState,
  GroupingState,
  ExpandedState,
  RowSelectionState,
  PaginationState,
  useReactTable,
  Table as TanStackTable,
  OnChangeFn,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useState, useMemo, ReactNode } from 'react'
import { DataTableBulkActions, BulkAction } from './data-table-bulk-actions'
import { InlineBulkActions } from './inline-bulk-actions'
import { DataTableExport } from './data-table-export'
import { DataTableColumnManager } from './data-table-column-manager'
import { DataTable as UITable } from '@/components/ui/data-table'
import { cn } from '@/components/ui/utils'

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  // State props
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  columnOrder?: ColumnOrderState
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
  columnSizing?: ColumnSizingState
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>
  grouping?: GroupingState
  onGroupingChange?: OnChangeFn<GroupingState>
  expanded?: ExpandedState
  onExpandedChange?: OnChangeFn<ExpandedState>
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  // Feature flags
  enableRowSelection?: boolean
  enableGrouping?: boolean
  enableColumnResizing?: boolean
  enableColumnReordering?: boolean
  enableColumnVisibility?: boolean
  enableBulkActions?: boolean
  enableExport?: boolean
  // Customization
  bulkActions?: BulkAction[]
  onBulkDelete?: (selectedRows: TData[]) => void | Promise<void>
  onBulkCopy?: (selectedRows: TData[]) => void | Promise<void>
  onBulkExport?: (selectedRows: TData[]) => void | Promise<void>
  onBulkUpdate?: (updates: {
    position?: string | null
    status?: 'active' | 'injured' | 'inactive' | null
    nationality?: string | null
  }) => Promise<void>
  bulkUpdatePositionOptions?: string[]
  bulkUpdateNationalityOptions?: ReadonlyArray<{ code: string; name: string; flag: string }>
  isBulkUpdating?: boolean
  exportFilename?: string
  // UI customization
  emptyMessage?: string
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export function DataTable<TData>({
  data,
  columns,
  // State
  sorting: controlledSorting,
  onSortingChange: setControlledSorting,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange: setControlledColumnVisibility,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange: setControlledColumnOrder,
  columnSizing: controlledColumnSizing,
  onColumnSizingChange: setControlledColumnSizing,
  grouping: controlledGrouping,
  onGroupingChange: setControlledGrouping,
  expanded: controlledExpanded,
  onExpandedChange: setControlledExpanded,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: setControlledRowSelection,
  pagination: controlledPagination,
  onPaginationChange: setControlledPagination,
  // Feature flags
  enableRowSelection = false,
  enableGrouping = false,
  enableColumnResizing = false,
  enableColumnReordering = false,
  enableColumnVisibility = true,
  enableBulkActions = false,
  enableExport = false,
  // Customization
  bulkActions = [],
  onBulkDelete,
  onBulkCopy,
  onBulkExport,
  onBulkUpdate,
  bulkUpdatePositionOptions = [],
  bulkUpdateNationalityOptions = [],
  isBulkUpdating = false,
  exportFilename = 'export',
  // UI
  emptyMessage = 'No results found.',
  className,
  headerClassName,
  bodyClassName,
}: DataTableProps<TData>) {
  // Internal state (used if not controlled)
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({})
  const [internalColumnOrder, setInternalColumnOrder] = useState<ColumnOrderState>([])
  const [internalColumnSizing, setInternalColumnSizing] = useState<ColumnSizingState>({})
  const [internalGrouping, setInternalGrouping] = useState<GroupingState>([])
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({})
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Use controlled or internal state
  const sorting = controlledSorting ?? internalSorting
  const setSorting = (setControlledSorting ?? setInternalSorting) as OnChangeFn<SortingState>
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const setColumnVisibility = (setControlledColumnVisibility ?? setInternalColumnVisibility) as OnChangeFn<VisibilityState>
  const columnOrder = controlledColumnOrder ?? internalColumnOrder
  const setColumnOrder = (setControlledColumnOrder ?? setInternalColumnOrder) as OnChangeFn<ColumnOrderState>
  const columnSizing = controlledColumnSizing ?? internalColumnSizing
  const setColumnSizing = (setControlledColumnSizing ?? setInternalColumnSizing) as OnChangeFn<ColumnSizingState>
  const grouping = controlledGrouping ?? internalGrouping
  const setGrouping = (setControlledGrouping ?? setInternalGrouping) as OnChangeFn<GroupingState>
  const expanded = controlledExpanded ?? internalExpanded
  const setExpanded = (setControlledExpanded ?? setInternalExpanded) as OnChangeFn<ExpandedState>
  const rowSelection = controlledRowSelection ?? internalRowSelection
  const setRowSelection = (setControlledRowSelection ?? setInternalRowSelection) as OnChangeFn<RowSelectionState>
  const pagination = controlledPagination ?? internalPagination
  const setPagination = (setControlledPagination ?? setInternalPagination) as OnChangeFn<PaginationState>

  // Add selection column if enabled
  const columnsWithSelection = useMemo(() => {
    if (!enableRowSelection) return columns

    const selectionColumn: ColumnDef<TData> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      enableGrouping: false,
      size: 40,
      minSize: 40,
      maxSize: 40,
    }

    return [selectionColumn, ...columns]
  }, [columns, enableRowSelection])

  // Ensure select column is always first and actions column is always last
  const normalizedColumnOrder = useMemo(() => {
    // Get all column IDs (use id or accessorKey)
    const getAllColumnIds = (cols: ColumnDef<TData>[]) => {
      return cols.map((col) => {
        if (col.id) return col.id
        if ('accessorKey' in col && typeof col.accessorKey === 'string') return col.accessorKey
        return ''
      }).filter(Boolean)
    }
    
    const allColumnIds = getAllColumnIds(columns)
    
    // If no explicit column order or reordering disabled, build default order
    if (!enableColumnReordering || !columnOrder || columnOrder.length === 0) {
      const baseOrder = enableRowSelection 
        ? ['select', ...allColumnIds]
        : allColumnIds
      
      // Ensure actions is last if it exists
      const actionsIndex = baseOrder.indexOf('actions')
      if (actionsIndex >= 0 && actionsIndex !== baseOrder.length - 1) {
        baseOrder.splice(actionsIndex, 1)
        baseOrder.push('actions')
      }
      
      return baseOrder.length > 0 ? baseOrder : undefined
    }
    
    // When column order is set, ensure select is first and actions is last
    const order = [...columnOrder]
    
    // Ensure select is first if row selection is enabled
    const selectIndex = order.indexOf('select')
    if (enableRowSelection) {
      if (selectIndex > 0) {
        order.splice(selectIndex, 1)
        order.unshift('select')
      } else if (selectIndex < 0) {
        order.unshift('select')
      }
    }
    
    // Ensure actions is last if it exists
    const actionsIndex = order.indexOf('actions')
    if (actionsIndex >= 0 && actionsIndex !== order.length - 1) {
      order.splice(actionsIndex, 1)
      order.push('actions')
    } else if (actionsIndex < 0 && allColumnIds.includes('actions')) {
      // If actions exists in columns but not in order, add it at the end
      order.push('actions')
    }
    
    return order
  }, [columnOrder, enableColumnReordering, enableRowSelection, columns])

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    state: {
      sorting,
      columnVisibility,
      columnOrder: enableColumnReordering && normalizedColumnOrder ? normalizedColumnOrder : undefined,
      columnSizing: enableColumnResizing ? columnSizing : undefined,
      grouping: enableGrouping ? grouping : undefined,
      expanded: enableGrouping ? expanded : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: enableGrouping ? getExpandedRowModel() : undefined,
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: enableColumnResizing ? 'onChange' : undefined,
    enableGrouping: enableGrouping,
    enableRowSelection: enableRowSelection,
  })

  return (
    <div className={cn('space-y-4', className)}>
      {/* Inline Bulk Actions Bar */}
      {enableBulkActions && enableRowSelection && onBulkUpdate && (
        <InlineBulkActions
          table={table}
          onSave={onBulkUpdate}
          positionOptions={bulkUpdatePositionOptions}
          nationalityOptions={bulkUpdateNationalityOptions}
          isLoading={isBulkUpdating}
        />
      )}
      
      {/* Legacy Dropdown Bulk Actions (for delete/copy/export) */}
      {enableBulkActions && enableRowSelection && (onBulkDelete || onBulkCopy || onBulkExport || bulkActions.length > 0) && !onBulkUpdate && (
        <DataTableBulkActions
          table={table}
          actions={bulkActions}
          onDelete={onBulkDelete}
          onCopy={onBulkCopy}
          onExport={onBulkExport}
        />
      )}

      {/* Table */}
      <UITable
        table={table}
        columns={columnsWithSelection}
        enableRowSelection={enableRowSelection}
        enableGrouping={enableGrouping}
        enableColumnResizing={enableColumnResizing}
        emptyMessage={emptyMessage}
        headerClassName={headerClassName}
        bodyClassName={bodyClassName}
      />
    </div>
  )
}

// Export utility components for use in toolbar
export { DataTableBulkActions } from './data-table-bulk-actions'
export { DataTableExport } from './data-table-export'
export { DataTableColumnManager } from './data-table-column-manager'
export { DataTableFilters } from './data-table-filters'

