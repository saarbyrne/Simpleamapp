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
import { DataTableExport } from './data-table-export'
import { DataTableColumnManager } from './data-table-column-manager'
import { cn } from '@/components/ui/utils'

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  // State props
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  columnOrder?: ColumnOrderState
  onColumnOrderChange?: (order: ColumnOrderState) => void
  columnSizing?: ColumnSizingState
  onColumnSizingChange?: (sizing: ColumnSizingState) => void
  grouping?: GroupingState
  onGroupingChange?: (grouping: GroupingState) => void
  expanded?: ExpandedState
  onExpandedChange?: (expanded: ExpandedState) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  // Feature flags
  enableRowSelection?: boolean
  enableGrouping?: boolean
  enableColumnResizing?: boolean
  enableColumnReordering?: boolean
  enableColumnVisibility?: boolean
  enableBulkActions?: boolean
  enableExport?: boolean
  // Customization
  bulkActions?: BulkAction<TData>[]
  onBulkDelete?: (selectedRows: TData[]) => void | Promise<void>
  onBulkCopy?: (selectedRows: TData[]) => void | Promise<void>
  onBulkExport?: (selectedRows: TData[]) => void | Promise<void>
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
  const setSorting = setControlledSorting ?? setInternalSorting
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const setColumnVisibility = setControlledColumnVisibility ?? setInternalColumnVisibility
  const columnOrder = controlledColumnOrder ?? internalColumnOrder
  const setColumnOrder = setControlledColumnOrder ?? setInternalColumnOrder
  const columnSizing = controlledColumnSizing ?? internalColumnSizing
  const setColumnSizing = setControlledColumnSizing ?? setInternalColumnSizing
  const grouping = controlledGrouping ?? internalGrouping
  const setGrouping = setControlledGrouping ?? setInternalGrouping
  const expanded = controlledExpanded ?? internalExpanded
  const setExpanded = setControlledExpanded ?? setInternalExpanded
  const rowSelection = controlledRowSelection ?? internalRowSelection
  const setRowSelection = setControlledRowSelection ?? setInternalRowSelection
  const pagination = controlledPagination ?? internalPagination
  const setPagination = setControlledPagination ?? setInternalPagination

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
        if (typeof col.accessorKey === 'string') return col.accessorKey
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
    defaultColumnOrder: enableColumnReordering && normalizedColumnOrder ? normalizedColumnOrder : undefined,
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
      {/* Bulk Actions Bar */}
      {enableBulkActions && enableRowSelection && (
        <DataTableBulkActions
          table={table}
          actions={bulkActions}
          onDelete={onBulkDelete}
          onCopy={onBulkCopy}
          onExport={onBulkExport}
        />
      )}

      {/* Table */}
      <div className="overflow-auto rounded-lg border">
        <Table>
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canResize = enableColumnResizing && header.column.getCanResize()
                  const isGrouped = enableGrouping && header.column.getIsGrouped()

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'relative',
                        header.column.id === 'actions' && 'text-right',
                        header.column.id === 'select' && 'w-10 !px-2 !py-0'
                      )}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        header.column.id === 'select' ? (
                          <div className="flex items-center justify-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isGrouped && (
                              <button
                                onClick={header.column.getToggleGroupingHandler()}
                                className="p-1 hover:bg-muted rounded"
                              >
                                {header.column.getIsGrouped() ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'flex cursor-pointer items-center gap-2 select-none'
                                  : 'flex items-center gap-2',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: ' ▲',
                                desc: ' ▼',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
                        )
                      )}
                      {canResize && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-border hover:bg-primary/50',
                            header.column.getIsResizing() && 'bg-primary'
                          )}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={bodyClassName}>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isGrouped = enableGrouping && row.getIsGrouped()
                const isExpanded = enableGrouping && row.getIsExpanded()

                if (isGrouped) {
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className="font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={row.getToggleExpandedHandler()}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          {flexRender(row.getGroupingValue(), row.getContext())} (
                          {row.subRows.length} {row.subRows.length === 1 ? 'item' : 'items'})
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      !isExpanded && isGrouped && 'hidden',
                      isExpanded && isGrouped && ''
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.id === 'actions' && 'text-right',
                          cell.column.id === 'select' && 'w-10 !px-2 !py-0'
                        )}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {cell.column.id === 'select' ? (
                          <div className="flex items-center justify-center">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columnsWithSelection.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Export utility components for use in toolbar
export { DataTableBulkActions } from './data-table-bulk-actions'
export { DataTableExport } from './data-table-export'
export { DataTableColumnManager } from './data-table-column-manager'
export { DataTableFilters } from './data-table-filters'

