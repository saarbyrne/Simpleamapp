'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table } from '@tanstack/react-table'
import { ChevronDown, Check, GripVertical, Eye, EyeOff, Columns2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

export interface DataTableColumnManagerProps<TData> {
  table: Table<TData>
  onColumnOrderChange?: (columnOrder: string[]) => void
}

function SortableColumnItem<TData>({
  column,
  table,
}: {
  column: any
  table: Table<TData>
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const header =
    typeof column.columnDef.header === 'string'
      ? column.columnDef.header
      : column.id
        ? column.id.charAt(0).toUpperCase() + column.id.slice(1).replace(/([A-Z])/g, ' $1')
        : column.id

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-move"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Checkbox
        checked={column.getIsVisible()}
        onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
      />
      <span className="flex-1 text-sm">{header}</span>
      {column.getIsVisible() ? (
        <Eye className="h-4 w-4 text-muted-foreground" />
      ) : (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  )
}

export function DataTableColumnManager<TData>({
  table,
  onColumnOrderChange,
}: DataTableColumnManagerProps<TData>) {
  const [open, setOpen] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.id !== 'select' && column.id !== 'actions')

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id)
      const newIndex = columns.findIndex((col) => col.id === over.id)

      const newOrder = arrayMove(
        columns.map((col) => col.id || ''),
        oldIndex,
        newIndex
      )

      // Ensure select column stays first if it exists
      const selectIndex = newOrder.indexOf('select')
      if (selectIndex > 0) {
        newOrder.splice(selectIndex, 1)
        newOrder.unshift('select')
      }
      
      // Ensure actions column stays last if it exists
      const actionsIndex = newOrder.indexOf('actions')
      if (actionsIndex >= 0 && actionsIndex !== newOrder.length - 1) {
        newOrder.splice(actionsIndex, 1)
        newOrder.push('actions')
      }

      // Update column order in table
      table.setColumnOrder(newOrder)

      // Notify parent if callback provided
      if (onColumnOrderChange) {
        onColumnOrderChange(newOrder)
      }
    }
  }

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-lg" className="shrink-0">
                <Columns2 className="h-4 w-4" />
                <span className="sr-only">Manage Columns</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage Columns</p>
          </TooltipContent>
        </Tooltip>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Manage Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columns.map((col) => col.id || '')} strategy={verticalListSortingStrategy}>
            <div className="max-h-[400px] overflow-y-auto">
              {columns.map((column) => (
                <SortableColumnItem key={column.id} column={column} table={table} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            columns.forEach((column) => column.toggleVisibility(true))
          }}
        >
          <Check className="mr-2 h-4 w-4" />
          Show all
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            columns.forEach((column) => {
              if (column.id !== 'name' && column.id !== 'select') {
                column.toggleVisibility(false)
              }
            })
          }}
        >
          Hide all
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

