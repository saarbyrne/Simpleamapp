'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Download, Upload, Settings, History, Save } from 'lucide-react'
import { PageCard } from '@/components/ui/page-card'
import { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'
import { SpreadsheetGrid } from '@/components/spreadsheets/spreadsheet-grid'
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

  const handleDataChange = useCallback((newData: SpreadsheetRow[]) => {
    setData(newData)
    setIsSaved(false)
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement save logic for each data type
      // For now, just show a toast
      toast.info('Save functionality coming soon')
      setIsSaved(true)
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
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 me-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 me-2" />
              Import
            </Button>
            {!isSaved && (
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 me-2" />
                Save Changes
              </Button>
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

        {/* Spreadsheet Grid */}
        <Card className="p-0 overflow-hidden">
          <SpreadsheetGrid
            schema={schema}
            data={data}
            onChange={handleDataChange}
            onSave={handleSave}
            onExport={handleExport}
            onImport={handleImport}
            isSaved={isSaved}
          />
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
