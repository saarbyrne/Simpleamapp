'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Table,
  Plus,
  Trash2,
  GripVertical,
  LayoutGrid,
} from 'lucide-react'
import type { ReportSection } from '@/types/reports'

interface DashboardBuilderProps {
  sections: ReportSection[]
  onSectionsChange: (sections: ReportSection[]) => void
  availableMetrics: Array<{ value: string; label: string }>
  dataSourceType: 'form' | 'spreadsheet' | 'event' | 'player'
}

const VISUALIZATION_OPTIONS = [
  { value: 'line', label: 'Line Chart', icon: LineChart },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'area', label: 'Area Chart', icon: TrendingUp },
  { value: 'pie', label: 'Pie Chart', icon: PieChart },
  { value: 'table', label: 'Table', icon: Table },
]

const SIZE_OPTIONS = [
  { value: 'full', label: 'Full Width', cols: 'col-span-12' },
  { value: 'half', label: 'Half Width', cols: 'col-span-6' },
  { value: 'third', label: 'Third Width', cols: 'col-span-4' },
]

export function DashboardBuilder({
  sections,
  onSectionsChange,
  availableMetrics,
  dataSourceType,
}: DashboardBuilderProps) {
  const addSection = () => {
    const newSection: ReportSection = {
      id: `section-${Date.now()}`,
      type: 'chart',
      size: 'half',
      config: {
        visualization: 'bar',
        xAxis: 'createdAt',
        yAxis: availableMetrics[0]?.value || 'value',
        chartOptions: {
          title: `Chart ${sections.length + 1}`,
          showLegend: true,
          showDataLabels: false,
          aggregation: 'average',
        },
      },
    }
    onSectionsChange([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<ReportSection>) => {
    onSectionsChange(
      sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      )
    )
  }

  const removeSection = (id: string) => {
    onSectionsChange(sections.filter(section => section.id !== id))
  }

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id)
    if (index === -1) return

    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSections.length) return

    ;[newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ]

    onSectionsChange(newSections)
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

  return (
    <div className="space-y-4">
      {/* Dashboard Preview Grid */}
      {sections.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <CardTitle className="text-sm">Dashboard Layout Preview</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Showing {sections.length} section{sections.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-3">
              {sections.map((section, index) => {
                const sizeOption = SIZE_OPTIONS.find(s => s.value === section.size)
                const Icon = VISUALIZATION_OPTIONS.find(v => v.value === section.config.visualization)?.icon || BarChart3

                return (
                  <div
                    key={section.id}
                    className={`${sizeOption?.cols || 'col-span-6'} min-h-[80px] border-2 border-dashed border-primary/30 rounded-lg p-3 flex flex-col items-center justify-center gap-2 bg-background`}
                  >
                    <Icon className="h-6 w-6 text-primary/60" />
                    <p className="text-xs font-medium text-center">
                      {section.config.chartOptions?.title || `Chart ${index + 1}`}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {sizeOption?.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Configuration Cards */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const Icon = VISUALIZATION_OPTIONS.find(v => v.value === section.config.visualization)?.icon || BarChart3

          return (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Icon className="h-4 w-4" />
                    <CardTitle className="text-sm">
                      Section {index + 1}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Chart Type */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Chart Type</Label>
                    <Select
                      value={section.config.visualization}
                      onValueChange={(value: any) =>
                        updateSection(section.id, {
                          config: {
                            ...section.config,
                            visualization: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VISUALIZATION_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Width</Label>
                    <Select
                      value={section.size}
                      onValueChange={(value: any) =>
                        updateSection(section.id, { size: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Chart Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Chart Title</Label>
                  <Input
                    value={section.config.chartOptions?.title || ''}
                    onChange={(e) =>
                      updateSection(section.id, {
                        config: {
                          ...section.config,
                          chartOptions: {
                            ...section.config.chartOptions,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Enter chart title"
                    className="h-9"
                  />
                </div>

                {section.config.visualization !== 'table' && (
                  <div className="grid grid-cols-3 gap-3">
                    {/* X Axis */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">X-Axis</Label>
                      <Select
                        value={section.config.xAxis}
                        onValueChange={(value) =>
                          updateSection(section.id, {
                            config: { ...section.config, xAxis: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getXAxisOptions().map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Y Axis */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Y-Axis</Label>
                      <Select
                        value={section.config.yAxis}
                        onValueChange={(value) =>
                          updateSection(section.id, {
                            config: { ...section.config, yAxis: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMetrics.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Aggregation */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Aggregation</Label>
                      <Select
                        value={section.config.chartOptions?.aggregation || 'average'}
                        onValueChange={(value: any) =>
                          updateSection(section.id, {
                            config: {
                              ...section.config,
                              chartOptions: {
                                ...section.config.chartOptions,
                                aggregation: value,
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="sum">Sum</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Section Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={addSection}
      >
        <Plus className="h-4 w-4 me-2" />
        Add Chart Section
      </Button>

      {sections.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">No charts added yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add multiple charts to create a comprehensive dashboard
            </p>
            <Button onClick={addSection}>
              <Plus className="h-4 w-4 me-2" />
              Add Your First Chart
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
