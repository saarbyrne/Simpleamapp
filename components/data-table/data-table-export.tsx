'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table } from '@tanstack/react-table'
import { Download, FileDown, FileJson, FileText } from 'lucide-react'
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/table-utils'
import { ColumnDef } from '@tanstack/react-table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface DataTableExportProps<TData> {
  table: Table<TData>
  filename?: string
  columns: ColumnDef<TData>[]
}

export function DataTableExport<TData>({
  table,
  filename = 'export',
  columns,
}: DataTableExportProps<TData>) {
  const handleExportCSV = () => {
    const visibleColumns = columns.filter((col) => {
      if (!col.id) return true
      const column = table.getColumn(col.id)
      return column?.getIsVisible() !== false
    })

    const exportColumns = visibleColumns
      .map((col) => {
        const header =
          typeof col.header === 'string'
            ? col.header
            : col.id
              ? col.id.charAt(0).toUpperCase() + col.id.slice(1)
              : ''

        return {
          accessorKey: col.id || '',
          header,
        }
      })
      .filter((col) => col.accessorKey && col.header)

    const data = table.getFilteredRowModel().rows.map((row) => row.original)
    exportToCSV(data as any[], exportColumns, { filename: `${filename}.csv` })
  }

  const handleExportJSON = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original)
    exportToJSON(data as any[], { filename: `${filename}.json` })
  }

  const handleExportPDF = async () => {
    const visibleColumns = columns.filter((col) => {
      if (!col.id) return true
      const column = table.getColumn(col.id)
      return column?.getIsVisible() !== false
    })

    const exportColumns = visibleColumns
      .map((col) => {
        const header =
          typeof col.header === 'string'
            ? col.header
            : col.id
              ? col.id.charAt(0).toUpperCase() + col.id.slice(1)
              : ''

        return {
          accessorKey: col.id || '',
          header,
        }
      })
      .filter((col) => col.accessorKey && col.header)

    const data = table.getFilteredRowModel().rows.map((row) => row.original)
    await exportToPDF(data as any[], exportColumns, { filename: `${filename}.pdf` })
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-lg" className="shrink-0">
                <Download className="h-4 w-4" />
                <span className="sr-only">Export</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export</p>
          </TooltipContent>
        </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

