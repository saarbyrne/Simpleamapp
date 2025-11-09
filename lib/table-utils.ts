/**
 * Table utility functions for export and data manipulation
 */

export interface ExportOptions {
  filename?: string
  includeHeaders?: boolean
}

/**
 * Export table data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: { accessorKey?: string; header: string }[],
  options: ExportOptions = {}
): void {
  const { filename = 'export.csv', includeHeaders = true } = options

  // Get visible columns with headers
  const headers = columns.map((col) => col.header)

  // Convert data to CSV rows
  const csvRows: string[] = []

  // Add headers
  if (includeHeaders) {
    csvRows.push(headers.map((h) => escapeCSVValue(h)).join(','))
  }

  // Add data rows
  data.forEach((row) => {
    const values = columns.map((col) => {
      const value = col.accessorKey ? getNestedValue(row, col.accessorKey) : ''
      return escapeCSVValue(value)
    })
    csvRows.push(values.join(','))
  })

  // Create blob and download
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export table data to JSON format
 */
export function exportToJSON<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  const { filename = 'export.json' } = options

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export table data to PDF format
 * Note: This is a simplified version. For production, consider using a library like jsPDF or pdfmake
 */
export async function exportToPDF<T extends Record<string, any>>(
  data: T[],
  columns: { accessorKey?: string; header: string }[],
  options: ExportOptions = {}
): Promise<void> {
  const { filename = 'export.pdf' } = options

  // For a proper PDF export, you'd want to use a library like jsPDF
  // This is a placeholder that creates a simple HTML table and prints it
  // In production, you should install and use: npm install jspdf jspdf-autotable

  // Create a temporary table element
  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.width = '100%'

  // Create header row
  const headerRow = document.createElement('tr')
  columns.forEach((col) => {
    const th = document.createElement('th')
    th.textContent = col.header
    th.style.border = '1px solid #000'
    th.style.padding = '8px'
    th.style.textAlign = 'left'
    headerRow.appendChild(th)
  })
  table.appendChild(headerRow)

  // Create data rows
  data.forEach((row) => {
    const tr = document.createElement('tr')
    columns.forEach((col) => {
      const td = document.createElement('td')
      const value = col.accessorKey ? getNestedValue(row, col.accessorKey) : ''
      td.textContent = String(value ?? '')
      td.style.border = '1px solid #000'
      td.style.padding = '8px'
      tr.appendChild(td)
    })
    table.appendChild(tr)
  })

  // Create a new window with the table
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
            }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>
          ${table.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // Note: For a proper PDF download, use jsPDF:
  // import jsPDF from 'jspdf'
  // import 'jspdf-autotable'
  // const doc = new jsPDF()
  // doc.autoTable({ head: [headers], body: dataRows })
  // doc.save(filename)
}

/**
 * Helper function to get nested object values by path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Get unique values from an array of objects for filter options
 */
export function getUniqueValues<T>(
  data: T[],
  accessor: (item: T) => string | null | undefined
): string[] {
  return Array.from(new Set(data.map(accessor).filter(Boolean) as string[])).sort()
}

