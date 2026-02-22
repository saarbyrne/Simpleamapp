'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FileBarChart,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Clock,
  Sparkles,
  Plus,
  BarChart3,
  LayoutDashboard,
  Table,
} from 'lucide-react'
import { deleteReport, getReports } from '@/app/actions/reports'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { PageCard } from '@/components/ui/page-card'

interface Report {
  id: string
  name: string
  description: string | null
  type: string
  createdAt: Date
  updatedAt: Date
  template?: {
    name: string
    category: string
  } | null
  schedule?: {
    frequency: string
    isActive: boolean
  } | null
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  isGlobal: boolean
}

type ReportsClientProps = {
  initialReports: Report[]
  initialTemplates: ReportTemplate[]
}

export function ReportsClient({
  initialReports,
  initialTemplates
}: ReportsClientProps) {
  const router = useRouter()
  const t = useTranslations('reports')
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [templates, setTemplates] = useState<ReportTemplate[]>(initialTemplates)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [ConfirmDialogEl, confirmAction] = useConfirmDialog()

  const handleDelete = async (id: string) => {
    const ok = await confirmAction({
      title: t('deleteConfirmation'),
      description: t('failedToDeleteReport'),
      confirmLabel: t('delete'),
    })
    if (!ok) return

    setDeletingId(id)
    
    // Optimistic update - remove immediately for instant feedback
    setReports(prev => prev.filter(r => r.id !== id))

    try {
      const result = await deleteReport(id)

      if (result.success) {
        toast.success(t('reportDeleted'))
      } else {
        // Revert on error
        toast.error(result.error || t('failedToDeleteReport'))
        // Reload reports to get correct state
        const reportsResult = await getReports()
        if (reportsResult.success) {
          setReports(reportsResult.reports || [])
        }
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      toast.error(t('failedToDeleteReport'))
      // Reload reports to get correct state
      const reportsResult = await getReports()
      if (reportsResult.success) {
        setReports(reportsResult.reports || [])
      }
    } finally {
      setDeletingId(null)
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'single_chart':
        return <BarChart3 className="h-5 w-5" />
      case 'dashboard':
        return <LayoutDashboard className="h-5 w-5" />
      case 'table':
        return <Table className="h-5 w-5" />
      default:
        return <FileBarChart className="h-5 w-5" />
    }
  }

  return (
    <>
      {ConfirmDialogEl}
      <PageCard
        variant="table"
        title={t('title')}
        description={t('description')}
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTemplateDialog(true)}
            >
              <Sparkles className="h-4 w-4 me-2" />
              {t('useTemplate')}
            </Button>
            <Button onClick={() => router.push('/dashboard/reports/builder')}>
              <Plus className="h-4 w-4 me-2" />
              {t('newReport')}
            </Button>
          </div>
        }
      >
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileBarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('noReports')}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t('noReportsDescription')}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setShowTemplateDialog(true)}
              >
                {t('browseTemplates')}
              </Button>
              <Button onClick={() => router.push('/dashboard/reports/builder')}>
                {t('createCustom')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  deletingId === report.id ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getReportIcon(report.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {report.name}
                        </CardTitle>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/reports/${report.id}`)
                          }}
                        >
                          <Edit className="h-4 w-4 me-2" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/reports/${report.id}?action=share`)
                          }}
                        >
                          <Share2 className="h-4 w-4 me-2" />
                          {t('share')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(report.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 me-2" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {report.description && (
                    <CardDescription className="line-clamp-2">
                      {report.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {report.template && (
                      <Badge variant="secondary" className="text-xs">
                        {report.template.category}
                      </Badge>
                    )}
                    {report.schedule?.isActive && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 me-1" />
                        {report.schedule.frequency}
                      </Badge>
                    )}
                  </div>
                  <span>
                    {format(new Date(report.updatedAt), 'MMM d, yyyy')}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </PageCard>

      {/* Template Gallery Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('templates.title')}</DialogTitle>
            <DialogDescription>{t('templates.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Custom Report Option */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed"
              onClick={() => {
                setShowTemplateDialog(false)
                router.push('/dashboard/reports/builder')
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {t('templates.customReport')}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t('templates.customReportDescription')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Template Cards */}
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setShowTemplateDialog(false)
                  router.push(`/dashboard/reports/builder?template=${template.id}`)
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        {template.isGlobal && (
                          <Badge variant="secondary" className="text-xs">
                            {t('templates.public')}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit mt-2">
                    {t(`templates.categories.${template.category}` as any)}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
