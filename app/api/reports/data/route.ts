import { NextRequest } from 'next/server'
import { getAIWorkspace } from '@/app/actions/ai-workspace'
import { buildReportData } from '@/lib/reports/query-builder'
import { ReportConfig } from '@/types/reports'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
    const workspaceId = req.nextUrl.searchParams.get('workspaceId')
    if (!workspaceId) {
        return new Response('Missing workspaceId', { status: 400 })
    }

    // 1. Load workspace
    const wsResult = await getAIWorkspace(workspaceId)
    if (!wsResult.success || !wsResult.workspace) {
        return new Response('Workspace not found', { status: 404 })
    }

    const { artifactType, artifactData, organizationId } = wsResult.workspace

    // Verify this is a report workspace and has config
    if (artifactType !== 'reports' || !artifactData || !(artifactData as any).reportConfig) {
        return new Response('No report config available', { status: 400 })
    }

    try {
        // 2. Build the data
        const reportConfig = (artifactData as any).reportConfig as ReportConfig

        // Use filters from config if available, or empty object
        const filters = reportConfig.filters || {}

        const reportResult = await buildReportData(reportConfig, organizationId, filters)

        // 3. Return JSON
        return new Response(JSON.stringify(reportResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error building report data:', error)
        return new Response(JSON.stringify({ error: 'Failed to build report data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
