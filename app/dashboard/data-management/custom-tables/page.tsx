import { CustomTablesClient } from './custom-tables-client'
import { getSpreadsheets, getSpreadsheetTemplates } from '@/app/actions/spreadsheets'
import { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'

type CustomTablesPageProps = {
  searchParams?: {
    template?: string
  }
}

export const metadata = {
  title: 'Custom Data Tables | SAM',
  description: 'Manage custom data tables',
}

export default async function CustomTablesPage({ searchParams }: CustomTablesPageProps) {
  // Load initial data server-side with parallel queries for better performance
  const [sheetsResult, templatesResult] = await Promise.all([
    getSpreadsheets(),
    getSpreadsheetTemplates(),
  ])

  // Handle type conversion for description field (null -> undefined) and schema (JsonValue -> ColumnDefinition[])
  const spreadsheets = sheetsResult.success
    ? (sheetsResult.spreadsheets || []).map((sheet) => ({
        ...sheet,
        description: sheet.description || undefined,
        templateId: sheet.templateId || undefined,
        createdById: sheet.createdById || undefined,
        schema: (Array.isArray(sheet.schema)
          ? sheet.schema
          : []) as unknown as ColumnDefinition[],
        data: (Array.isArray(sheet.data) ? sheet.data : []) as unknown as SpreadsheetRow[],
      }))
    : []
  const templates = templatesResult.success
    ? (templatesResult.templates || []).map((template) => ({
        ...template,
        description: template.description || undefined,
        organizationId: template.organizationId || undefined,
        schema: (Array.isArray(template.schema)
          ? template.schema
          : []) as unknown as ColumnDefinition[],
        sampleData: Array.isArray(template.sampleData)
          ? (template.sampleData as unknown as SpreadsheetRow[])
          : undefined,
      }))
    : []

  return (
    <CustomTablesClient
      initialSpreadsheets={spreadsheets}
      initialTemplates={templates}
      templateParam={searchParams?.template}
    />
  )
}
