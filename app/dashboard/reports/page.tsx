import { ReportsClient } from './reports-client'
import { getReports, getReportTemplates } from '@/app/actions/reports'

type ReportsPageProps = {
  searchParams?: {
    template?: string
  }
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  // Load initial data server-side with parallel queries for better performance
  const [reportsResult, templatesResult] = await Promise.all([
    getReports(),
    getReportTemplates(),
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