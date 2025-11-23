import jsPDF from 'jspdf'

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

// PDF Export Utility

interface PDFExportOptions {
  reportName: string
  description?: string
  metadata?: {
    totalRecords: number
    dateRange: { from: Date; to: Date }
  }
  kpis?: Record<string, number>
  chartData?: any[]
}

export async function exportToPDF(options: PDFExportOptions) {
  const { reportName, description, metadata, kpis, chartData } = options

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let currentY = 20

  // Add header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text(reportName, 20, currentY)
  currentY += 10

  if (description) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    const descLines = pdf.splitTextToSize(description, pageWidth - 40)
    pdf.text(descLines, 20, currentY)
    currentY += descLines.length * 7 + 5
  }

  // Add metadata
  if (metadata) {
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Total Records: ${metadata.totalRecords}`, 20, currentY)
    currentY += 6
    pdf.text(
      `Date Range: ${metadata.dateRange.from.toLocaleDateString()} - ${metadata.dateRange.to.toLocaleDateString()}`,
      20,
      currentY
    )
    currentY += 10
  }

  // Add KPIs
  if (kpis && Object.keys(kpis).length > 0) {
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Key Metrics', 20, currentY)
    currentY += 8

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    Object.entries(kpis).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      pdf.text(`${label}: ${value.toFixed(2)}`, 25, currentY)
      currentY += 6
    })
    currentY += 5
  }

  // Add chart data table if available
  if (chartData && chartData.length > 0) {
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Data', 20, currentY)
    currentY += 8

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    chartData.forEach((item, index) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage()
        currentY = 20
      }
      pdf.text(`${item.name}: ${item.value}`, 25, currentY)
      currentY += 6
    })
  }

  // Add footer
  pdf.setFontSize(8)
  pdf.setTextColor(150, 150, 150)
  pdf.text(
    `Generated on ${new Date().toLocaleString()}`,
    20,
    pageHeight - 10
  )

  // Save PDF
  pdf.save(`${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Print Utility

export function printReport(elementId: string, reportName: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  // Create a new window for printing
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    throw new Error('Failed to open print window')
  }

  // Clone the element
  const clone = element.cloneNode(true) as HTMLElement

  // Create print document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportName}</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .no-print {
              display: none !important;
            }
          }
          body {
            margin: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        </style>
      </head>
      <body>
        <h1>${reportName}</h1>
        ${clone.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}
