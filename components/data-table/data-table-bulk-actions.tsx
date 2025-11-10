'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table } from '@tanstack/react-table'
import { MoreHorizontal, Trash2, Copy, Download } from 'lucide-react'
import { ReactNode } from 'react'

export interface BulkAction {
  label: string
  icon?: ReactNode
  onClick: (selectedRows: any[]) => void | Promise<void>
  variant?: 'default' | 'destructive'
  disabled?: (selectedRows: any[]) => boolean
}

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
  actions?: BulkAction[]
  onDelete?: (selectedRows: TData[]) => void | Promise<void>
  onCopy?: (selectedRows: TData[]) => void | Promise<void>
  onExport?: (selectedRows: TData[]) => void | Promise<void>
}

export function DataTableBulkActions<TData>({
  table,
  actions = [],
  onDelete,
  onCopy,
  onExport,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const isSomeSelected = selectedCount > 0

  if (!isSomeSelected) {
    return null
  }

  const defaultActions: BulkAction[] = []

  if (onCopy) {
    defaultActions.push({
      label: 'Copy',
      icon: <Copy className="h-4 w-4" />,
      onClick: async () => {
        const selectedData = selectedRows.map((row) => row.original)
        await onCopy(selectedData)
      },
    })
  }

  if (onExport) {
    defaultActions.push({
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      onClick: async () => {
        const selectedData = selectedRows.map((row) => row.original)
        await onExport(selectedData)
      },
    })
  }

  if (onDelete) {
    defaultActions.push({
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: async () => {
        const selectedData = selectedRows.map((row) => row.original)
        await onDelete(selectedData)
      },
      variant: 'destructive',
    })
  }

  const allActions = [...defaultActions, ...actions]

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b">
      <span className="text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
      </span>
      <div className="flex items-center gap-2 ml-auto">
        {allActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
                <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {allActions.map((action, index) => {
                const isDisabled = action.disabled
                  ? action.disabled(selectedRows.map((row) => row.original))
                  : false

                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={async () => {
                      if (!isDisabled) {
                        const selectedData = selectedRows.map((row) => row.original)
                        await action.onClick(selectedData)
                        table.resetRowSelection()
                      }
                    }}
                    disabled={isDisabled}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetRowSelection()}
        >
          Clear selection
        </Button>
      </div>
    </div>
  )
}

