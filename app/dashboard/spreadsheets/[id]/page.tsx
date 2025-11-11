'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  ArrowLeft,
  Save,
  History,
  Download,
  Upload,
  Sparkles,
  Settings,
  MoreVertical,
  FileText,
  Clock,
} from 'lucide-react'
import { SpreadsheetGrid } from '@/components/spreadsheets/spreadsheet-grid'
import { CSVImportDialog } from '@/components/spreadsheets/csv-import-dialog'
import { AIAssistantDialog } from '@/components/spreadsheets/ai-assistant-dialog'
import {
  getSpreadsheet,
  updateSpreadsheet,
} from '@/app/actions/spreadsheets'
import { ColumnDefinition, SpreadsheetRow, SpreadsheetVersion } from '@/lib/types/spreadsheet'
import { Person } from '@/components/spreadsheets/cells/person-cell'
import { exportToCSV, downloadCSV } from '@/lib/utils/spreadsheet-csv'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function SpreadsheetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const spreadsheetId = params?.id as string
  const t = useTranslations('spreadsheets')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [schema, setSchema] = useState<ColumnDefinition[]>([])
  const [data, setData] = useState<SpreadsheetRow[]>([])
  const [versions, setVersions] = useState<SpreadsheetVersion[]>([])
  const [currentVersion, setCurrentVersion] = useState(1)
  const [persons, setPersons] = useState<Person[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  // Load spreadsheet data
  useEffect(() => {
    if (!spreadsheetId) return
    loadSpreadsheet()
  }, [spreadsheetId])

  const loadSpreadsheet = async () => {
    setIsLoading(true)
    try {
      const result = await getSpreadsheet(spreadsheetId)

      if (result.success && result.spreadsheet) {
        const sheet = result.spreadsheet
        setName(sheet.name)
        setDescription(sheet.description || '')
        setSchema(sheet.schema as ColumnDefinition[])
        setData(sheet.data as SpreadsheetRow[])
        setVersions((sheet.versions || []) as SpreadsheetVersion[])
        setCurrentVersion(sheet.version)
        setIsSaved(true)
      } else {
        toast.error(result.error || t('failedToLoadSpreadsheet'))
        router.push('/dashboard/spreadsheets')
      }
    } catch (error) {
      console.error('Error loading spreadsheet:', error)
      toast.error(t('failedToLoadSpreadsheet'))
      router.push('/dashboard/spreadsheets')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataChange = useCallback((newData: SpreadsheetRow[]) => {
    setData(newData)
    setIsSaved(false)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSpreadsheet(spreadsheetId, {
        name,
        description,
        schema,
        data,
        changeNote: t('manualSave'),
      })

      if (result.success) {
        toast.success(t('spreadsheetSaved'))
        setIsSaved(true)
        setCurrentVersion(result.spreadsheet?.version || currentVersion + 1)
      } else {
        toast.error(result.error || t('failedToSaveSpreadsheet'))
      }
    } catch (error) {
      console.error('Error saving spreadsheet:', error)
      toast.error(t('failedToSaveSpreadsheet'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = useCallback(() => {
    try {
      const csv = exportToCSV({
        schema,
        data,
        includeTypeHints: true,
      })

      downloadCSV(name || 'spreadsheet', csv)
      toast.success(t('csvExported'))
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error(t('failedToExportCSV'))
    }
  }, [schema, data, name, t])

  const handleImport = useCallback(
    (importedData: SpreadsheetRow[], importedSchema?: ColumnDefinition[]) => {
      if (importedSchema) {
        setSchema(importedSchema)
      }
      setData(importedData)
      setIsSaved(false)
      toast.success(t('importedRows', { count: importedData.length }))
    },
    [t]
  )

  const handleAIAssist = useCallback(
    (result: {
      schema?: ColumnDefinition[]
      data?: SpreadsheetRow[]
      suggestion?: string
    }) => {
      if (result.schema) {
        setSchema(result.schema)
        setIsSaved(false)
      }
      if (result.data) {
        setData(result.data)
        setIsSaved(false)
      }
      if (result.suggestion) {
        toast.success(result.suggestion)
      }
    },
    []
  )

  const handleUpdateInfo = async () => {
    try {
      const result = await updateSpreadsheet(spreadsheetId, {
        name,
        description,
      })

      if (result.success) {
        toast.success(t('spreadsheetInfoUpdated'))
        setIsEditingInfo(false)
      } else {
        toast.error(result.error || t('failedToUpdateInfo'))
      }
    } catch (error) {
      console.error('Error updating info:', error)
      toast.error(t('failedToUpdateInfo'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t('loadingSpreadsheet')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 me-2" />
            {t('back')}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {isEditingInfo ? (
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg font-semibold"
                placeholder={t('spreadsheetName')}
              />
              <Button size="sm" onClick={handleUpdateInfo}>
                {t('save')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditingInfo(false)
                  loadSpreadsheet()
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{name}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingInfo(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Badge variant="outline" className="text-xs">
            {t('version')} {currentVersion}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={showVersionHistory} onOpenChange={setShowVersionHistory}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 me-2" />
                {t('history')}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t('versionHistory')}</SheetTitle>
                <SheetDescription>
                  {t('versionHistoryDescription')}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {versions.map((version) => (
                  <Card key={version.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{t('version')} {version.version}</div>
                        <div className="text-sm text-muted-foreground">
                          {version.changeNote || t('noDescription')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline me-1" />
                          {format(new Date(version.createdAt), 'MMM d, yyyy HH:mm')}
                        </div>
                      </div>
                      {version.version !== currentVersion && (
                        <Button size="sm" variant="outline">
                          {t('restore')}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {versions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    {t('noVersionHistory')}
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {description && !isEditingInfo && (
        <p className="text-muted-foreground">{description}</p>
      )}

      {/* Spreadsheet Grid */}
      <Card className="flex-1 overflow-hidden">
        <SpreadsheetGrid
          schema={schema}
          data={data}
          onChange={handleDataChange}
          onSave={handleSave}
          onExport={handleExport}
          onImport={() => setShowImportDialog(true)}
          onAIAssist={() => setShowAIDialog(true)}
          persons={persons}
          isSaved={isSaved}
          className="h-full"
        />
      </Card>

      {/* CSV Import Dialog */}
      <CSVImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImport}
        currentSchema={schema}
      />

      {/* AI Assistant Dialog */}
      <AIAssistantDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        onApply={handleAIAssist}
        currentSchema={schema}
        currentData={data}
      />
    </div>
  )
}
