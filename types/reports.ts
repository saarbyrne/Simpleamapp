// Shared types for reports functionality

export interface ReportConfig {
  dataSources?: Array<{
    type: 'spreadsheet' | 'form' | 'event' | 'player' | 'note'
    id?: string
    name?: string
  }>
  visualization?: 'line' | 'bar' | 'pie' | 'heatmap' | 'table' | 'area' | 'scatter'
  xAxis?: string
  yAxis?: string
  filters?: {
    dateRange?: { from: string; to?: string }
    players?: string[]
    tags?: string[]
    [key: string]: any
  }
  chartOptions?: {
    title?: string
    showLegend?: boolean
    showDataLabels?: boolean
    colorScheme?: string[]
    aggregation?: 'sum' | 'average' | 'count' | 'min' | 'max'
  }
  kpis?: Array<{
    id: string
    label: string
    metric: string
    format?: 'number' | 'percentage' | 'currency'
  }>
}

export interface ReportSection {
  id: string
  type: 'chart' | 'table' | 'stats' | 'text'
  size?: 'full' | 'half' | 'third'
  config: ReportConfig
}