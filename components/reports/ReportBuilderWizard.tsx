'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Table,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar as CalendarIcon,
  LayoutGrid,
} from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { cn } from '@/components/ui/utils'
import type { CreateReportData } from '@/app/actions/reports'
import type { ReportSection } from '@/types/reports'
import { DashboardBuilder } from './DashboardBuilder'

export interface DataPoint {
  id: string
  label: string
  group: string
  type: 'form' | 'spreadsheet' | 'event' | 'player'
  sourceId?: string
  metricKey?: string
}

export interface Population {
  id: string
  label: string
  type: string
}

interface ReportBuilderWizardProps {
  dataPoints: DataPoint[]
  populations: Population[]
  onComplete: (data: CreateReportData) => void
  onCancel: () => void
  initialData?: Partial<CreateReportData>
}

export function ReportBuilderWizard({
  dataPoints,
  populations,
  onComplete,
  onCancel,
  initialData,
}: ReportBuilderWizardProps) {
  // Initialize state from initialData if available
  const [step, setStep] = useState(1)
  const [reportName, setReportName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [reportType, setReportType] = useState<'single_chart' | 'dashboard'>(
    initialData?.type === 'dashboard' ? 'dashboard' : 'single_chart'
  )

  // Extract initial config values
  const initialConfig = initialData?.config || {}
  const initialFilters = initialConfig.filters || {}

  // Determine initial data point
  // This is tricky because config stores generic dataSource, but we need the specific dataPoint ID
  // We might need to match by name or ID if it was preserved
  const initialDataSource = initialConfig.dataSources?.[0]
  const initialDataPointId = initialDataSource
    ? dataPoints.find(dp => dp.sourceId === initialDataSource.id && dp.metricKey === initialConfig.yAxis)?.id || ''
    : ''

  const [selectedDataPointId, setSelectedDataPointId] = useState(initialDataPointId)

  // Determine initial population
  let initialPopulationId = 'all'
  if (initialFilters.players && initialFilters.players.length > 0) {
    initialPopulationId = `player:${initialFilters.players[0]}`
  } else if (initialFilters.population) {
    initialPopulationId = initialFilters.population
  }

  const [selectedPopulationId, setSelectedPopulationId] = useState(initialPopulationId)

  // Date Range
  const initialDateRange = initialFilters.dateRange || { from: 'last_30_days' }
  const isCustomDate = initialDateRange.from && !['last_7_days', 'last_30_days', 'last_90_days', 'this_year', 'all_time'].includes(initialDateRange.from)

  const [dateRangePreset, setDateRangePreset] = useState<string>(
    isCustomDate ? 'custom' : (initialDateRange.from || 'last_30_days')
  )
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(
    isCustomDate ? {
      from: initialDateRange.from ? new Date(initialDateRange.from) : undefined,
      to: initialDateRange.to ? new Date(initialDateRange.to) : undefined
    } : undefined
  )

  const [visualization, setVisualization] = useState<'line' | 'bar' | 'pie' | 'area' | 'table'>(
    (initialConfig.visualization as 'line' | 'bar' | 'pie' | 'area' | 'table') || 'bar'
  )
  const [xAxis, setXAxis] = useState(initialConfig.xAxis || 'createdAt')
  const [aggregation, setAggregation] = useState<'sum' | 'average' | 'count'>(
    (initialConfig.chartOptions?.aggregation as 'sum' | 'average' | 'count') || 'average'
  )

  const [dashboardSections, setDashboardSections] = useState<ReportSection[]>(
    initialData?.sections || []
  )

  const getXAxisOptions = () => {
    const dp = dataPoints.find(d => d.id === selectedDataPointId)
    if (!dp) return []

    switch (dp.type) {
      case 'form':
        return [
          { value: 'createdAt', label: 'Date Submitted' },
          { value: 'playerName', label: 'Player' },
        ]
      case 'spreadsheet':
        return [
          { value: 'createdAt', label: 'Date' },
          { value: 'player', label: 'Player' },
        ]
      case 'event':
        return [
          { value: 'start', label: 'Event Date' },
          { value: 'eventType', label: 'Event Type' },
        ]
      case 'player':
        return [
          { value: 'position', label: 'Position' },
          { value: 'status', label: 'Status' },
        ]
      default:
        return []
    }
  }
  const handleComplete = () => {
    // Build filters
    const filters: any = {}

    // Date Range
    if (dateRangePreset === 'custom' && customDateRange) {
      filters.dateRange = {
        from: customDateRange.from ? format(customDateRange.from, 'yyyy-MM-dd') : undefined,
        to: customDateRange.to ? format(customDateRange.to, 'yyyy-MM-dd') : undefined,
      }
    } else if (dateRangePreset !== 'custom') {
      filters.dateRange = { from: dateRangePreset }
    }

    // Population
    if (selectedPopulationId && selectedPopulationId !== 'all') {
      if (selectedPopulationId.startsWith('player:')) {
        // Individual player
        filters.players = [selectedPopulationId.replace('player:', '')]
      } else if (selectedPopulationId.startsWith('position:')) {
        // Position group
        filters.population = selectedPopulationId.replace('position:', '')
      } else {
        // Fallback
        filters.population = selectedPopulationId
      }
    }

    // Helper to build config from data point
    const buildConfigFromDataPoint = (dpId: string) => {
      const dp = dataPoints.find(d => d.id === dpId)
      if (!dp) return null

      return {
        dataSources: [{
          type: dp.type,
          id: dp.sourceId,
          name: dp.label, // Changed from label to name to match DataPoint interface
        }],
        yAxis: dp.metricKey,
      }
    }

    let config
    if (reportType === 'dashboard') {
      config = {
        // For dashboard, we might want a default data source or just empty
        // But if sections are defined, they have their own config
        dataSources: [],
        filters,
      }
    } else {
      if (!selectedDataPointId) return
      const baseConfig = buildConfigFromDataPoint(selectedDataPointId)
      if (!baseConfig) return

      config = {
        ...baseConfig,
        visualization,
        xAxis,
        chartOptions: {
          title: reportName,
          showLegend: true,
          showDataLabels: false,
          aggregation,
        },
        filters, // Add filters to config
      }
    }

    const reportData: CreateReportData = {
      name: reportName,
      description: description || undefined,
      type: reportType === 'dashboard' ? 'dashboard' : visualization === 'table' ? 'table' : 'single_chart',
      config,
      sections: reportType === 'dashboard' ? dashboardSections : undefined,
    }

    onComplete(reportData)
  }

  const canProceedToStep2 = reportName.trim().length > 0
  const canProceedToStep3 = selectedDataPointId !== ''
  const canComplete = reportType === 'dashboard'
    ? canProceedToStep3 && dashboardSections.length > 0
    : canProceedToStep3 && visualization !== null

  // Group data points
  const groupedDataPoints = dataPoints.reduce((acc, dp) => {
    if (!acc[dp.group]) acc[dp.group] = []
    acc[dp.group].push(dp)
    return acc
  }, {} as Record<string, DataPoint[]>)

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
            {step > 1 ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span className="ms-2 text-sm font-medium">Basic Info</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
            {step > 2 ? <Check className="h-4 w-4" /> : '2'}
          </div>
          <span className="ms-2 text-sm font-medium">Data Selection</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
            3
          </div>
          <span className="ms-2 text-sm font-medium">Visualization</span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>Give your report a name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Report Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Weekly Wellness Trends"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this report shows..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Type</CardTitle>
              <CardDescription>Choose between a single chart or multi-chart dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${reportType === 'single_chart' ? 'ring-2 ring-primary' : ''
                    }`}
                  onClick={() => setReportType('single_chart')}
                >
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Single Chart</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      One visualization with detailed configuration
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${reportType === 'dashboard' ? 'ring-2 ring-primary' : ''
                    }`}
                  onClick={() => setReportType('dashboard')}
                >
                  <CardContent className="p-4 text-center">
                    <LayoutGrid className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Dashboard</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Multiple charts in a customizable layout
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Data Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Data</CardTitle>
              <CardDescription>Choose the data point and population you want to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Data Point Selection */}
              <div className="space-y-2">
                <Label>Data Point</Label>
                <Select value={selectedDataPointId} onValueChange={setSelectedDataPointId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a metric to visualize..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(groupedDataPoints).map(([group, items]) => (
                      <SelectGroup key={group}>
                        <SelectLabel>{group}</SelectLabel>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select a specific metric from your forms, spreadsheets, or other sources.
                </p>
              </div>

              {/* Population Selection */}
              <div className="space-y-2">
                <Label>Population</Label>
                <Select value={selectedPopulationId} onValueChange={setSelectedPopulationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select population..." />
                  </SelectTrigger>
                  <SelectContent>
                    {populations.map((pop) => (
                      <SelectItem key={pop.id} value={pop.id}>
                        {pop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Selection */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex flex-col gap-2">
                  <Select value={dateRangePreset} onValueChange={setDateRangePreset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_7_days">Last 7 days</SelectItem>
                      <SelectItem value="last_30_days">Last 30 days</SelectItem>
                      <SelectItem value="last_90_days">Last 90 days</SelectItem>
                      <SelectItem value="last_365_days">Last year</SelectItem>
                      <SelectItem value="all_time">All time</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>

                  {dateRangePreset === 'custom' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-start font-normal',
                            !customDateRange && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="me-2 h-4 w-4" />
                          {customDateRange?.from ? (
                            customDateRange.to ? (
                              <>
                                {format(customDateRange.from, 'LLL dd, y')} -{' '}
                                {format(customDateRange.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(customDateRange.from, 'LLL dd, y')
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={customDateRange?.from}
                          selected={customDateRange}
                          onSelect={setCustomDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Visualization Configuration */}
      {step === 3 && (
        <div className="space-y-6">
          {reportType === 'dashboard' ? (
            <DashboardBuilder
              sections={dashboardSections}
              onSectionsChange={setDashboardSections}
              availableMetrics={[]} // TODO: Pass all data points here for dashboard builder to use
              dataSourceType="form" // Placeholder, dashboard builder needs update to handle unified data points
            />
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Choose Visualization</CardTitle>
                  <CardDescription>Select how you want to display your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { value: 'bar', label: 'Bar Chart', icon: BarChart3, desc: 'Compare categories' },
                      { value: 'line', label: 'Line Chart', icon: LineChart, desc: 'Show trends over time' },
                      { value: 'area', label: 'Area Chart', icon: TrendingUp, desc: 'Filled line chart' },
                      { value: 'pie', label: 'Pie Chart', icon: PieChart, desc: 'Show proportions' },
                      { value: 'table', label: 'Table', icon: Table, desc: 'Detailed data view' },
                    ].map((viz) => {
                      const Icon = viz.icon
                      return (
                        <Card
                          key={viz.value}
                          className={`cursor-pointer transition-all hover:shadow-md ${visualization === viz.value ? 'ring-2 ring-primary' : ''
                            }`}
                          onClick={() => setVisualization(viz.value as any)}
                        >
                          <CardContent className="p-4 text-center">
                            <Icon className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm font-medium">{viz.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{viz.desc}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {visualization !== 'table' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chart Configuration</CardTitle>
                    <CardDescription>Customize what data to show</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>X-Axis (Horizontal)</Label>
                      <Select value={xAxis} onValueChange={setXAxis}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getXAxisOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Y-Axis is now determined by the Data Point selection */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Label className="text-muted-foreground">Y-Axis (Vertical)</Label>
                      <p className="font-medium mt-1">
                        {dataPoints.find(d => d.id === selectedDataPointId)?.label || 'Selected Metric'}
                      </p>
                    </div>

                    <div>
                      <Label>Aggregation Method</Label>
                      <Select value={aggregation} onValueChange={(v: any) => setAggregation(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="sum">Sum</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
          <ChevronLeft className="h-4 w-4 me-2" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
          >
            Next
            <ChevronRight className="h-4 w-4 ms-2" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={!canComplete}>
            <Check className="h-4 w-4 me-2" />
            Create Report
          </Button>
        )}
      </div>
    </div>
  )
}
