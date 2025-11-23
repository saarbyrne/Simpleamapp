import {
  fetchFormData,
  fetchSpreadsheetData,
  fetchEventData,
  fetchPlayerData,
  aggregateByDateGroup,
  aggregateByGroup,
  calculatePercentage,
  type DataSourceConfig,
  type FilterConfig,
} from './data-aggregator'
import type { ReportConfig } from '@/app/actions/reports'

// ============================================
// REPORT DATA QUERY BUILDER
// ============================================

export interface ReportDataResult {
  chartData: any[]
  tableData?: any[]
  kpis?: Record<string, number>
  metadata: {
    totalRecords: number
    dateRange: { from: Date; to: Date }
    lastUpdated: Date
  }
}

export async function buildReportData(
  config: ReportConfig,
  organizationId: string,
  filters?: FilterConfig
): Promise<ReportDataResult> {
  // Merge config filters with runtime filters
  const mergedFilters = mergeFilters(config.filters || {}, filters)

  // Fetch raw data based on data sources
  const rawData = await fetchRawDataForSources(
    config.dataSources || [],
    organizationId,
    mergedFilters
  )

  // Aggregate and transform based on visualization type and config
  const chartData = await transformDataForVisualization(config, rawData)

  // Calculate KPIs if configured
  const kpis = config.kpis ? calculateKPIs(config.kpis, rawData) : undefined

  // Generate table data if needed
  const tableData = config.visualization === 'table' ? rawData.flat() : undefined

  // Calculate metadata
  const allDates = extractAllDates(rawData)
  const metadata = {
    totalRecords: rawData.flat().length,
    dateRange: {
      from: allDates.length > 0 ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date(),
      to: allDates.length > 0 ? new Date(Math.max(...allDates.map(d => d.getTime()))) : new Date(),
    },
    lastUpdated: new Date(),
  }

  return {
    chartData,
    tableData,
    kpis,
    metadata,
  }
}

// ============================================
// DATA FETCHING
// ============================================

async function fetchRawDataForSources(
  dataSources: DataSourceConfig[],
  organizationId: string,
  filters?: FilterConfig
): Promise<any[][]> {
  const results: any[][] = []

  for (const source of dataSources) {
    let data: any[] = []

    switch (source.type) {
      case 'form':
        data = await fetchFormData(organizationId, source.id, filters)
        break

      case 'spreadsheet':
        const sheets = await fetchSpreadsheetData(organizationId, source.id, filters)
        data = sheets.flatMap(sheet => sheet.rows)
        break

      case 'event':
        data = await fetchEventData(organizationId, filters)
        break

      case 'player':
        data = await fetchPlayerData(organizationId, filters)
        break

      case 'note':
        // Notes data fetching not implemented yet
        data = []
        break
    }

    results.push(data)
  }

  return results
}

// ============================================
// DATA TRANSFORMATION
// ============================================

async function transformDataForVisualization(
  config: ReportConfig,
  rawDataArrays: any[][]
): Promise<any[]> {
  const flatData = rawDataArrays.flat()

  if (flatData.length === 0) {
    return []
  }

  const visualization = config.visualization || 'bar'
  const xAxis = config.xAxis || 'createdAt'
  const yAxis = config.yAxis || 'value'
  const aggregation = config.chartOptions?.aggregation || 'sum'

  switch (visualization) {
    case 'line':
    case 'area':
      // Time-series data
      return aggregateByDateGroup(flatData, xAxis, yAxis, aggregation, 'day')
        .map(item => ({
          name: item.date,
          value: Math.round(item.value * 100) / 100,
        }))

    case 'bar':
      // Categorical or time-based data
      if (xAxis === 'createdAt' || xAxis === 'start' || xAxis === 'date') {
        return aggregateByDateGroup(flatData, xAxis, yAxis, aggregation, 'day')
          .map(item => ({
            name: item.date,
            value: Math.round(item.value * 100) / 100,
          }))
      } else {
        return aggregateByGroup(flatData, xAxis, yAxis, aggregation)
          .map(item => ({
            name: item.group,
            value: Math.round(item.value * 100) / 100,
          }))
      }

    case 'pie':
      // Categorical distribution
      return aggregateByGroup(flatData, xAxis, yAxis, aggregation)
        .slice(0, 10) // Limit to top 10 for readability
        .map(item => ({
          name: item.group,
          value: Math.round(item.value * 100) / 100,
        }))

    case 'heatmap':
      // Matrix data (player x date)
      return transformToHeatmapData(flatData, config)

    case 'table':
      // Raw data with optional aggregation
      return flatData

    default:
      return aggregateByDateGroup(flatData, xAxis, yAxis, aggregation, 'day')
        .map(item => ({
          name: item.date,
          value: Math.round(item.value * 100) / 100,
        }))
  }
}

function transformToHeatmapData(data: any[], config: ReportConfig): any[] {
  // Heatmap format: { player: string, date: string, value: number }
  const xAxis = config.xAxis || 'playerName'
  const yAxis = config.yAxis || 'createdAt'
  const valueField = 'data.wellness_score' // Default wellness field

  return data.map(item => ({
    player: item[xAxis] || item.playerName || 'Unknown',
    date: new Date(item[yAxis] || item.createdAt).toISOString().split('T')[0],
    value: extractValue(item, valueField) || 0,
  }))
}

