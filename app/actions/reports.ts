'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireUser } from '@/lib/auth/cached-user'
import { isPlatformAdmin } from '@/lib/platform-admin'
import { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'
import type { ReportConfig, ReportSection } from '@/types/reports'

export interface CreateReportData {
  name: string
  description?: string
  type: 'single_chart' | 'dashboard' | 'table'
  config: ReportConfig
  sections?: ReportSection[]
  templateId?: string
}

export interface UpdateReportData {
  name?: string
  description?: string
  config?: ReportConfig
  sections?: ReportSection[]
  insights?: any
}

export interface CreateReportTemplateData {
  name: string
  description: string
  category: 'player' | 'team' | 'medical' | 'performance'
  config: ReportConfig
  sections?: ReportSection[]
  isGlobal?: boolean
}

export interface CreateReportScheduleData {
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  dayOfWeek?: number
  dayOfMonth?: number
  recipients: string[]
  format: 'pdf' | 'link'
}

// ===== REPORT CRUD =====

export async function createReport(data: CreateReportData) {

  try {
    const user = await requireUser()

    const report = await prisma.report.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        config: data.config as unknown as Prisma.InputJsonValue,
        sections: data.sections as unknown as Prisma.InputJsonValue,
        templateId: data.templateId,
        organizationId: user.organizationId,
        createdBy: user.id,
      },
    })

    revalidatePath('/dashboard/reports')
    revalidateTag('reports')

    return { success: true, report }
  } catch (error) {
    console.error('Error creating report:', error)
    return { error: 'Failed to create report' }
  }
}

export async function getReports() {

  try {
    const user = await requireUser()

    const reports = await prisma.report.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        template: true,
        schedule: true,
      },
    })

    return { success: true, reports }
  } catch (error) {
    console.error('Error fetching reports:', error)
    return { error: 'Failed to fetch reports' }
  }
}

export async function getReport(reportId: string) {

  try {
    const user = await requireUser()

    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
      include: {
        template: true,
        schedule: true,
      },
    })

    if (!report) {
      return { error: 'Report not found' }
    }

    return { success: true, report }
  } catch (error) {
    console.error('Error fetching report:', error)
    return { error: 'Failed to fetch report' }
  }
}

export async function updateReport(reportId: string, data: UpdateReportData) {

  try {
    const user = await requireUser()

    // Verify ownership
    const existing = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
    })

    if (!existing) {
      return { error: 'Report not found' }
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        name: data.name,
        description: data.description,
        config: data.config as unknown as Prisma.InputJsonValue,
        sections: data.sections as unknown as Prisma.InputJsonValue,
        insights: data.insights as unknown as Prisma.InputJsonValue,
      },
    })

    revalidatePath('/dashboard/reports')
    revalidatePath(`/dashboard/reports/${reportId}`)
    revalidateTag('reports')

    return { success: true, report }
  } catch (error) {
    console.error('Error updating report:', error)
    return { error: 'Failed to update report' }
  }
}

export async function deleteReport(reportId: string) {

  try {
    const user = await requireUser()

    // Verify ownership
    const existing = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
    })

    if (!existing) {
      return { error: 'Report not found' }
    }

    await prisma.report.delete({
      where: { id: reportId },
    })

    // Don't revalidate path here - client does optimistic update
    // But do invalidate the cache tag for next full page load
    revalidateTag('reports')

    return { success: true }
  } catch (error) {
    console.error('Error deleting report:', error)
    return { error: 'Failed to delete report' }
  }
}

// ===== REPORT TEMPLATES =====

export async function getReportTemplates() {

  try {
    const user = await requireUser()

    const templates = await prisma.reportTemplate.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { organizationId: user.organizationId },
        ],
      },
      orderBy: [
        { isGlobal: 'desc' },
        { downloads: 'desc' },
      ],
    })

    return { success: true, templates }
  } catch (error) {
    console.error('Error fetching report templates:', error)
    return { error: 'Failed to fetch report templates' }
  }
}

export async function createReportTemplate(data: CreateReportTemplateData) {

  try {
    const user = await requireUser()

    // Only platform admins may publish a template globally (organizationId:
    // null, visible to every org). A regular caller's isGlobal request is
    // silently downgraded to an org-scoped template instead of trusting
    // client-supplied input.
    const isGlobal = data.isGlobal === true && (await isPlatformAdmin())

    const template = await prisma.reportTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        config: data.config as unknown as Prisma.InputJsonValue,
        sections: data.sections as unknown as Prisma.InputJsonValue,
        isGlobal,
        organizationId: isGlobal ? null : user.organizationId,
        createdBy: user.id,
      },
    })

    revalidatePath('/dashboard/reports')

    return { success: true, template }
  } catch (error) {
    console.error('Error creating report template:', error)
    return { error: 'Failed to create report template' }
  }
}

// ===== REPORT SCHEDULING =====

