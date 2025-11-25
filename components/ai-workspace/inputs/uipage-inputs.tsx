'use client'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { LayoutGrid, Columns2, Columns3, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UIPageInputs {
  layout: string
  componentTypes: string[]
  dataSources: string[]
}

interface UIPageInputsFormProps {
  inputs: UIPageInputs
  onChange: (inputs: UIPageInputs) => void
}

const LAYOUTS = [
  {
    value: 'single',
    label: 'Single Column',
    description: 'Full width',
    icon: Square,
  },
  {
    value: 'two-column',
    label: 'Two Column',
    description: '2 columns on desktop',
    icon: Columns2,
  },
  {
    value: 'three-column',
    label: 'Three Column',
    description: '3 columns on desktop',
    icon: Columns3,
  },
  {
    value: 'grid',
    label: 'Responsive Grid',
    description: 'Auto layout',
    icon: LayoutGrid,
  },
]

const COMPONENT_TYPES = [
  { value: 'table', label: 'Data Table' },
  { value: 'chart', label: 'Chart' },
  { value: 'kpi', label: 'KPI Card' },
  { value: 'text', label: 'Text Section' },
  { value: 'list', label: 'List View' },
  { value: 'form', label: 'Form' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'image', label: 'Image/Media' },
]

const DATA_SOURCES = [
  { value: 'players', label: 'Player Data' },
  { value: 'forms', label: 'Form Responses' },
  { value: 'events', label: 'Events/Calendar' },
  { value: 'spreadsheets', label: 'Spreadsheets' },
  { value: 'wellness', label: 'Wellness Data' },
  { value: 'training', label: 'Training Data' },
  { value: 'custom', label: 'Custom Data' },
]

export function UIPageInputsForm({
  inputs,
  onChange,
}: UIPageInputsFormProps) {
  const updateInput = (field: keyof UIPageInputs, value: any) => {
    onChange({ ...inputs, [field]: value })
  }

  const toggleArrayItem = (field: 'componentTypes' | 'dataSources', item: string) => {
    const currentArray = inputs[field]
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item]
    updateInput(field, newArray)
  }

  return (
    <div className="space-y-6">
      {/* Layout */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Page Layout</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LAYOUTS.map((layout) => {
            const Icon = layout.icon
            return (
              <Card
                key={layout.value}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  inputs.layout === layout.value &&
                    'border-primary bg-primary/5'
                )}
                onClick={() => updateInput('layout', layout.value)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={cn(
                      'rounded-lg p-2',
                      inputs.layout === layout.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{layout.label}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {layout.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Component Types */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Component Types</Label>
        <div className="grid grid-cols-2 gap-2">
          {COMPONENT_TYPES.map((component) => (
            <div key={component.value} className="flex items-center space-x-2">
              <Checkbox
                id={`component-${component.value}`}
                checked={inputs.componentTypes.includes(component.value)}
                onCheckedChange={() => toggleArrayItem('componentTypes', component.value)}
              />
              <label
                htmlFor={`component-${component.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {component.label}
              </label>
            </div>
          ))}
        </div>
        {inputs.componentTypes.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Select component types to include
          </p>
        )}
      </div>

      {/* Data Sources */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Data Sources</Label>
        <div className="grid grid-cols-2 gap-2">
          {DATA_SOURCES.map((source) => (
            <div key={source.value} className="flex items-center space-x-2">
              <Checkbox
                id={`source-${source.value}`}
                checked={inputs.dataSources.includes(source.value)}
                onCheckedChange={() => toggleArrayItem('dataSources', source.value)}
              />
              <label
                htmlFor={`source-${source.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {source.label}
              </label>
            </div>
          ))}
        </div>
        {inputs.dataSources.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Select data sources to connect
          </p>
        )}
      </div>
    </div>
  )
}
