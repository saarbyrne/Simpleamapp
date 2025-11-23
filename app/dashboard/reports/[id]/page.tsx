'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageCard } from '@/components/ui/page-card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScheduleReportDialog } from '@/components/reports/ScheduleReportDialog'
import {
  getReport,
  getReportData,
  updateReport,
  generateShareToken,
  revokeShareToken,
} from '@/app/actions/reports'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  Copy,
  FileText,
  Calendar,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertCircle,
  Printer,
  FileDown,
  ChevronDown,
  Clock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

interface Report {
  id: string
  name: string
  description: string | null
  type: string
  config: any
  sections: any
  insights: any
  isPublic: boolean
  shareToken: string | null
  createdAt: Date
  updatedAt: Date
}

interface ReportData {
  chartData: any[]
  tableData?: any[]
  kpis?: Record<string, number>
  metadata: {
    totalRecords: number
    dateRange: { from: Date; to: Date }
    lastUpdated: Date
  }
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export default function ReportViewPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const t = useTranslations('reports')

  const reportId = params.id as string
  const action = searchParams.get('action')

  const [report, setReport] = useState<Report | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(action === 'share')
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [generatingInsights, setGeneratingInsights] = useState(false)

  const loadReport = useCallback(async () => {
    // Don't show loading state if data loads quickly (from cache/pre-fetch)
    // This prevents the "2 loading states" issue when creating reports
    let loadingTimeout: NodeJS.Timeout | null = null
    const showLoading = () => {
      loadingTimeout = setTimeout(() => setIsLoading(true), 100) // Only show after 100ms
    }
    showLoading()
    
    try {
      // Load both report config and data in parallel
      const [reportResult, dataResult] = await Promise.all([
        getReport(reportId),
        getReportData(reportId)
      ])
      
      // Cancel loading state if data loaded quickly
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
        setIsLoading(false) // Data ready, no need to show loading
      }
      
      if (reportResult.success && reportResult.report) {
        setReport(reportResult.report as any)
        
        if ('success' in dataResult && dataResult.success && 'chartData' in dataResult) {
          setReportData({
            chartData: dataResult.chartData || [],
            tableData: dataResult.tableData,
            kpis: dataResult.kpis,
            metadata: dataResult.metadata || {
              totalRecords: 0,
              dateRange: { from: new Date(), to: new Date() },
              lastUpdated: new Date(),
            },
          })
        } else {
          toast.error('error' in dataResult ? dataResult.error : 'Failed to load report data')
        }
      } else {
        toast.error('error' in reportResult ? reportResult.error : t('failedToLoadReport'))
        router.push('/dashboard/reports')
      }
    } catch (error) {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      console.error('Error loading report:', error)
      toast.error(t('failedToLoadReport'))
      setIsLoading(false)
    } finally {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      setIsLoading(false)
    }
  }, [reportId, router, t])

  const loadReportData = async () => {
    setIsLoadingData(true)
    try {
      const result = await getReportData(reportId)
      if ('success' in result && result.success && 'chartData' in result) {
        setReportData({
          chartData: result.chartData || [],
          tableData: result.tableData,
          kpis: result.kpis,
          metadata: result.metadata || {
            totalRecords: 0,
            dateRange: { from: new Date(), to: new Date() },
            lastUpdated: new Date(),
          },
        })
      } else {
        toast.error('error' in result ? result.error : 'Failed to load report data')
      }
    } catch (error) {
      console.error('Error loading report data:', error)
      toast.error('Failed to load report data')
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [loadReport])

  const handleGenerateShareLink = async () => {
    try {
      const result = await generateShareToken(reportId)
      if (result.success && result.shareToken) {
        toast.success(t('sharing.shareTokenGenerated'))
        loadReport()
      } else {
        toast.error(result.error || t('sharing.failedToGenerateShareToken'))
      }
    } catch (error) {
      console.error('Error generating share link:', error)
      toast.error(t('sharing.failedToGenerateShareToken'))
    }
  }

  const handleRevokeAccess = async () => {
    try {
      const result = await revokeShareToken(reportId)
      if (result.success) {
        toast.success(t('sharing.accessRevoked'))
        loadReport()
      } else {
        toast.error(result.error || t('sharing.failedToRevokeAccess'))
      }
    } catch (error) {
      console.error('Error revoking access:', error)
      toast.error(t('sharing.failedToRevokeAccess'))
    }
  }

  const handleCopyShareLink = () => {
    if (report?.shareToken) {
      const url = `${window.location.origin}/shared/reports/${report.shareToken}`
      navigator.clipboard.writeText(url)
      toast.success(t('sharing.linkCopied'))
    }
  }

  const handleGenerateInsights = async () => {
    setGeneratingInsights(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockInsights = {
        summary: 'Overall trends show positive growth with a 15% increase over the period.',
        keyFindings: [
          'Peak performance observed',
          'Consistent improvement trend',
          'Strong recent performance',
        ],
        recommendations: [
          'Continue current monitoring strategies',
          'Maintain data collection practices',
        ],
      }

      await updateReport(reportId, { insights: mockInsights })
      toast.success(t('view.insightsGenerated'))
      loadReport()
    } catch (error) {
      console.error('Error generating insights:', error)
      toast.error(t('view.failedToGenerateInsights'))
    } finally {
      setGeneratingInsights(false)
    }
  }

  const handleExportCSV = () => {
    if (!reportData || !report) return

    try {
      const { exportToCSV, formatChartDataForExport } = require('@/lib/reports/export')
      const dataToExport = formatChartDataForExport(reportData.chartData, report.name)
      exportToCSV(dataToExport, `${report.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}`)
      toast.success('Report exported to CSV successfully')
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      toast.error('Failed to export to CSV')
    }
  }

  const handleExportPDF = async () => {
    if (!reportData || !report) return

    try {
      const { exportToPDF } = require('@/lib/reports/export')
      await exportToPDF({
        reportName: report.name,
        description: report.description || undefined,
        metadata: reportData.metadata,
        kpis: reportData.kpis,
        chartData: reportData.chartData,
      })
      toast.success('Report exported to PDF successfully')
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      toast.error('Failed to export to PDF')
    }
  }

  const handlePrint = () => {
    if (!report) return

    try {
      const { printReport } = require('@/lib/reports/export')
      printReport('report-content', report.name)
    } catch (error) {
      console.error('Error printing report:', error)
      toast.error('Failed to print report')
    }
  }

  const renderSectionChart = (section: any, data: any[]) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-full min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      )
    }

    const chartConfig = {
      value: {
        label: section.config.yAxis || 'Value',
        color: 'hsl(var(--chart-1))',
      },
    }

    switch (section.config.visualization) {
      case 'line':
        return (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip />
              {section.config.chartOptions?.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        )

      case 'bar':
        return (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip />
              {section.config.chartOptions?.showLegend && <Legend />}
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ChartContainer>
        )

      case 'area':
        return (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip />
              {section.config.chartOptions?.showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey="value"
                fill="var(--color-value)"
                stroke="var(--color-value)"
              />
            </AreaChart>
          </ChartContainer>
        )

      case 'pie':
        return (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                ))}
              </Pie>
              <Tooltip />
              {section.config.chartOptions?.showLegend && <Legend />}
            </PieChart>
          </ChartContainer>
        )

      case 'table':
        return (
          <div className="border rounded-lg overflow-hidden max-h-[250px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )

      default:
        return <p className="text-sm text-muted-foreground">Unknown visualization type</p>
    }
  }

  const renderDashboard = () => {
    if (!report?.config?.sections || report.config.sections.length === 0) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No dashboard sections configured</p>
        </div>
      )
    }

    const SIZE_CLASSES = {
      full: 'col-span-12',
      half: 'col-span-12 md:col-span-6',
      third: 'col-span-12 md:col-span-4',
    }

    return (
      <div className="grid grid-cols-12 gap-4">
        {report.config.sections.map((section: any, index: number) => (
          <div key={section.id || index} className={SIZE_CLASSES[section.size as keyof typeof SIZE_CLASSES] || 'col-span-12 md:col-span-6'}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {section.config.chartOptions?.title || `Chart ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderSectionChart(section, reportData?.chartData || [])}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  const renderChart = () => {
    // This function should only be called when we have both report and reportData
    // The loading check is done in the parent component
    if (!report || !reportData) {
      return null
    }

    if (!reportData.chartData || reportData.chartData.length === 0) {
      return (
        <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/10">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No data available</p>
            <p className="text-sm text-muted-foreground max-w-md">
              There is no data matching your report configuration. Try adjusting the date range or data sources.
            </p>
          </div>
        </div>
      )
    }

    const config = report.config || {}
    const visualization = config.visualization || 'bar'
    const chartData = reportData.chartData

    const chartConfig = {
      value: {
        label: config.yAxis || 'Value',
        color: 'hsl(var(--chart-1))',
      },
    }

    switch (report.type) {
      case 'table':
        return (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {reportData.tableData && reportData.tableData.length > 0 &&
                    Object.keys(reportData.tableData[0]).slice(0, 5).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.tableData?.slice(0, 20).map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).slice(0, 5).map((value: any, i) => (
                      <TableCell key={i}>
                        {typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )

      case 'dashboard':
        return renderDashboard()

      case 'single_chart':
      default:
        switch (visualization) {
          case 'line':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            )

          case 'bar':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ChartContainer>
            )

          case 'pie':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={120}
                    fill="var(--color-value)"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
            )

          case 'area':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            )

          default:
            return (
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Unsupported visualization type</p>
              </div>
            )
        }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <PageCard title={t('loadingReport')} description="">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">{t('loadingReport')}</p>
            </div>
          </div>
        </PageCard>
      </div>
    )
  }

  if (!report) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <PageCard
        title={report.name}
        description={report.description || undefined}
        headerActions={
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={loadReportData} title={t('refresh')}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowShareDialog(true)} title={t('share')}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowScheduleDialog(true)} title="Schedule Report">
              <Clock className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={!reportData || reportData.chartData.length === 0}>
                  <Download className="h-4 w-4 me-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ms-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="h-4 w-4 me-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileDown className="h-4 w-4 me-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 me-2" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
              <ArrowLeft className="h-4 w-4 me-2" />
              {t('back')}
            </Button>
          </div>
        }
      >
        <div id="report-content" className="space-y-6">
          {/* KPIs */}
          {reportData?.kpis && Object.keys(reportData.kpis).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(reportData.kpis).map(([key, value]) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{value.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Metadata */}
          {reportData?.metadata && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{reportData.metadata.totalRecords} records</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(reportData.metadata.dateRange.from), 'MMM d, yyyy')} -{' '}
                  {format(new Date(reportData.metadata.dateRange.to), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          )}

          {/* Chart Section */}
          {isLoading || !reportData ? (
            <div className="h-[400px] flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : report.type === 'dashboard' ? (
            renderChart()
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{report.config?.chartOptions?.title || report.name}</CardTitle>
                <CardDescription>
                  {t('view.lastUpdated')}: {format(new Date(report.updatedAt), 'PPpp')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart()}
              </CardContent>
            </Card>
          )}

          {/* AI Insights Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {t('view.insights')}
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis and recommendations
                  </CardDescription>
                </div>
                {!report.insights && (
                  <Button
                    onClick={handleGenerateInsights}
                    disabled={generatingInsights}
                    size="sm"
                  >
                    {generatingInsights ? t('view.generatingInsights') : t('view.generateInsights')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {report.insights ? (
                <div className="space-y-4">
                  {report.insights.summary && (
                    <div>
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-muted-foreground">{report.insights.summary}</p>
                    </div>
                  )}
                  {report.insights.keyFindings && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Findings</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {report.insights.keyFindings.map((finding: string, i: number) => (
                          <li key={i}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.insights.recommendations && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {report.insights.recommendations.map((rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">{t('view.noInsights')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </PageCard>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('sharing.title')}</DialogTitle>
            <DialogDescription>{t('sharing.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {report.shareToken ? (
              <>
                <div className="space-y-2">
                  <Label>{t('sharing.publicLink')}</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/shared/reports/${report.shareToken}`}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyShareLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('sharing.publicLinkDescription')}
                  </p>
                </div>
                <Button variant="destructive" onClick={handleRevokeAccess} className="w-full">
                  {t('sharing.revokeAccess')}
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {t('sharing.publicLinkDescription')}
                </p>
                <Button onClick={handleGenerateShareLink} className="w-full">
                  {t('sharing.enablePublicLink')}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <ScheduleReportDialog
        reportId={reportId}
        reportName={report.name}
        existingSchedule={(report as any).schedule}
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onScheduleCreated={loadReport}
      />
    </div>
  )
}