export async function createReportSchedule(
  reportId: string,
  data: CreateReportScheduleData
) {

  try {
    const user = await requireUser()

    // Verify report ownership
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
    })

    if (!report) {
      return { error: 'Report not found' }
    }

    // Calculate next send time
    const nextSend = calculateNextSendTime(data)

    const schedule = await prisma.reportSchedule.create({
      data: {
        reportId,
        frequency: data.frequency,
        time: data.time,
        dayOfWeek: data.dayOfWeek,
        dayOfMonth: data.dayOfMonth,
        recipients: data.recipients,
        format: data.format,
        nextSend,
      },
    })

    revalidatePath(`/dashboard/reports/${reportId}`)

    return { success: true, schedule }
  } catch (error) {
    console.error('Error creating report schedule:', error)
    return { error: 'Failed to create report schedule' }
  }
}

export async function updateReportSchedule(
  scheduleId: string,
  data: Partial<CreateReportScheduleData>
) {

  try {
    const user = await requireUser()

    // Verify ownership through report
    const existing = await prisma.reportSchedule.findFirst({
      where: { id: scheduleId },
      include: { report: true },
    })

    if (!existing || existing.report.organizationId !== user.organizationId) {
      return { error: 'Schedule not found' }
    }

    // Calculate new next send time if frequency or time changed
    const nextSend = data.frequency || data.time
      ? calculateNextSendTime({
        frequency: data.frequency || existing.frequency,
        time: data.time || existing.time,
        dayOfWeek: data.dayOfWeek ?? existing.dayOfWeek ?? undefined,
        dayOfMonth: data.dayOfMonth ?? existing.dayOfMonth ?? undefined,
        recipients: data.recipients || existing.recipients,
        format: data.format || existing.format,
      } as CreateReportScheduleData)
      : undefined

    const schedule = await prisma.reportSchedule.update({
      where: { id: scheduleId },
      data: {
        frequency: data.frequency,
        time: data.time,
        dayOfWeek: data.dayOfWeek,
        dayOfMonth: data.dayOfMonth,
        recipients: data.recipients,
        format: data.format,
        nextSend,
      },
    })

    revalidatePath(`/dashboard/reports/${existing.reportId}`)

    return { success: true, schedule }
  } catch (error) {
    console.error('Error updating report schedule:', error)
    return { error: 'Failed to update report schedule' }
  }
}

export async function deleteReportSchedule(scheduleId: string) {

  try {
    const user = await requireUser()

    // Verify ownership through report
    const existing = await prisma.reportSchedule.findFirst({
      where: { id: scheduleId },
      include: { report: true },
    })

    if (!existing || existing.report.organizationId !== user.organizationId) {
      return { error: 'Schedule not found' }
    }

    await prisma.reportSchedule.delete({
      where: { id: scheduleId },
    })

    revalidatePath(`/dashboard/reports/${existing.reportId}`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting report schedule:', error)
    return { error: 'Failed to delete report schedule' }
  }
}

// ===== REPORT SHARING =====

export async function generateShareToken(reportId: string) {

  try {
    const user = await requireUser()

    // Verify ownership
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
    })

    if (!report) {
      return { error: 'Report not found' }
    }

    // Generate unique share token
    const shareToken = randomBytes(32).toString('hex')

    await prisma.report.update({
      where: { id: reportId },
      data: {
        isPublic: true,
        shareToken,
      },
    })

    revalidatePath(`/dashboard/reports/${reportId}`)

    return { success: true, shareToken }
  } catch (error) {
    console.error('Error generating share token:', error)
    return { error: 'Failed to generate share token' }
  }
}

export async function revokeShareToken(reportId: string) {

  try {
    const user = await requireUser()

    // Verify ownership
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
    })

    if (!report) {
      return { error: 'Report not found' }
    }

    await prisma.report.update({
      where: { id: reportId },
      data: {
        isPublic: false,
        shareToken: null,
      },
    })

    revalidatePath(`/dashboard/reports/${reportId}`)

    return { success: true }
  } catch (error) {
    console.error('Error revoking share token:', error)
    return { error: 'Failed to revoke share token' }
  }
}

export async function getReportByShareToken(shareToken: string) {
  try {
    const report = await prisma.report.findFirst({
      where: {
        shareToken,
        isPublic: true,
      },
      include: {
        template: true,
      },
    })

    if (!report) {
      return { error: 'Report not found or not public' }
    }

    return { success: true, report }
  } catch (error) {
    console.error('Error fetching shared report:', error)
    return { error: 'Failed to fetch shared report' }
  }
}

// ===== HELPER FUNCTIONS =====

function calculateNextSendTime(data: CreateReportScheduleData): Date {
  const now = new Date()
  const [hours, minutes] = data.time.split(':').map(Number)

  let nextSend = new Date(now)
  nextSend.setHours(hours, minutes, 0, 0)

  switch (data.frequency) {
    case 'daily':
      // If time has passed today, schedule for tomorrow
      if (nextSend <= now) {
        nextSend.setDate(nextSend.getDate() + 1)
      }
      break

    case 'weekly':
      // Find next occurrence of dayOfWeek
      if (data.dayOfWeek) {
        const currentDay = nextSend.getDay()
        const daysUntilTarget = (data.dayOfWeek - currentDay + 7) % 7
        nextSend.setDate(nextSend.getDate() + daysUntilTarget)

        // If it's the same day but time has passed, add a week
        if (daysUntilTarget === 0 && nextSend <= now) {
          nextSend.setDate(nextSend.getDate() + 7)
        }
      }
      break

    case 'monthly':
      // Find next occurrence of dayOfMonth
      if (data.dayOfMonth) {
        nextSend.setDate(data.dayOfMonth)

        // If date has passed this month, move to next month
        if (nextSend <= now) {
          nextSend.setMonth(nextSend.getMonth() + 1)
        }
      }
      break
  }

  return nextSend
}

