'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { ReportBuilderWizard, DataPoint, Population } from '@/components/reports/ReportBuilderWizard'
import { createReport, updateReport, getReport, getReportData } from '@/app/actions/reports'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { CreateReportData } from '@/app/actions/reports'

interface ReportBuilderClientProps {
  editId?: string
  builderData: {
    dataPoints: DataPoint[]
    populations: Population[]
  }
  initialReportData?: Partial<CreateReportData>
}

export function ReportBuilderClient({ editId, builderData, initialReportData }: ReportBuilderClientProps) {
  const router = useRouter()
  const t = useTranslations('reports')
  const [isCreating, setIsCreating] = useState(false)

  const handleComplete = async (reportData: CreateReportData) => {
    setIsCreating(true)
    try {
      let result
      if (editId) {
        result = await updateReport(editId, reportData)
      } else {
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
        variant="table"
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
          {isCreating ? (
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