// ============================================
// KPI CALCULATION
// ============================================

function calculateKPIs(
  kpiConfigs: Array<{ id: string; label: string; metric: string; format?: string }>,
  rawDataArrays: any[][]
): Record<string, number> {
  const flatData = rawDataArrays.flat()
  const kpis: Record<string, number> = {}

  for (const kpiConfig of kpiConfigs) {
    const { id, metric } = kpiConfig

    switch (metric) {
      case 'count':
        kpis[id] = flatData.length
        break

      case 'average':
        const values = flatData
          .map(item => extractValue(item, id))
          .filter(v => v !== null) as number[]
        kpis[id] = values.length > 0
          ? Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100) / 100
          : 0
        break

      case 'sum':
        const sumValues = flatData
          .map(item => extractValue(item, id))
          .filter(v => v !== null) as number[]
        kpis[id] = Math.round(sumValues.reduce((sum, v) => sum + v, 0) * 100) / 100
        break

      case 'percentage':
        // Custom percentage calculation (e.g., attendance rate)
        kpis[id] = calculateCustomPercentage(flatData, id)
        break

      case 'min':
        const minValues = flatData
          .map(item => extractValue(item, id))
          .filter(v => v !== null) as number[]
        kpis[id] = minValues.length > 0 ? Math.min(...minValues) : 0
        break

      case 'max':
        const maxValues = flatData
          .map(item => extractValue(item, id))
          .filter(v => v !== null) as number[]
        kpis[id] = maxValues.length > 0 ? Math.max(...maxValues) : 0
        break
    }
  }

  return kpis
}

function calculateCustomPercentage(data: any[], metricId: string): number {
  // Handle specific percentage calculations
  if (metricId === 'attendance_rate' || metricId.includes('attendance')) {
    const totalInvited = data.reduce((sum, item) => sum + (item.totalInvited || 0), 0)
    const attended = data.reduce((sum, item) => sum + (item.attended || 0), 0)
    return totalInvited > 0 ? Math.round((attended / totalInvited) * 100 * 100) / 100 : 0
  }

  // Default: count of truthy values / total
  const truthy = data.filter(item => !!extractValue(item, metricId)).length
  return data.length > 0 ? Math.round((truthy / data.length) * 100 * 100) / 100 : 0
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function mergeFilters(configFilters: any, runtimeFilters?: FilterConfig): FilterConfig {
  return {
    dateRange: runtimeFilters?.dateRange || configFilters.dateRange,
    playerIds: runtimeFilters?.playerIds || configFilters.players,
    eventTypes: runtimeFilters?.eventTypes || configFilters.eventTypes,
    tags: runtimeFilters?.tags || configFilters.tags,
    status: runtimeFilters?.status || configFilters.status,
  }
}

function extractValue(item: any, field: string): number | null {
  const keys = field.split('.')
  let value: any = item

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      return null
    }
  }

  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }
  if (typeof value === 'boolean') return value ? 1 : 0

  return null
}

function extractAllDates(rawDataArrays: any[][]): Date[] {
  const dates: Date[] = []
  const flatData = rawDataArrays.flat()

  flatData.forEach(item => {
    const dateFields = ['createdAt', 'updatedAt', 'start', 'date']
    for (const field of dateFields) {
      if (item[field]) {
        const date = new Date(item[field])
        if (!isNaN(date.getTime())) {
          dates.push(date)
          break
        }
      }
    }
  })

  return dates
}

// ============================================
// PRESET QUERY BUILDERS (for templates)
// ============================================

export async function buildAttendanceReport(
  organizationId: string,
  filters?: FilterConfig
): Promise<ReportDataResult> {
  const config: ReportConfig = {
    dataSources: [{ type: 'event', name: 'Events & Attendance' }],
    visualization: 'bar',
    xAxis: 'eventType',
    yAxis: 'attendanceRate',
    chartOptions: {
      aggregation: 'average',
      title: 'Attendance Rate by Event Type',
    },
    kpis: [
      { id: 'overall_rate', label: 'Overall Rate', metric: 'percentage', format: 'percentage' },
      { id: 'attended', label: 'Total Attended', metric: 'sum' },
      { id: 'totalInvited', label: 'Total Invited', metric: 'sum' },
    ],
  }

  return buildReportData(config, organizationId, filters)
}

export async function buildWellnessReport(
  organizationId: string,
  formId: string,
  filters?: FilterConfig
): Promise<ReportDataResult> {
  const config: ReportConfig = {
    dataSources: [{ type: 'form', id: formId, name: 'Wellness Forms' }],
    visualization: 'line',
    xAxis: 'createdAt',
    yAxis: 'data.wellness_score',
    chartOptions: {
      aggregation: 'average',
      title: 'Wellness Trend',
    },
  }

  return buildReportData(config, organizationId, filters)
}
