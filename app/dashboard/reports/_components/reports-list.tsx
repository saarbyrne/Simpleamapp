import { getReports } from '@/app/actions/reports'
import { ReportsClient } from '../reports-client'

/**
 * Server Component that fetches and renders the reports list
 * This streams independently from templates
 */
export async function ReportsList() {
  const reportsResult = await getReports()
  const reports = reportsResult.success ? reportsResult.reports || [] : []

  return (
    <ReportsClient
      initialReports={reports}
      initialTemplates={[]} // Templates loaded separately
    />
  )
}
