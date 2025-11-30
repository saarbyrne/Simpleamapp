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
        id: sheet.id,
        name: sheet.name,
        description: sheet.description || undefined,
        templateId: sheet.templateId || undefined,
        createdById: sheet.createdById || undefined,
        folderId: sheet.folderId || undefined,
        folder: sheet.folder ? {
          id: sheet.folder.id,
          name: sheet.folder.name,
          description: sheet.folder.description || undefined,
          icon: sheet.folder.icon || undefined,
          color: sheet.folder.color || undefined,
          parentId: sheet.folder.parentId || undefined,
          organizationId: sheet.folder.organizationId,
          sortOrder: sheet.folder.sortOrder,
          createdAt: sheet.folder.createdAt,
          updatedAt: sheet.folder.updatedAt,
        } : undefined,
        tags: Array.isArray(sheet.tags) ? sheet.tags : [],
        schema: (Array.isArray(sheet.schema)
          ? sheet.schema
          : []) as unknown as ColumnDefinition[],
        data: (Array.isArray(sheet.data) ? sheet.data : []) as unknown as SpreadsheetRow[],
        version: sheet.version,
        organizationId: sheet.organizationId,
        starred: sheet.starred || false,
        lastOpenedAt: sheet.lastOpenedAt || undefined,
        sharedWith: Array.isArray(sheet.sharedWith) ? sheet.sharedWith : [],
        createdAt: sheet.createdAt,
        updatedAt: sheet.updatedAt,
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
