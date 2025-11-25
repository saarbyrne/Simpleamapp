'use client'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { EntityMultiSelect, Entity } from '@/components/notes/entity-multi-select'
import { LineChart, BarChart3, PieChart, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReportInputs {
  timePeriod: string
  playerIds: string[]
  metrics: string[]
  visualizationType: string
}

interface ReportInputsFormProps {
  inputs: ReportInputs
  onChange: (inputs: ReportInputs) => void
  availablePlayers?: Entity[]
  isLoadingPlayers?: boolean
}

const TIME_PERIODS = [
  { value: 'last7Days', label: 'Last 7 days' },
  { value: 'last30Days', label: 'Last 30 days' },
  { value: 'last90Days', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
]

const METRICS = [
  { value: 'wellness', label: 'Wellness Score' },
  { value: 'trainingLoad', label: 'Training Load' },
  { value: 'fatigue', label: 'Fatigue Level' },
  { value: 'soreness', label: 'Soreness' },
  { value: 'sleep', label: 'Sleep Quality' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'stress', label: 'Stress Level' },
  { value: 'performance', label: 'Performance' },
]

const VISUALIZATION_TYPES = [
  {
    value: 'line',
    label: 'Line Chart',
    description: 'Show trends over time',
    icon: LineChart,
  },
  {
    value: 'bar',
    label: 'Bar Chart',
    description: 'Compare values',
    icon: BarChart3,
  },
  {
    value: 'area',
    label: 'Area Chart',
    description: 'Show cumulative data',
    icon: Activity,
  },
  {
    value: 'pie',
    label: 'Pie Chart',
    description: 'Show proportions',
    icon: PieChart,
  },
]

export function ReportInputsForm({
  inputs,
  onChange,
  availablePlayers = [],
  isLoadingPlayers = false,
}: ReportInputsFormProps) {
  const updateInput = (field: keyof ReportInputs, value: any) => {
    onChange({ ...inputs, [field]: value })
  }

  const toggleMetric = (metric: string) => {
    const newMetrics = inputs.metrics.includes(metric)
      ? inputs.metrics.filter((m) => m !== metric)
      : [...inputs.metrics, metric]
    updateInput('metrics', newMetrics)
  }

  return (
    <div className="space-y-6">
      {/* Time Period */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Time Period</Label>
        <div className="flex flex-wrap gap-2">
          {TIME_PERIODS.map((period) => (
            <Badge
              key={period.value}
              variant={inputs.timePeriod === period.value ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent"
              onClick={() => updateInput('timePeriod', period.value)}
            >
              {period.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Players */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Players</Label>
        <EntityMultiSelect
          entities={availablePlayers}
          selectedIds={inputs.playerIds}
          onChange={(ids) => updateInput('playerIds', ids)}
          placeholder="Select players"
          emptyMessage="No players found"
          entityType="player"
          isLoading={isLoadingPlayers}
        />
        {inputs.playerIds.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Leave empty for all players
          </p>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Metrics to Include</Label>
        <div className="space-y-2">
          {METRICS.map((metric) => (
            <div key={metric.value} className="flex items-center space-x-2">
              <Checkbox
                id={`metric-${metric.value}`}
                checked={inputs.metrics.includes(metric.value)}
                onCheckedChange={() => toggleMetric(metric.value)}
              />
              <label
                htmlFor={`metric-${metric.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {metric.label}
              </label>
            </div>
          ))}
        </div>
        {inputs.metrics.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Select at least one metric
          </p>
        )}
      </div>

      {/* Visualization Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Visualization Type</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {VISUALIZATION_TYPES.map((viz) => {
            const Icon = viz.icon
            return (
              <Card
                key={viz.value}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  inputs.visualizationType === viz.value &&
                    'border-primary bg-primary/5'
                )}
                onClick={() => updateInput('visualizationType', viz.value)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={cn(
                      'rounded-lg p-2',
                      inputs.visualizationType === viz.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{viz.label}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {viz.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
