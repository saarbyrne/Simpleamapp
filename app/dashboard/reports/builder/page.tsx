'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { ReportBuilderWizard } from '@/components/reports/ReportBuilderWizard'
import { createReport, getAvailableDataSources, getReport, getReportData } from '@/app/actions/reports'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { CreateReportData } from '@/app/actions/reports'

export default function ReportBuilderPage() {
  const router = useRouter()
  const t = useTranslations('reports')
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dataSources, setDataSources] = useState<{
    forms: Array<{ id: string; name: string; type: 'form' }>
    spreadsheets: Array<{ id: string; name: string; type: 'spreadsheet' }>
  }>({ forms: [], spreadsheets: [] })

  useEffect(() => {
    loadDataSources()
  }, [])

  const loadDataSources = async () => {
    setIsLoading(true)
    try {
      const result = await getAvailableDataSources()
      if (result.success && result.forms && result.spreadsheets) {
        setDataSources({
          forms: result.forms,
          spreadsheets: result.spreadsheets,
        })
      } else {
        toast.error(result.error || 'Failed to load data sources')
      }
    } catch (error) {
      console.error('Error loading data sources:', error)
      toast.error('Failed to load data sources')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async (reportData: CreateReportData) => {
    setIsCreating(true)
    try {
      // Step 1: Create the report
      const result = await createReport(reportData)

      if (result.success && result.report) {
        // Step 2: Pre-fetch report data BEFORE navigating
        // This ensures the report page has data ready and shows no loading state
        await Promise.all([
          getReport(result.report.id),
          getReportData(result.report.id)
        ])
        
        toast.success(t('reportCreated'))
        // Now navigate - data is already loaded, so no loading state on report page
        router.push(`/dashboard/reports/${result.report.id}`)
      } else {
        toast.error(result.error || t('failedToCreateReport'))
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error(t('failedToCreateReport'))
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/reports')
  }

  return (
    <div className="container mx-auto py-8">
      <PageCard
        title={t('builder.title')}
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
              <span className="ms-3 text-muted-foreground">Creating report...</span>
            </div>
          ) : (
            <ReportBuilderWizard
              availableForms={dataSources.forms}
              availableSpreadsheets={dataSources.spreadsheets}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          )}
        </div>
      </PageCard>
    </div>
  )
}
