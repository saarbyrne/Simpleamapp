import { redirect } from 'next/navigation'
import { getReportBuilderData, getReport } from '@/app/actions/reports'
import { ReportBuilderClient } from './_components/report-builder-client'

export const revalidate = 300

interface ReportBuilderPageProps {
  searchParams: Promise<{ edit?: string }>
}

/**
 * Report builder page - Server component shell
 *
 * Fetches builder data (data points, populations) and optionally
 * the report being edited on the server, eliminating client-side
 * useEffect data fetching.
 */
export default async function ReportBuilderPage({ searchParams }: ReportBuilderPageProps) {
  const { edit: editId } = await searchParams

  const promises: Promise<any>[] = [getReportBuilderData()]
  if (editId) {
    promises.push(getReport(editId))
  }

  const results = await Promise.all(promises)
  const builderResult = results[0]
  const reportResult = editId ? results[1] : null

  if (!builderResult.success || !builderResult.dataPoints || !builderResult.populations) {
    redirect('/dashboard/reports')
  }

  const builderData = {
    dataPoints: builderResult.dataPoints,
    populations: builderResult.populations,
  }

  const initialReportData = reportResult?.success && reportResult?.report
    ? reportResult.report
    : undefined

  return (
    <ReportBuilderClient
      editId={editId}
      builderData={builderData}
      initialReportData={initialReportData}
    />
  )
}
