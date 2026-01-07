'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LayoutGrid, Table as TableIcon, BarChart3, FileText, Image as ImageIcon, Code } from 'lucide-react'

interface UIPageRendererProps {
  workspace: any
}

export function UIPageRenderer({ workspace }: UIPageRendererProps) {
  const artifactData = workspace.artifactData
  const uiPageConfig = artifactData?.uiPageConfig

  if (!uiPageConfig) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No UI Page Configuration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to generate a custom UI page
          </p>
        </div>
      </div>
    )
  }

  const {
    title = 'Custom Page',
    layout = 'grid',
    components = [],
  } = uiPageConfig

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'table':
        return <TableIcon className="h-5 w-5" />
      case 'chart':
        return <BarChart3 className="h-5 w-5" />
      case 'text':
        return <FileText className="h-5 w-5" />
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const renderComponent = (component: any, index: number) => {
    switch (component.type) {
      case 'table':
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getComponentIcon('table')}
                <CardTitle className="text-lg">{component.title || 'Data Table'}</CardTitle>
              </div>
              {component.dataSource && (
                <CardDescription>Data from: {component.dataSource}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {(component.columns || ['Column 1', 'Column 2', 'Column 3']).map(
                      (col: string) => (
                        <TableHead key={col}>{col}</TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      {(component.columns || ['Column 1', 'Column 2', 'Column 3']).map(
                        (col: string) => (
                          <TableCell key={`${row}-${col}`}>Sample Data</TableCell>
                        )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3 text-xs text-muted-foreground">
                Connect to {component.dataSource || 'data source'} to populate
              </div>
            </CardContent>
          </Card>
        )

      case 'chart':
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getComponentIcon('chart')}
                <CardTitle className="text-lg">{component.title || 'Chart'}</CardTitle>
              </div>
              {component.dataSource && (
                <CardDescription>Data from: {component.dataSource}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {component.chartType || 'Chart'} visualization
                  </p>
                  {component.metric && (
                    <Badge variant="secondary" className="mt-2">
                      {component.metric}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'text':
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getComponentIcon('text')}
                <CardTitle className="text-lg">{component.title || 'Text Section'}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {component.content || 'Text content will appear here'}
              </p>
            </CardContent>
          </Card>
        )

      case 'kpi':
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {component.title || 'Metric'}
              </CardTitle>
              {getComponentIcon('chart')}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{component.value || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {component.subtitle || 'Connect to data source'}
              </p>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getComponentIcon(component.type)}
                <CardTitle className="text-lg">
                  {component.title || `${component.type} Component`}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                {component.type} component placeholder
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  const getGridClasses = () => {
    switch (layout) {
      case 'single':
        return 'grid-cols-1'
      case 'two-column':
        return 'grid-cols-1 md:grid-cols-2'
      case 'three-column':
        return 'grid-cols-1 md:grid-cols-3'
      case 'grid':
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <Badge variant="outline">{layout} layout</Badge>
        </div>
      </div>

      {/* Components Grid */}
      {components.length > 0 ? (
        <div className={`grid gap-6 ${getGridClasses()}`}>
          {components.map((component: any, index: number) =>
            renderComponent(component, index)
          )}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex h-48 items-center justify-center">
            <div className="text-center">
              <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No components defined yet
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Library */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Components</CardTitle>
          <CardDescription>
            Components that can be added to this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['table', 'chart', 'kpi', 'text', 'image', 'form', 'list'].map((type) => (
              <Badge key={type} variant="secondary" className="gap-1">
                {getComponentIcon(type)}
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <LayoutGrid className="h-5 w-5" />
            <div>
              <p className="font-medium">Custom Page Builder</p>
              <p className="text-xs">
                This is a preview. Publish to enable full page editing and data connections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
