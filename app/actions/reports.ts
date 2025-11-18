'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'

// Types
export interface ReportConfig {
  dataSources?: Array<{
    type: 'spreadsheet' | 'form' | 'event' | 'player' | 'note'
    id?: string
    name?: string
  }>
  visualization?: 'line' | 'bar' | 'pie' | 'heatmap' | 'table' | 'area' | 'scatter'
  xAxis?: string
  yAxis?: string
  filters?: {
    dateRange?: { from: string; to: string }
    players?: string[]
    tags?: string[]
    [key: string]: any
  }
  chartOptions?: {
    title?: string
    showLegend?: boolean
    showDataLabels?: boolean
    colorScheme?: string[]
    aggregation?: 'sum' | 'average' | 'count' | 'min' | 'max'
  }
  kpis?: Array<{
    id: string
    label: string
    metric: string
    format?: 'number' | 'percentage' | 'currency'
  }>
}

export interface ReportSection {
  id: string
  type: 'chart' | 'table' | 'stats' | 'text'
  size?: 'full' | 'half' | 'third'
  config: ReportConfig
}

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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const report = await prisma.report.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        config: data.config as unknown as Prisma.InputJsonValue,
        sections: data.sections as unknown as Prisma.InputJsonValue,
        templateId: data.templateId,
        organizationId: dbUser.organizationId,
        createdBy: user.id,
      },
    })

    revalidatePath('/dashboard/reports')

    return { success: true, report }
  } catch (error) {
    console.error('Error creating report:', error)
    return { error: 'Failed to create report' }
  }
}

export async function getReports() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const reports = await prisma.report.findMany({
      where: {
        organizationId: dbUser.organizationId,
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership
    const existing = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
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

    return { success: true, report }
  } catch (error) {
    console.error('Error updating report:', error)
    return { error: 'Failed to update report' }
  }
}

export async function deleteReport(reportId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership
    const existing = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!existing) {
      return { error: 'Report not found' }
    }

    await prisma.report.delete({
      where: { id: reportId },
    })

    revalidatePath('/dashboard/reports')

    return { success: true }
  } catch (error) {
    console.error('Error deleting report:', error)
    return { error: 'Failed to delete report' }
  }
}

// ===== REPORT TEMPLATES =====

export async function getReportTemplates() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const templates = await prisma.reportTemplate.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { organizationId: dbUser.organizationId },
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const template = await prisma.reportTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        config: data.config as unknown as Prisma.InputJsonValue,
        sections: data.sections as unknown as Prisma.InputJsonValue,
        isGlobal: data.isGlobal || false,
        organizationId: data.isGlobal ? null : dbUser.organizationId,
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify report ownership
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership through report
    const existing = await prisma.reportSchedule.findFirst({
      where: { id: scheduleId },
      include: { report: true },
    })

    if (!existing || existing.report.organizationId !== dbUser.organizationId) {
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership through report
    const existing = await prisma.reportSchedule.findFirst({
      where: { id: scheduleId },
      include: { report: true },
    })

    if (!existing || existing.report.organizationId !== dbUser.organizationId) {
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
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
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Verify ownership
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
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

// ===== DATA FETCHING FOR REPORTS =====

export async function getReportData(reportId: string, filters?: any) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get report configuration
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        organizationId: dbUser.organizationId,
      },
    })

    if (!report) {
      return { error: 'Report not found' }
    }

    const config = report.config as ReportConfig
    const mergedFilters = { ...config.filters, ...filters }

    // Fetch data based on data sources
    const data = await fetchDataForReport(config, mergedFilters, dbUser.organizationId)

    return { success: true, data, config }
  } catch (error) {
    console.error('Error fetching report data:', error)
    return { error: 'Failed to fetch report data' }
  }
}

async function fetchDataForReport(
  config: ReportConfig,
  filters: any,
  organizationId: string
) {
  // This is a placeholder - actual implementation would fetch from various sources
  // based on config.dataSources and apply filters

  const results: any[] = []

  if (config.dataSources) {
    for (const source of config.dataSources) {
      switch (source.type) {
        case 'spreadsheet':
          // Fetch spreadsheet data
          if (source.id) {
            const spreadsheet = await prisma.spreadsheet.findFirst({
              where: { id: source.id, organizationId },
            })
            if (spreadsheet) {
              results.push({
                source: source.type,
                name: spreadsheet.name,
                data: spreadsheet.data,
              })
            }
          }
          break

        case 'form':
          // Fetch form responses
          if (source.id) {
            const responses = await prisma.formResponse.findMany({
              where: {
                formId: source.id,
                form: { organizationId },
              },
              include: {
                personOrg: {
                  include: {
                    person: true,
                  },
                },
              },
            })
            results.push({
              source: source.type,
              name: source.name,
              data: responses,
            })
          }
          break

        case 'player':
          // Fetch player data
          const players = await prisma.personOrganization.findMany({
            where: {
              organizationId,
              role: 'player',
            },
            include: {
              person: true,
            },
          })
          results.push({
            source: source.type,
            name: 'Players',
            data: players,
          })
          break

        case 'event':
          // Fetch event data
          const events = await prisma.event.findMany({
            where: {
              organizationId,
            },
            include: {
              attendance: true,
            },
          })
          results.push({
            source: source.type,
            name: 'Events',
            data: events,
          })
          break
      }
    }
  }

  return results
}
