'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { importFromCSV } from '@/lib/utils/spreadsheet-csv'
import { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'
import { useTranslations } from 'next-intl'

interface CSVImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: SpreadsheetRow[], schema?: ColumnDefinition[]) => void
  currentSchema?: ColumnDefinition[]
}

export function CSVImportDialog({
  open,
  onOpenChange,
  onImport,
  currentSchema,
}: CSVImportDialogProps) {
  const t = useTranslations('spreadsheets.csvImport')
  const tCommon = useTranslations('common')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{
    data: SpreadsheetRow[]
    schema?: ColumnDefinition[]
    errors?: string[]
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (!selectedFile) return

      setFile(selectedFile)
      setIsProcessing(true)

      try {
        const text = await selectedFile.text()
        const result = await importFromCSV(text, {
          schema: currentSchema,
          inferTypes: !currentSchema,
        })

        setPreview(result)
      } catch (error) {
        console.error('Error processing CSV:', error)
        setPreview({
          data: [],
          errors: [t('failedToProcessCsv')],
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [currentSchema, t]
  )

  const handleImport = useCallback(() => {
    if (!preview) return

    onImport(preview.data, preview.schema)
    onOpenChange(false)

    // Reset state
    setFile(null)
    setPreview(null)
  }, [preview, onImport, onOpenChange])

  const handleCancel = useCallback(() => {
    setFile(null)
    setPreview(null)
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">{t('csvFile')}</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('csv-file')?.click()}
              >
                <Upload className="h-4 w-4 me-2" />
                {file ? file.name : t('chooseCsvFile')}
              </Button>
              <input
                id="csv-file"
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>{t('processingCsv')}</AlertDescription>
            </Alert>
          )}

          {/* Errors */}
          {preview?.errors && preview.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-1">{t('errorsFound')}</div>
                <ul className="list-disc list-inside space-y-1">
                  {preview.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success & Preview */}
          {preview && preview.data.length > 0 && (
            <>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {t('successfullyParsed', { rows: preview.data.length })}
                  {preview.schema && t('withColumns', { columns: preview.schema.length })}
                </AlertDescription>
              </Alert>

              {/* Schema Preview */}
              {preview.schema && (
                <div className="space-y-2">
                  <Label>{t('detectedColumns')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {preview.schema.map((col) => (
                      <Badge key={col.id} variant="secondary">
                        {col.name} ({col.type})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Preview */}
              <div className="space-y-2">
                <Label>{t('dataPreview')}</Label>
                <ScrollArea className="h-[200px] w-full border rounded-md">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        {(preview.schema || Object.keys(preview.data[0])).map((col: any) => (
                          <th key={typeof col === 'string' ? col : col.id} className="p-2 text-start font-medium">
                            {typeof col === 'string' ? col : col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.data.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                          {Object.keys(row).filter(key => key !== 'id').map((key) => (
                            <td key={key} className="p-2">
                              {row[key]?.toString() || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!preview || preview.data.length === 0 || (preview.errors && preview.errors.length > 0)}
          >
            {t('importRows', { count: preview?.data.length || 0 })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
