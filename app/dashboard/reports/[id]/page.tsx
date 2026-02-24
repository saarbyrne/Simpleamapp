import { redirect } from 'next/navigation'
import { getReport, getReportData } from '@/app/actions/reports'
import { ReportViewClient } from './_components/report-view-client'

export const revalidate = 300

interface ReportViewPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ action?: string }>
}

/**
 * Report view page - Server component shell
 *
 * Fetches report config and data server-side in parallel,
 * eliminating client-side useEffect data fetching.
 */
export default async function ReportViewPage({ params, searchParams }: ReportViewPageProps) {
  const [{ id: reportId }, { action }] = await Promise.all([params, searchParams])

  const [reportResult, dataResult] = await Promise.all([
    getReport(reportId),
    getReportData(reportId),
  ])

  if (!reportResult.success || !reportResult.report) {
    redirect('/dashboard/reports')
  }

  const report = reportResult.report
  let reportData = null

  if ('success' in dataResult && dataResult.success && 'chartData' in dataResult) {
    reportData = {
      chartData: dataResult.chartData || [],
      tableData: dataResult.tableData,
      kpis: dataResult.kpis,
      metadata: dataResult.metadata || {
        totalRecords: 0,
        dateRange: { from: new Date(), to: new Date() },
        lastUpdated: new Date(),
      },
    }
  }

  return (
    <ReportViewClient
      reportId={reportId}
      initialReport={report as any}
      initialReportData={reportData}
      initialAction={action}
    />
  )
}
