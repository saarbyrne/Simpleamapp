import Papa from 'papaparse'
import { ColumnDefinition, SpreadsheetRow, ColumnType } from '../types/spreadsheet'

interface CSVExportOptions {
  schema: ColumnDefinition[]
  data: SpreadsheetRow[]
  includeTypeHints?: boolean
}

interface CSVImportOptions {
  schema?: ColumnDefinition[]
  inferTypes?: boolean
}

/**
 * Export spreadsheet data to CSV format
 */
export function exportToCSV(options: CSVExportOptions): string {
  const { schema, data, includeTypeHints = true } = options

  const headers = schema.map(col => col.name)
  const rows = data.map(row => {
    return schema.map(col => {
      const value = row[col.id]

      // Format based on column type
      if (value === null || value === undefined) return ''

      switch (col.type) {
        case 'date':
          return value instanceof Date ? value.toISOString().split('T')[0] : value
        case 'person':
        case 'event':
        case 'team':
          // These should be resolved to names before export
          return value
        default:
          return value
      }
    })
  })

  let csvContent: string

  if (includeTypeHints) {
    // Add type hints as first row
    const typeHints = schema.map(col => `#${col.type}`)
    csvContent = Papa.unparse({
      fields: headers,
      data: [typeHints, ...rows],
    })
  } else {
    csvContent = Papa.unparse({
      fields: headers,
      data: rows,
    })
  }

  return csvContent
}

/**
 * Download CSV file to user's computer
 */
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Import CSV data and parse it
 */
export function importFromCSV(
  csvContent: string,
  options: CSVImportOptions = {}
): Promise<{
  data: SpreadsheetRow[]
  inferredSchema?: ColumnDefinition[]
  errors?: string[]
}> {
  return new Promise((resolve) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // We'll handle type conversion ourselves
      complete: (results) => {
        const errors: string[] = []

        // Check if first row contains type hints
        const firstRow = results.data[0] as any
        const hasTypeHints = firstRow && Object.values(firstRow).some(
          (val: any) => typeof val === 'string' && val.startsWith('#')
        )

        let data: SpreadsheetRow[]
        let typeHints: Record<string, ColumnType> | null = null

        if (hasTypeHints) {
          // Extract type hints and remove from data
          typeHints = {}
          Object.entries(firstRow).forEach(([key, value]) => {
            if (typeof value === 'string' && value.startsWith('#')) {
              typeHints![key] = value.substring(1) as ColumnType
            }
          })
          data = results.data.slice(1) as SpreadsheetRow[]
        } else {
          data = results.data as SpreadsheetRow[]
        }

        // Add IDs to rows
        data = data.map((row, index) => ({
          id: `row-${index + 1}`,
          ...row,
        }))

        // Infer schema if requested and not using provided schema
        let inferredSchema: ColumnDefinition[] | undefined

        if (options.inferTypes && data.length > 0) {
          const headers = Object.keys(data[0]).filter(key => key !== 'id')
          inferredSchema = headers.map(header => {
            const columnId = header.toLowerCase().replace(/\s+/g, '_')

            // Use type hint if available
            if (typeHints && typeHints[header]) {
              return {
                id: columnId,
                name: header,
                type: typeHints[header],
              }
            }

            // Infer from column name or data
            const inferredType = inferColumnType(header, data, header)

            return {
              id: columnId,
              name: header,
              type: inferredType,
            }
          })
        }

        resolve({
          data,
          inferredSchema,
          errors: errors.length > 0 ? errors : undefined,
        })
      },
      error: (error: Error) => {
        resolve({
          data: [],
          errors: [error.message],
        })
      },
    })
  })
}

/**
 * Infer column type from column name and sample data
 */
function inferColumnType(
  columnName: string,
  data: SpreadsheetRow[],
  columnKey: string
): ColumnType {
  const lowerName = columnName.toLowerCase()

  // Check column name patterns
  if (lowerName.includes('player') || lowerName.includes('person') || lowerName.includes('name')) {
    return 'person'
  }

  if (lowerName.includes('event') || lowerName.includes('session') || lowerName.includes('match')) {
    return 'event'
  }

  if (lowerName.includes('team') || lowerName.includes('opponent')) {
    return 'team'
  }

  if (lowerName.includes('date')) {
    return 'date'
  }

  // Check sample data
  const sampleValues = data.slice(0, 10).map(row => row[columnKey]).filter(val => val != null)

  if (sampleValues.length === 0) {
    return 'text'
  }

  // Check if all samples are numbers
  const allNumbers = sampleValues.every(val => !isNaN(Number(val)))
  if (allNumbers) {
    return 'number'
  }

  // Check if samples look like dates
  const allDates = sampleValues.every(val => {
    const date = new Date(val)
    return date instanceof Date && !isNaN(date.getTime())
  })
  if (allDates) {
    return 'date'
  }

  // Default to text
  return 'text'
}

/**
 * Convert spreadsheet row values to appropriate types based on schema
 */
export function convertRowTypes(
  row: SpreadsheetRow,
  schema: ColumnDefinition[]
): SpreadsheetRow {
  const converted: SpreadsheetRow = { ...row }

  schema.forEach(col => {
    const value = row[col.id]

    if (value === null || value === undefined || value === '') {
      converted[col.id] = null
      return
    }

    switch (col.type) {
      case 'number':
        converted[col.id] = Number(value)
        break
      case 'date':
        if (typeof value === 'string') {
          converted[col.id] = new Date(value)
        }
        break
      case 'formula':
        // Formulas are calculated, not imported
        break
      default:
        converted[col.id] = value
    }
  })

  return converted
}

/**
 * Validate and map person names to IDs
 */
export async function mapPersonNames(
  data: SpreadsheetRow[],
  schema: ColumnDefinition[],
  personLookup: Map<string, string> // Map of person name to ID
): Promise<{
  mappedData: SpreadsheetRow[]
  unmappedNames: Set<string>
}> {
  const unmappedNames = new Set<string>()
  const personColumns = schema.filter(col => col.type === 'person')

  const mappedData = data.map(row => {
    const newRow = { ...row }

    personColumns.forEach(col => {
      const nameValue = row[col.id]

      if (nameValue && typeof nameValue === 'string') {
        const personId = personLookup.get(nameValue.trim())

        if (personId) {
          newRow[col.id] = personId
        } else {
          unmappedNames.add(nameValue)
        }
      }
    })

    return newRow
  })

  return { mappedData, unmappedNames }
}
