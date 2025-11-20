'use client'

import { useState, useEffect } from 'react'
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
import {
  getReport,
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
} from 'lucide-react'
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

// Sample data for demonstration
const SAMPLE_DATA = [
  { name: 'Mon', value: 400, value2: 240 },
  { name: 'Tue', value: 300, value2: 139 },
  { name: 'Wed', value: 200, value2: 980 },
  { name: 'Thu', value: 278, value2: 390 },
  { name: 'Fri', value: 189, value2: 480 },
  { name: 'Sat', value: 239, value2: 380 },
  { name: 'Sun', value: 349, value2: 430 },
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export default function ReportViewPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const t = useTranslations('reports')

  const reportId = params.id as string
  const action = searchParams.get('action')

  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareDialog, setShowShareDialog] = useState(action === 'share')
  const [showInsights, setShowInsights] = useState(false)
  const [generatingInsights, setGeneratingInsights] = useState(false)

  useEffect(() => {
    loadReport()
  }, [reportId])

  const loadReport = async () => {
    setIsLoading(true)
    try {
      const result = await getReport(reportId)
      if (result.success && result.report) {
        setReport(result.report as any)
      } else {
        toast.error(result.error || t('failedToLoadReport'))
        router.push('/dashboard/reports')
      }
    } catch (error) {
      console.error('Error loading report:', error)
      toast.error(t('failedToLoadReport'))
    } finally {
      setIsLoading(false)
    }
  }

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
      // Placeholder for AI insights generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockInsights = {
        summary: 'Overall trends show positive growth with a 15% increase over the period.',
        keyFindings: [
          'Peak performance on Wednesday',
          'Consistent improvement trend',
          'Strong weekend performance',
        ],
        recommendations: [
          'Consider increasing resources on high-performance days',
          'Maintain current strategies for weekend operations',
        ],
      }

      await updateReport(reportId, { insights: mockInsights })
      toast.success(t('view.insightsGenerated'))
      loadReport()
      setShowInsights(true)
    } catch (error) {
      console.error('Error generating insights:', error)
      toast.error(t('view.failedToGenerateInsights'))
    } finally {
      setGeneratingInsights(false)
    }
  }

  const renderChart = () => {
    if (!report) return null

    const config = report.config || {}
    const visualization = config.visualization || 'bar'

    const chartConfig = {
      value: {
        label: 'Value',
        color: 'hsl(var(--chart-1))',
      },
      value2: {
        label: 'Secondary',
        color: 'hsl(var(--chart-2))',
      },
    }

    // Handle different report types
    switch (report.type) {
      case 'table':
        return (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Secondary Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SAMPLE_DATA.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{row.value2}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )

      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Main Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Main Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <BarChart data={SAMPLE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="var(--color-value)" />
                    <Bar dataKey="value2" fill="var(--color-value2)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Secondary Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Secondary Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <LineChart data={SAMPLE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} />
                    <Line type="monotone" dataKey="value2" stroke="var(--color-value2)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )

      case 'single_chart':
      default:
        switch (visualization) {
          case 'line':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart data={SAMPLE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} />
                  <Line type="monotone" dataKey="value2" stroke="var(--color-value2)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            )

          case 'bar':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={SAMPLE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="var(--color-value)" />
                  <Bar dataKey="value2" fill="var(--color-value2)" />
                </BarChart>
              </ChartContainer>
            )

          case 'pie':
            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <PieChart>
                  <Pie
                    data={SAMPLE_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={120}
                    fill="var(--color-value)"
                    dataKey="value"
                  >
                    {SAMPLE_DATA.map((entry, index) => (
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
                <AreaChart data={SAMPLE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="value2" stroke="var(--color-value2)" fill="var(--color-value2)" fillOpacity={0.6} />
                </AreaChart>
              </ChartContainer>
            )

          default:
            return (
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">{t('builder.noDataAvailable')}</p>
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
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
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
            <Button variant="outline" size="icon" onClick={loadReport} title={t('refresh')}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowShareDialog(true)} title={t('share')}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title={t('export')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
              <ArrowLeft className="h-4 w-4 me-2" />
              {t('back')}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Chart Section */}
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
    </div>
  )
}
