'use client'

import {
  ColumnDef,
  flexRender,
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
import { cn } from '@/components/ui/utils'

export interface DataTableProps<TData> {
  table: TanStackTable<TData>
  columns: ColumnDef<TData>[]
  enableRowSelection?: boolean
  enableGrouping?: boolean
  enableColumnResizing?: boolean
  emptyMessage?: string
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export function DataTable<TData>({
  table,
  columns,
  enableRowSelection = false,
  enableGrouping = false,
  enableColumnResizing = false,
  emptyMessage = 'No results found.',
  className,
  headerClassName,
  bodyClassName,
}: DataTableProps<TData>) {
  // Calculate column span for empty state
  const columnsWithSelection = enableRowSelection
    ? [{ id: 'select' }, ...columns]
    : columns

  return (
    <div className={cn('w-full min-w-0 overflow-x-auto rounded-lg border', className)}>
      <div className="min-w-max">
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
                  // Get the grouping column ID from the row
                  const groupingColumnId = row.groupingColumnId || ''
                  const groupingValue = groupingColumnId ? row.getGroupingValue(groupingColumnId) : row.id
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
                          {String(groupingValue)} (
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

