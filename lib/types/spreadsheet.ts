export type ColumnType = 'text' | 'number' | 'date' | 'person' | 'event' | 'team' | 'formula'

export interface ColumnDefinition {
  id: string
  name: string
  type: ColumnType
  settings?: {
    filter?: string // For person type: 'players', 'staff', 'all'
    formula?: string // For formula type
    width?: number // Column width in pixels
  }
}

export interface SpreadsheetRow {
  id?: string
  [key: string]: any
}

export interface SpreadsheetData {
  id: string
  name: string
  description?: string
  schema: ColumnDefinition[]
  data: SpreadsheetRow[]
  version: number
  templateId?: string
  organizationId: string
  createdById?: string
  createdAt: Date
  updatedAt: Date
}

export interface SpreadsheetTemplate {
  id: string
  name: string
  description?: string
  category: string
  schema: ColumnDefinition[]
  sampleData?: SpreadsheetRow[]
  isPublic: boolean
  organizationId?: string
  createdAt: Date
  updatedAt: Date
}

export interface SpreadsheetVersion {
  id: string
  spreadsheetId: string
  version: number
  schema: ColumnDefinition[]
  data: SpreadsheetRow[]
  createdById?: string
  changeNote?: string
  createdAt: Date
}

// Template categories
export const TEMPLATE_CATEGORIES = {
  performance: 'Performance',
  wellness: 'Wellness',
  injury: 'Injury',
  match: 'Match',
  attendance: 'Attendance',
  gps: 'GPS',
  custom: 'Custom',
} as const

export type TemplateCategory = keyof typeof TEMPLATE_CATEGORIES
