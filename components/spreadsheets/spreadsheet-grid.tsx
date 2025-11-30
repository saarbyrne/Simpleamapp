'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
  Column as DSGColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/style.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  Clock,
  Sparkles,
} from 'lucide-react'
import { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'
import { PersonCell, Person } from './cells/person-cell'
import { DateCell } from './cells/date-cell'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface SpreadsheetGridProps {
  schema: ColumnDefinition[]
  data: SpreadsheetRow[]
  onChange: (data: SpreadsheetRow[]) => void
  onSave?: () => void
  onExport?: () => void
  onImport?: () => void
  onAIAssist?: () => void
  persons?: Person[]
  isSaved?: boolean
  className?: string
}

export function SpreadsheetGrid({
  schema,
  data,
  onChange,
  onSave,
  onExport,
  onImport,
  onAIAssist,
  persons = [],
  isSaved = true,
  className,
}: SpreadsheetGridProps) {
  const t = useTranslations('spreadsheets.grid')
  const tSpreadsheets = useTranslations('spreadsheets')
  const [selection, setSelection] = useState<{ min: { row: number; col: number }; max: { row: number; col: number } } | null>(null)

  // Convert our schema to DataSheetGrid columns
  const columns = useMemo<DSGColumn[]>(() => {
    return schema.map((col) => {
      const baseColumn = {
        ...keyColumn(col.id, textColumn),
        title: col.name,
        minWidth: col.settings?.width || 150,
      }

      // Customize based on column type
      switch (col.type) {
        case 'number':
          return {
            ...baseColumn,
            ...keyColumn(col.id, textColumn),
            component: ({ rowData, setRowData, focus }: any) => (
              <input
                type="number"
                className="dsg-input"
                value={rowData[col.id] || ''}
                onChange={(e) => setRowData({
                  ...rowData,
                  [col.id]: e.target.value ? Number(e.target.value) : null,
                })}
                {...(focus && typeof focus === 'function' ? { onFocus: focus } : {})}
              />
            ),
          }

        case 'date':
          return {
            ...baseColumn,
            component: ({ rowData, setRowData }: any) => (
              <DateCell
                value={rowData[col.id]}
                onChange={(value) => setRowData({ ...rowData, [col.id]: value })}
              />
            ),
            disableKeys: true,
            keepFocus: true,
          }

        case 'person':
          return {
            ...baseColumn,
            component: ({ rowData, setRowData }: any) => {
              const personId = rowData[col.id]
              const person = persons.find(p => p.id === personId)

              return (
                <div className="h-full flex items-center px-2">
                  <PersonCell
                    persons={persons}
                    value={personId || null}
                    onChange={(value) => setRowData({ ...rowData, [col.id]: value })}
                  />
                </div>
              )
            },
            disableKeys: true,
            keepFocus: true,
            cellClassName: 'dsg-cell-person',
          }

        case 'formula':
          return {
            ...baseColumn,
            component: ({ rowData }: any) => {
              // Calculate formula value
              const value = calculateFormula(col.settings?.formula || '', rowData)
              return (
                <div className="h-full flex items-center px-2 text-muted-foreground bg-muted/50">
                  {value !== null ? value : '—'}
                </div>
              )
            },
            disabled: true,
          }

        default:
          return baseColumn
      }
    })
  }, [schema, persons])

  const handleAddRow = useCallback(() => {
    const newRow: SpreadsheetRow = { id: `row-${Date.now()}` }
    schema.forEach(col => {
      newRow[col.id] = null
    })
    onChange([...data, newRow])
  }, [data, schema, onChange])

  const handleDeleteSelected = useCallback(() => {
    // TODO: Implement row selection and deletion
    // This requires managing selection state from DataSheetGrid
  }, [data, onChange])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleAddRow}>
            <Plus className="h-4 w-4 me-2" />
            {t('addRow')}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDeleteSelected}
            disabled={true}
          >
            <Trash2 className="h-4 w-4 me-2" />
            {t('deleteSelected')}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {onImport && (
            <Button size="sm" variant="outline" onClick={onImport}>
              <Upload className="h-4 w-4 me-2" />
              {t('import')}
            </Button>
          )}

          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 me-2" />
              {t('export')}
            </Button>
          )}

          {onAIAssist && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button size="sm" variant="outline" onClick={onAIAssist}>
                <Sparkles className="h-4 w-4 me-2" />
                {t('aiAssist')}
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isSaved && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {t('unsavedChanges')}
            </Badge>
          )}

          {onSave && (
            <Button size="sm" onClick={onSave} disabled={isSaved}>
              <Save className="h-4 w-4 me-2" />
              {t('save')}
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <DataSheetGrid
          value={data}
          onChange={onChange}
          columns={columns}
          height={600}
          rowHeight={40}
          headerRowHeight={40}
          addRowsComponent={false}
          lockRows={false}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 p-2 border-t text-sm text-muted-foreground">
        <div>
          {data.length} {tSpreadsheets('rows')} · {schema.length} {tSpreadsheets('columns')}
        </div>
      </div>
    </div>
  )
}

/**
 * Simple formula calculator
 * Supports basic formulas like "duration * rpe"
 */
function calculateFormula(formula: string, rowData: SpreadsheetRow): number | null {
  if (!formula) return null

  try {
    // Replace column IDs with their values
    let expression = formula

    // Find all column references in the formula
    const columnRefs = formula.match(/\b[a-z_][a-z0-9_]*\b/gi) || []

    columnRefs.forEach(ref => {
      const value = rowData[ref]
      if (value !== null && value !== undefined && !isNaN(Number(value))) {
        expression = expression.replace(new RegExp(`\\b${ref}\\b`, 'g'), String(value))
      } else {
        expression = expression.replace(new RegExp(`\\b${ref}\\b`, 'g'), '0')
      }
    })

    // Evaluate the expression (safely)
    // eslint-disable-next-line no-eval
    const result = eval(expression)

    return typeof result === 'number' && !isNaN(result) ? Math.round(result * 100) / 100 : null
  } catch (error) {
    console.error('Formula calculation error:', error)
    return null
  }
}
