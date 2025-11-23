'use client'

import { useState, useEffect } from 'react'
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
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Users,
  StickyNote,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Table,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { cn } from '@/components/ui/utils'
import type { CreateReportData } from '@/app/actions/reports'

interface DataSource {
  id: string
  name: string
  type: 'form' | 'spreadsheet' | 'event' | 'player' | 'note'
}

interface ReportBuilderWizardProps {
  availableForms: DataSource[]
  availableSpreadsheets: DataSource[]
  onComplete: (data: CreateReportData) => void
  onCancel: () => void
}

export function ReportBuilderWizard({
  availableForms,
  availableSpreadsheets,
  onComplete,
  onCancel,
}: ReportBuilderWizardProps) {
  const [step, setStep] = useState(1)
  const [reportName, setReportName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null)
  const [dataSourceType, setDataSourceType] = useState<'form' | 'spreadsheet' | 'event' | 'player'>('form')
  const [visualization, setVisualization] = useState<'line' | 'bar' | 'pie' | 'area' | 'table'>('bar')
  const [xAxis, setXAxis] = useState('createdAt')
  const [yAxis, setYAxis] = useState('value')
  const [dateRangePreset, setDateRangePreset] = useState('last_30_days')
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()
  const [aggregation, setAggregation] = useState<'sum' | 'average' | 'count'>('average')

  const dataSourceIcon = {
    form: FileText,
    spreadsheet: FileSpreadsheet,
    event: Calendar,
    player: Users,
    note: StickyNote,
  }

  const getAvailableDataSources = (): DataSource[] => {
    switch (dataSourceType) {
      case 'form':
        return availableForms
      case 'spreadsheet':
        return availableSpreadsheets
      case 'event':
        return [{ id: 'all-events', name: 'All Events', type: 'event' }]
      case 'player':
        return [{ id: 'all-players', name: 'All Players', type: 'player' }]
      default:
        return []
    }
  }

  const getXAxisOptions = () => {
    switch (dataSourceType) {
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

  const getYAxisOptions = () => {
    switch (dataSourceType) {
      case 'form':
        return [
          { value: 'data.wellness_score', label: 'Wellness Score' },
          { value: 'data.sleep_hours', label: 'Sleep Hours' },
          { value: 'data.soreness_level', label: 'Soreness Level' },
          { value: 'data.energy_level', label: 'Energy Level' },
        ]
      case 'event':
        return [
          { value: 'attendanceRate', label: 'Attendance Rate (%)' },
          { value: 'attended', label: 'Attended Count' },
        ]
      case 'player':
      case 'spreadsheet':
        return [
          { value: 'value', label: 'Value' },
        ]
      default:
        return []
    }
  }

  const handleComplete = () => {
    const reportType = visualization === 'table' ? 'table' : 'single_chart'

    // Build date range filter
    let dateRangeFilter
    if (dateRangePreset === 'custom' && customDateRange?.from) {
      dateRangeFilter = {
        from: customDateRange.from.toISOString(),
        to: customDateRange.to?.toISOString(),
      }
    } else if (dateRangePreset !== 'all_time') {
      dateRangeFilter = { from: dateRangePreset }
    }

    const reportData: CreateReportData = {
      name: reportName,
      description: description || undefined,
      type: reportType,
      config: {
        dataSources: selectedDataSource
          ? [{
              type: selectedDataSource.type,
              id: selectedDataSource.id !== 'all-events' && selectedDataSource.id !== 'all-players'
                ? selectedDataSource.id
                : undefined,
              name: selectedDataSource.name,
            }]
          : [],
        visualization,
        xAxis,
        yAxis,
        filters: {
          dateRange: dateRangeFilter,
        },
        chartOptions: {
          title: reportName,
          showLegend: true,
          showDataLabels: false,
          aggregation,
        },
      },
    }

    onComplete(reportData)
  }

  const canProceedToStep2 = reportName.trim().length > 0
  const canProceedToStep3 = selectedDataSource !== null
  const canComplete = canProceedToStep3 && visualization !== null

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {step > 1 ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span className="ms-2 text-sm font-medium">Basic Info</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {step > 2 ? <Check className="h-4 w-4" /> : '2'}
          </div>
          <span className="ms-2 text-sm font-medium">Data Source</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            3
          </div>
          <span className="ms-2 text-sm font-medium">Visualization</span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
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
      )}

      {/* Step 2: Data Source Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Data Source</CardTitle>
              <CardDescription>Select what type of data you want to visualize</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(['form', 'spreadsheet', 'event', 'player'] as const).map((type) => {
                  const Icon = dataSourceIcon[type]
                  return (
                    <Card
                      key={type}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        dataSourceType === type ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setDataSourceType(type)
                        setSelectedDataSource(null)
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium capitalize">{type}s</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="space-y-2">
                <Label>Select {dataSourceType}</Label>
                <Select
                  value={selectedDataSource?.id || ''}
                  onValueChange={(value) => {
                    const source = getAvailableDataSources().find(s => s.id === value)
                    setSelectedDataSource(source || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Choose a ${dataSourceType}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDataSources().map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getAvailableDataSources().length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No {dataSourceType}s available. Create one first.
                  </p>
                )}
              </div>

              {selectedDataSource && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedDataSource.type}</Badge>
                    <p className="text-sm font-medium">{selectedDataSource.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This report will visualize data from this {selectedDataSource.type}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
              <CardDescription>Filter data by time period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preset Range</Label>
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
              </div>

              {dateRangePreset === 'custom' && (
                <div>
                  <Label>Custom Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-start font-normal mt-2',
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
                    <PopoverContent className="w-auto p-0 min-w-[600px]" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={customDateRange?.from}
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        numberOfMonths={2}
                        className="flex"
                      />
                      {customDateRange && (
                        <div className="border-t p-3 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCustomDateRange(undefined)}
                            className="h-8"
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Visualization Configuration */}
      {step === 3 && (
        <div className="space-y-6">
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
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        visualization === viz.value ? 'ring-2 ring-primary' : ''
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

                <div>
                  <Label>Y-Axis (Vertical)</Label>
                  <Select value={yAxis} onValueChange={setYAxis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getYAxisOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
