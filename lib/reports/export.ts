// CSV Export Utility for Reports

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Handle different value types
        if (value === null || value === undefined) {
          return ''
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }
        const stringValue = String(value)
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function formatChartDataForExport(chartData: any[], reportName: string) {
  return chartData.map(item => ({
    'Report': reportName,
    'Category': item.name || '',
    'Value': item.value || 0,
    'Exported At': new Date().toISOString(),
  }))
}
