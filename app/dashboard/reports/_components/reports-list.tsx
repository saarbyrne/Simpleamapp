import { getReports, getReportTemplates } from '@/app/actions/reports'
import { ReportsClient } from '../reports-client'

/**
 * Server Component that fetches and renders the reports list
 * This streams independently from templates
 */
export async function ReportsList() {
  const [reportsResult, templatesResult] = await Promise.all([
    getReports(),
    getReportTemplates()
  ])

  const reports = reportsResult.success ? reportsResult.reports || [] : []
  const templates = templatesResult.success ? templatesResult.templates || [] : []

  return (
    <ReportsClient
      initialReports={reports}
      initialTemplates={templates}
    />
  )
}
