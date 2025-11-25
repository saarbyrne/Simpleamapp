'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer } from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, Users, Calendar } from 'lucide-react'

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

// Sample data for demonstration - in production this would come from the workspace config
const generateSampleData = (timePeriod: string) => {
  const periods = {
    last7Days: 7,
    last30Days: 30,
    last90Days: 90,
    custom: 14,
  }

  const days = periods[timePeriod as keyof typeof periods] || 7

  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    wellness: Math.floor(Math.random() * 40) + 60,
    trainingLoad: Math.floor(Math.random() * 500) + 300,
    fatigue: Math.floor(Math.random() * 30) + 20,
    soreness: Math.floor(Math.random() * 25) + 15,
  }))
}

export function ReportRenderer({ workspace }: ReportRendererProps) {
  const artifactData = workspace.artifactData
  const reportConfig = artifactData?.reportConfig

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

  const {
    title = 'Report',
    timePeriod = 'last7Days',
    metrics = [],
    visualizationType = 'line',
    charts = [],
    kpis = [],
  } = reportConfig

  // Generate sample data based on time period
  const sampleData = generateSampleData(timePeriod)

  // Create chart config for recharts
  const chartConfig = {
    wellness: { label: 'Wellness', color: COLORS[0] },
    trainingLoad: { label: 'Training Load', color: COLORS[1] },
    fatigue: { label: 'Fatigue', color: COLORS[2] },
    soreness: { label: 'Soreness', color: COLORS[3] },
  }

  const renderKPIs = () => {
    if (!kpis || kpis.length === 0) {
      // Generate default KPIs from metrics
      const defaultKPIs = metrics.slice(0, 4).map((metric: string) => ({
        label: `Average ${metric}`,
        value: 'N/A',
        format: 'number',
      }))

      if (defaultKPIs.length === 0) return null

      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {defaultKPIs.map((kpi: any, index: number) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  Connect to data source to populate
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi: any, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.change && (
                <div className="flex items-center text-xs text-muted-foreground">
                  {kpi.change > 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span>{Math.abs(kpi.change)}% from last period</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderChart = (chartData: any, index: number) => {
    const chartType = chartData?.type || visualizationType
    const chartTitle = chartData?.title || `${metrics.join(', ')} Over Time`
    const series = chartData?.series || metrics

    return (
      <Card key={index}>
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>
            Data for the {timePeriod.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            {chartType === 'line' && (
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((metric: string, idx: number) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            )}

            {chartType === 'bar' && (
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((metric: string, idx: number) => (
                  <Bar key={metric} dataKey={metric} fill={COLORS[idx % COLORS.length]} />
                ))}
              </BarChart>
            )}

            {chartType === 'area' && (
              <AreaChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((metric: string, idx: number) => (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={COLORS[idx % COLORS.length]}
                    fill={COLORS[idx % COLORS.length]}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={series.map((metric: string, idx: number) => ({
                    name: metric,
                    value: sampleData.reduce((sum, d) => sum + (d[metric as keyof typeof d] as number || 0), 0) / sampleData.length,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {series.map((metric: string, idx: number) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <Badge variant="outline">{timePeriod.replace(/([A-Z])/g, ' $1')}</Badge>
        </div>
        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric: string) => (
              <Badge key={metric} variant="secondary">
                {metric}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* KPIs */}
      {renderKPIs()}

      {/* Charts */}
      <div className="grid gap-6">
        {charts && charts.length > 0 ? (
          charts.map((chart: any, index: number) => renderChart(chart, index))
        ) : (
          // Default chart if none specified
          <>{renderChart({}, 0)}</>
        )}
      </div>

    </div>
  )
}
