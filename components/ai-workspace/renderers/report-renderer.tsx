'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface ReportRendererProps {
  workspace: any
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function ReportRenderer({ workspace }: ReportRendererProps) {
  const reportConfig = workspace.artifactData?.reportConfig
  const [data, setData] = useState<{
    chartData: any[]
    kpis?: any[]
    metadata?: any
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Load real data from the new endpoint
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/reports/data?workspaceId=${workspace.id}`
        )
        if (!res.ok) throw new Error('Failed to load report data')
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        console.error(e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    if (workspace?.artifactData?.reportConfig) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [workspace])

  // 2. Render helpers
  const renderKPIs = () => {
    if (!data?.kpis) return null

    // Convert KPIs object to array if needed, or use as is if it's already an array
    // The API returns kpis as a Record<string, number>, so we need to transform it
    // However, the reportConfig might have kpi definitions. 
    // Let's try to map the data.kpis (values) to the reportConfig.kpis (definitions)

    const kpiDefinitions = reportConfig?.kpis || []
    const kpiValues: Record<string, any> = data.kpis || {}

    // If we have definitions, use them to format the values
    if (kpiDefinitions.length > 0) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiDefinitions.map((kpiDef: any, i: number) => {
            const value = kpiValues[kpiDef.id] !== undefined ? kpiValues[kpiDef.id] : 'N/A'
            return (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpiDef.label}</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                  {/* We could add trend info here if available */}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )
    }

    // Fallback: just show whatever keys are in the data
    const kpiKeys = Object.keys(kpiValues)
    if (kpiKeys.length === 0) return null

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiKeys.map((key: string, i: number) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiValues[key]}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderChart = (chart: any, idx: number) => {
    const chartType = chart?.type || reportConfig?.visualizationType || 'line'
    // Use metrics from config or chart definition
    const series = chart?.series || reportConfig?.metrics || []
    const chartTitle = chart?.title || reportConfig?.title || 'Chart'

    // Chart config for Recharts
    const chartConfig = series.reduce((acc: any, metric: string, i: number) => {
      acc[metric] = {
        label: metric,
        color: COLORS[i % COLORS.length],
      }
      return acc
    }, {})

    return (
      <Card key={idx}>
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>
            Data for the {reportConfig?.timePeriod?.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <>
              {chartType === 'line' && (
                <LineChart data={data?.chartData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {series.map((metric: string, i: number) => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              )}
              {chartType === 'bar' && (
                <BarChart data={data?.chartData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {series.map((metric: string, i: number) => (
                    <Bar key={metric} dataKey={metric} fill={COLORS[i % COLORS.length]} />
                  ))}
                </BarChart>
              )}
              {chartType === 'area' && (
                <AreaChart data={data?.chartData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {series.map((metric: string, i: number) => (
                    <Area
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.6}
                    />
                  ))}
                </AreaChart>
              )}
              {chartType === 'pie' && (
                <PieChart>
                  <Pie
                    data={data?.chartData ?? []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data?.chartData?.map((_c: any, i: number) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              )}
            </>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  // 3. Main render
  if (!reportConfig) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Report Configuration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to generate a report
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p className="font-medium">Error loading report data</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // If we got data but it's empty, show a friendly placeholder
  const hasCharts = data?.chartData && data.chartData.length > 0
  const hasKPIs = data?.kpis && Object.keys(data.kpis).length > 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{reportConfig.title ?? 'Report'}</h2>
          <Badge variant="outline">{reportConfig.timePeriod?.replace(/([A-Z])/g, ' $1')}</Badge>
        </div>
        {reportConfig.metrics?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {reportConfig.metrics.map((m: string) => (
              <Badge key={m} variant="secondary">{m}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* KPIs */}
      {renderKPIs()}

      {/* Charts */}
      <div className="grid gap-6">
        {hasCharts ? (
          (reportConfig.charts?.length ? reportConfig.charts : [{}, {}]).map((chart: any, index: number) => renderChart(chart, index))
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Activity className="h-10 w-10 text-muted-foreground/50" />
              <div className="space-y-1">
                <h3 className="font-medium">No Data Available</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any data matching your criteria. Try adjusting the time period or filters, or ensure your forms have responses.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
