'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Upload, Settings, History, Save } from 'lucide-react'
import { PageCard } from '@/components/ui/page-card'
import { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'
import { SpreadsheetGridLazy } from '@/components/spreadsheets/spreadsheet-grid-lazy'
import { useVirtualizer } from '@tanstack/react-virtual'
import { toast } from 'sonner'

interface DataTableViewProps {
  tableName: string
  description: string
  schema: ColumnDefinition[]
  data: any[]
  dataType: string
}

export function DataTableView({
  tableName,
  description,
  schema,
  data: initialData,
  dataType,
}: DataTableViewProps) {
  const router = useRouter()
  const [data, setData] = useState<SpreadsheetRow[]>(initialData)
  const [isSaved, setIsSaved] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const shouldStartInPreview = initialData.length > 75
  const [isPreviewMode, setIsPreviewMode] = useState(shouldStartInPreview)
  const previewColumns = useMemo(() => schema.slice(0, PREVIEW_MAX_COLUMNS), [schema])
  const hiddenColumnCount = Math.max(schema.length - previewColumns.length, 0)

  const handleDataChange = useCallback((newData: SpreadsheetRow[]) => {
    setData(newData)
    setIsSaved(false)
  }, [])

  const handleCancel = useCallback(() => {
    setData(initialData)
    setIsSaved(true)
  }, [initialData])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Dynamically import the appropriate save function based on dataType
      let saveFunction
      switch (dataType) {
        case 'players':
          const { savePlayersData } = await import('@/app/actions/data-tables')
          saveFunction = savePlayersData
          break
        // TODO: Add other data types
        default:
          toast.info('Save functionality for this data type coming soon')
          setIsLoading(false)
          return
      }

      const result = await saveFunction(data)

      if (result.success) {
        toast.success('Changes saved successfully')
        setIsSaved(true)
      } else {
        toast.error(result.error || 'Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    toast.info('Export functionality coming soon')
  }

  const handleImport = () => {
    // TODO: Implement CSV import
    toast.info('Import functionality coming soon')
  }

  return (
    <div className="container mx-auto py-8">
      <PageCard
        title={tableName}
        description={description}
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/data-management')}
            >
              <ArrowLeft className="h-4 w-4 me-2" />
              Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <History className="h-4 w-4 me-2" />
              History
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Settings className="h-4 w-4 me-2" />
              Permissions
            </Button>
            <Button
              size="sm"
              variant={isPreviewMode ? 'default' : 'outline'}
              onClick={() => setIsPreviewMode((prev) => !prev)}
            >
              {isPreviewMode ? 'Open Spreadsheet' : 'Show Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 me-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 me-2" />
              Import
            </Button>
            {!isSaved && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 me-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        }
      >
        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary" className="text-sm">
            {data.length} rows
          </Badge>
          <Badge variant="outline" className="text-sm">
            {schema.length} columns
          </Badge>
          {!isSaved && (
            <Badge variant="destructive" className="text-sm">
              Unsaved changes
            </Badge>
          )}
        </div>

        {isPreviewMode && (
          <div className="mb-4 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Instant preview renders live data with virtualization for smooth scrolling.{' '}
            {hiddenColumnCount > 0
              ? `Only the first ${previewColumns.length} columns are shown here · ${hiddenColumnCount} more available in the spreadsheet view.`
              : 'Open the spreadsheet view above to start editing.'}
          </div>
        )}

        {/* Spreadsheet Grid */}
        <Card className="p-0 overflow-hidden h-[600px]">
          {isPreviewMode ? (
            <VirtualizedTablePreview schema={previewColumns} data={data} />
          ) : (
            <SpreadsheetGridLazy
              schema={schema}
              data={data}
              onChange={handleDataChange}
              onSave={handleSave}
              onExport={handleExport}
              onImport={handleImport}
              isSaved={isSaved}
              className="h-full"
            />
          )}
        </Card>

        {/* Info */}
        <div className="mt-4 text-sm text-muted-foreground">
          All changes are automatically tracked and can be restored. Use keyboard shortcuts like
          Ctrl+C/V for copy/paste, or drag cells to fill down.
        </div>
      </PageCard>
    </div>
  )
}

const PREVIEW_MAX_COLUMNS = 6
const PREVIEW_ROW_HEIGHT = 44

interface VirtualizedTablePreviewProps {
  schema: ColumnDefinition[]
  data: SpreadsheetRow[]
}

function VirtualizedTablePreview({ schema, data }: VirtualizedTablePreviewProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const columns = useMemo(() => (schema.length ? schema : []), [schema])
  const templateColumns = useMemo(() => {
    if (!columns.length) return '1fr'
    return columns
      .map((column) => `minmax(${Math.min(column.settings?.width || 160, 280)}px, 1fr)`)
      .join(' ')
  }, [columns])

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => PREVIEW_ROW_HEIGHT,
    overscan: 8,
  })

  if (!columns.length) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
        Configure at least one column to preview this dataset.
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
        <span>No rows available yet.</span>
        <span>Add a row from the toolbar once the spreadsheet view is open.</span>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="relative flex h-full overflow-auto">
      <div className="min-w-max flex-1">
        <div
          className="sticky top-0 z-10 grid border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          style={{ gridTemplateColumns: templateColumns }}
        >
          {columns.map((column) => (
            <div key={column.id} className="px-3 py-2 border-r border-border last:border-r-0">
              {column.name}
            </div>
          ))}
        </div>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = data[virtualRow.index]
            return (
              <div
                key={row?.id ? `${row.id}` : virtualRow.key}
                className="absolute inset-x-0 grid border-b border-border/80 bg-background"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${virtualRow.size}px`,
                  gridTemplateColumns: templateColumns,
                }}
              >
                {columns.map((column) => (
                  <div
                    key={`${row?.id ?? virtualRow.key}-${column.id}`}
                    className="px-3 py-2 text-sm text-muted-foreground/90 truncate border-r border-border/60 last:border-r-0"
                    title={formatPreviewValue(row?.[column.id])}
                  >
                    {formatPreviewValue(row?.[column.id])}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatPreviewValue(value: unknown) {
  if (value === null || value === undefined) return '—'

  if (typeof value === 'string') {
    return value.length > 60 ? `${value.slice(0, 60)}…` : value
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : value.toFixed(2)
  }

  if (value instanceof Date) {
    return value.toLocaleDateString()
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return '—'
    }
  }

  return String(value)
}
