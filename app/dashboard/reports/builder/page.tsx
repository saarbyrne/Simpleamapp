'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { ReportBuilderWizard, DataPoint, Population } from '@/components/reports/ReportBuilderWizard'
import { createReport, getReportBuilderData, getReport, getReportData, updateReport } from '@/app/actions/reports'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { CreateReportData } from '@/app/actions/reports'

export default function ReportBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const t = useTranslations('reports')

  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [builderData, setBuilderData] = useState<{
    dataPoints: DataPoint[]
    populations: Population[]
  }>({ dataPoints: [], populations: [] })

  const [initialReportData, setInitialReportData] = useState<Partial<CreateReportData> | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [editId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const promises: Promise<any>[] = [getReportBuilderData()]
      if (editId) {
        promises.push(getReport(editId))
      }

      const results = await Promise.all(promises)
      const builderResult = results[0]
      const reportResult = editId ? results[1] : null

      if (builderResult.success && builderResult.dataPoints && builderResult.populations) {
        setBuilderData({
          dataPoints: builderResult.dataPoints,
          populations: builderResult.populations,
        })
      } else {
        toast.error(builderResult.error || 'Failed to load report data')
      }

      if (reportResult) {
        if (reportResult.success && reportResult.report) {
          setInitialReportData(reportResult.report)
        } else {
          toast.error(reportResult.error || 'Failed to load report to edit')
        }
      }

    } catch (error) {
      console.error('Error loading report data:', error)
      toast.error('Failed to load report data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async (reportData: CreateReportData) => {
    setIsCreating(true)
    try {
      let result
      if (editId) {
        // Update existing report
        result = await updateReport(editId, reportData)
      } else {
        // Create new report
        result = await createReport(reportData)
      }

      if (result.success && result.report) {
        // Pre-fetch report data
        await Promise.all([
          getReport(result.report.id),
          getReportData(result.report.id)
        ])

        toast.success(editId ? t('reportUpdated') : t('reportCreated'))
        router.push(`/dashboard/reports/${result.report.id}`)
      } else {
        toast.error(result.error || (editId ? t('failedToUpdateReport') : t('failedToCreateReport')))
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error saving report:', error)
      toast.error(editId ? t('failedToUpdateReport') : t('failedToCreateReport'))
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    if (editId) {
      router.push(`/dashboard/reports/${editId}`)
    } else {
      router.push('/dashboard/reports')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <PageCard
        title={editId ? t('builder.editTitle') : t('builder.title')}
        description={t('builder.wizardDescription')}
        headerActions={
          <Button variant="outline" onClick={handleCancel} disabled={isCreating}>
            <ArrowLeft className="h-4 w-4 me-2" />
            {t('back')}
          </Button>
        }
      >
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ms-3 text-muted-foreground">Loading data sources...</span>
            </div>
          ) : isCreating ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ms-3 text-muted-foreground">{editId ? 'Updating report...' : 'Creating report...'}</span>
            </div>
          ) : (
            <ReportBuilderWizard
              dataPoints={builderData.dataPoints}
              populations={builderData.populations}
              onComplete={handleComplete}
              onCancel={handleCancel}
              initialData={initialReportData}
            />
          )}
        </div>
      </PageCard>
    </div>
  )
}