// ===== DATA SOURCE FETCHING FOR BUILDER =====

export async function getAvailableDataSources() {

  try {
    const user = await requireUser()

    const [forms, spreadsheets] = await Promise.all([
      prisma.form.findMany({
        where: { organizationId: user.organizationId },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.spreadsheet.findMany({
        where: { organizationId: user.organizationId },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
    ])

    return {
      success: true,
      forms: forms.map(f => ({ id: f.id, name: f.name, type: 'form' as const })),
      spreadsheets: spreadsheets.map(s => ({ id: s.id, name: s.name, type: 'spreadsheet' as const })),
    }
  } catch (error) {
    console.error('Error fetching data sources:', error)
    return { error: 'Failed to fetch data sources' }
  }
}

export async function getReportBuilderData() {

  try {
    const user = await requireUser()
    const organizationId = user.organizationId

    const [forms, spreadsheets, players] = await Promise.all([
      prisma.form.findMany({
        where: { organizationId, isActive: true },
        select: { id: true, name: true, schema: true },
      }),
      prisma.spreadsheet.findMany({
        where: { organizationId },
        select: { id: true, name: true, schema: true },
      }),
      prisma.personOrganization.findMany({
        where: { organizationId },
        select: {
          personId: true,
          position: true,
          person: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { person: { firstName: 'asc' } },
      }),
    ])

    // Process Data Points
    const dataPoints: any[] = []

    // 1. Form Fields
    forms.forEach(form => {
      const fields = (form.schema as any[]) || []
      if (Array.isArray(fields)) {
        fields.forEach(field => {
          if (['number', 'rating', 'scale', 'select', 'radio'].includes(field.type)) {
            dataPoints.push({
              id: `form:${form.id}:${field.id}`,
              name: `${form.name} - ${field.label}`,
              group: 'Forms',
              type: 'form',
              sourceId: form.id,
              metricKey: `data.${field.id}`,
            })
          }
        })
      }
    })

    // 2. Spreadsheet Columns
    spreadsheets.forEach(sheet => {
      const columns = (sheet.schema as any[]) || []
      if (Array.isArray(columns)) {
        columns.forEach(col => {
          if (['number', 'currency', 'percentage', 'text'].includes(col.type)) {
            dataPoints.push({
              id: `sheet:${sheet.id}:${col.id}`,
              name: `${sheet.name} - ${col.name}`,
              group: 'Spreadsheets',
              type: 'spreadsheet',
              sourceId: sheet.id,
              metricKey: col.id, // Spreadsheets usually flatten data, key is column ID or name
            })
          }
        })
      }
    })

    // 3. Events
    dataPoints.push({
      id: 'event:attendance',
      name: 'Attendance Rate',
      group: 'Events',
      type: 'event',
      metricKey: 'attendance_rate',
    })
    dataPoints.push({
      id: 'event:count',
      name: 'Event Count',
      group: 'Events',
      type: 'event',
      metricKey: 'count',
    })

    // 4. Players
    dataPoints.push({
      id: 'player:count',
      name: 'Player Count',
      group: 'Players',
      type: 'player',
      metricKey: 'count',
    })

    // Process Populations
    const populations: any[] = []

    // 1. All Players
    populations.push({
      id: 'all',
      name: 'All Players',
      type: 'all',
    })

    // 2. Positions (derived from players)
    const positions = new Set<string>()
    players.forEach(p => {
      if (p.position) positions.add(p.position)
    })

    Array.from(positions).sort().forEach(pos => {
      populations.push({
        id: `position:${pos}`,
        name: `Position: ${pos}`,
        type: 'position',
      })
    })

    // 3. Individual Players
    players.forEach(p => {
      const name = p.person.firstName + ' ' + p.person.lastName
      populations.push({
        id: `player:${p.personId}`,
        name: name,
        type: 'player',
      })
    })

    return { success: true, dataPoints, populations }
  } catch (error) {
    console.error('Error fetching report builder data:', error)
    return { error: 'Failed to fetch data' }
  }
}

// ===== DATA FETCHING FOR REPORTS =====

export async function getReportData(reportId: string, filters?: any) {

  try {
    const user = await requireUser()

    // Get report configuration
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: user.organizationId,
      },
    })

    if (!report) {
      return { error: 'Report not found' }
    }

    const config = report.config as ReportConfig

    // Use new query builder to fetch and aggregate real data
    const { buildReportData } = await import('@/lib/reports/query-builder')
    const reportData = await buildReportData(config, user.organizationId, filters)

    return { success: true, ...reportData, config }
  } catch (error) {
    console.error('Error fetching report data:', error)
    return { error: 'Failed to fetch report data' }
  }
}
