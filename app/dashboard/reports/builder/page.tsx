'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { PageCard } from '@/components/ui/page-card'
import { createReport } from '@/app/actions/reports'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  BarChart3,
  LineChart,
  PieChart,
  Table,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react'

export default function ReportBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('reports')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [reportType, setReportType] = useState<'single_chart' | 'dashboard' | 'table'>('single_chart')
  const [visualization, setVisualization] = useState<'line' | 'bar' | 'pie' | 'heatmap' | 'table'>('bar')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t('reportName') + ' is required')
      return
    }

    setIsCreating(true)
    try {
      const result = await createReport({
        name: name.trim(),
        description: description.trim() || undefined,
        type: reportType,
        config: {
          visualization,
          dataSources: [],
          filters: {},
          chartOptions: {
            title: name,
            showLegend: true,
            showDataLabels: false,
          },
        },
      })

      if (result.success && result.report) {
        toast.success(t('reportCreated'))
        router.push(`/dashboard/reports/${result.report.id}`)
      } else {
        toast.error(result.error || t('failedToCreateReport'))
      }
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error(t('failedToCreateReport'))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <PageCard
        title={t('builder.title')}
        description={t('builder.configureReport')}
        headerActions={
          <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
        }
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('reportName')}</Label>
              <Input
                id="name"
                placeholder="My Report"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">{t('reportDescription')}</Label>
              <Textarea
                id="description"
                placeholder="Describe what this report shows..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="space-y-4">
            <div>
              <Label>{t('builder.chooseVisualization')}</Label>
              <p className="text-sm text-muted-foreground mb-4">
                {t('builder.chooseVisualizationDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  reportType === 'single_chart' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setReportType('single_chart')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{t('types.singleChart')}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t('builder.lineChartDescription')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  reportType === 'dashboard' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setReportType('dashboard')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{t('types.dashboard')}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t('builder.dashboardDescription')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  reportType === 'table' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setReportType('table')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Table className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{t('types.table')}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t('builder.tableDescription')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Visualization Type for Charts */}
          {reportType === 'single_chart' && (
            <div className="space-y-4">
              <Label>{t('builder.chartOptions')}</Label>
              <Select value={visualization} onValueChange={(value: any) => setVisualization(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      {t('builder.lineChart')}
                    </div>
                  </SelectItem>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {t('builder.barChart')}
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      {t('builder.pieChart')}
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {t('builder.areaChart')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/reports')}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !name.trim()}
            >
              {isCreating ? t('create') + '...' : t('create')}
            </Button>
          </div>
        </div>
      </PageCard>
    </div>
  )
}
