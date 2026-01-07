'use client'

import React from 'react'
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
  emptyMessage?: React.ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export function DataTable<TData>({
  table,
  columns,
  enableRowSelection = false,
  enableGrouping = false,
  enableColumnResizing = true,
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
    <div className={cn('w-full min-w-0 overflow-x-auto rounded-lg border bg-card', className)}>
      <div className="min-w-max">
        <Table>
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column
                  const columnId = column?.id
                  const columnDef = column?.columnDef
                  const canResize = Boolean(enableColumnResizing && column?.getCanResize?.())
                  const isGrouped = Boolean(enableGrouping && column && column.getIsGrouped?.())
                  const headerStyle =
                    column && columnDef
                      ? {
                          width: header.getSize(),
                          minWidth: columnDef.minSize,
                          maxWidth: columnDef.maxSize,
                        }
                      : undefined
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'relative',
                        canResize && 'group',
                        columnId === 'actions' && 'text-end',
                        columnId === 'select' && 'w-10 !px-2 !py-0'
                      )}
                      style={headerStyle}
                    >
                      {header.isPlaceholder || !column ? null : (
                        columnId === 'select' ? (
                          <div className="flex items-center justify-center">
                            {flexRender(column.columnDef.header, header.getContext())}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isGrouped && (
                              <button
                                onClick={column.getToggleGroupingHandler()}
                                className="p-1 hover:bg-muted rounded"
                              >
                                {column.getIsGrouped() ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            <div
                              {...{
                                className: column.getCanSort()
                                  ? 'flex cursor-pointer items-center gap-2 select-none'
                                  : 'flex items-center gap-2',
                                onClick: column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(column.columnDef.header, header.getContext())}
                              {{
                                asc: ' ▲',
                                desc: ' ▼',
                              }[column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
                        )
                      )}
                      {canResize && column && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            'absolute end-0 top-0 h-full w-px cursor-col-resize touch-none select-none bg-border opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary/50',
                            column.getIsResizing() && 'bg-primary opacity-100'
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
                    <TableRow key={row.id} data-state={enableRowSelection && row.getIsSelected?.() ? 'selected' : undefined}>
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
                    data-state={enableRowSelection && row.getIsSelected?.() ? 'selected' : undefined}
                    className={cn(
                      !isExpanded && isGrouped && 'hidden',
                      isExpanded && isGrouped && ''
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const cellColumn = cell.column
                      const cellColumnId = cellColumn?.id
                      const cellStyle = enableColumnResizing
                        ? {
                            width: cell.column.getSize(),
                            minWidth: cellColumn?.columnDef?.minSize,
                            maxWidth: cellColumn?.columnDef?.maxSize,
                          }
                        : undefined
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            cellColumnId === 'actions' && 'text-end',
                            cellColumnId === 'select' && 'w-10 !px-2 !py-0'
                          )}
                          style={cellStyle}
                        >
                          {cellColumnId === 'select' && cellColumn ? (
                            <div className="flex items-center justify-center">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ) : cellColumn ? (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          ) : null}
                        </TableCell>
                      )
                    })}
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
