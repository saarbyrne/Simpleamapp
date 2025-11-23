import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

// ============================================
// DATA SOURCE DEFINITIONS
// ============================================

export type DataSourceType = 'form' | 'spreadsheet' | 'event' | 'player' | 'note'

export interface DataSourceConfig {
  type: DataSourceType
  id?: string
  name?: string
}

export interface MetricConfig {
  field: string
  aggregation: 'sum' | 'average' | 'count' | 'min' | 'max' | 'percentage'
  label: string
}

export interface GroupByConfig {
  field: string
  interval?: 'day' | 'week' | 'month' // for date fields
}

export interface FilterConfig {
  dateRange?: {
    from: Date | string
    to?: Date | string
  }
  playerIds?: string[]
  eventTypes?: string[]
  tags?: string[]
  status?: string[]
}

// ============================================
// DATA FETCHING FUNCTIONS
// ============================================

export async function fetchFormData(
  organizationId: string,
  formId?: string,
  filters?: FilterConfig
) {
  const where: Prisma.FormResponseWhereInput = {
    form: { organizationId },
  }

  if (formId) {
    where.formId = formId
  }

  if (filters?.dateRange?.from) {
    const fromDate = new Date(filters.dateRange.from)
    // Only add date filter if the date is valid
    if (!isNaN(fromDate.getTime())) {
      where.submittedAt = {
        gte: fromDate,
        ...(filters.dateRange.to && {
          lte: new Date(filters.dateRange.to)
        }),
      }
    }
  }

  if (filters?.playerIds && filters.playerIds.length > 0) {
    where.personOrgId = { in: filters.playerIds }
  }

  const responses = await prisma.formResponse.findMany({
    where,
    include: {
      form: {
        select: {
          id: true,
          name: true,
          schema: true,
        },
      },
      personOrg: {
        include: {
          person: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      submittedAt: 'desc',
    },
  })

  return responses.map(response => ({
    id: response.id,
    formId: response.formId,
    formName: response.form.name,
    playerId: response.personOrg?.id,
    playerName: response.personOrg
      ? `${response.personOrg.person.firstName} ${response.personOrg.person.lastName}`
      : 'Unknown',
    data: response.responses as any,
    createdAt: response.submittedAt,
  }))
}

export async function fetchSpreadsheetData(
  organizationId: string,
  spreadsheetId?: string,
  filters?: FilterConfig
) {
  const where: Prisma.SpreadsheetWhereInput = {
    organizationId,
  }

  if (spreadsheetId) {
    where.id = spreadsheetId
  }

  if (filters?.dateRange?.from) {
    const fromDate = new Date(filters.dateRange.from)
    // Only add date filter if the date is valid
    if (!isNaN(fromDate.getTime())) {
      where.updatedAt = {
        gte: fromDate,
        ...(filters.dateRange.to && {
          lte: new Date(filters.dateRange.to)
        }),
      }
    }
  }

  const spreadsheets = await prisma.spreadsheet.findMany({
    where,
    select: {
      id: true,
      name: true,
      data: true,
      schema: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return spreadsheets.map(sheet => {
    const data = sheet.data as any
    return {
      id: sheet.id,
      name: sheet.name,
      columns: (sheet.schema as any)?.columns || [],
      rows: data?.rows || [],
      updatedAt: sheet.updatedAt,
    }
  })
}

export async function fetchEventData(
  organizationId: string,
  filters?: FilterConfig
) {
  const where: Prisma.EventWhereInput = {
    organizationId,
  }

  if (filters?.dateRange?.from) {
    const fromDate = new Date(filters.dateRange.from)
    // Only add date filter if the date is valid
    if (!isNaN(fromDate.getTime())) {
      where.startTime = {
        gte: fromDate,
        ...(filters.dateRange.to && {
          lte: new Date(filters.dateRange.to)
        }),
      }
    }
  }

  if (filters?.eventTypes && filters.eventTypes.length > 0) {
    where.eventType = { in: filters.eventTypes }
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      attendance: {
        include: {
          personOrg: {
            include: {
              person: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      startTime: 'desc',
    },
  })

  return events.map(event => {
    const totalInvited = event.attendance.length
    const attended = event.attendance.filter(a => a.status === 'present').length
    const attendanceRate = totalInvited > 0 ? (attended / totalInvited) * 100 : 0

    return {
      id: event.id,
      title: event.title,
      eventType: event.type,
      start: event.startTime,
      end: event.endTime,
      location: event.location,
      attendance: event.attendance.map(a => ({
        playerId: a.personOrgId,
        playerName: a.personOrg
          ? `${a.personOrg.person.firstName} ${a.personOrg.person.lastName}`
          : 'Unknown',
        status: a.status,
      })),
      totalInvited,
      attended,
      attendanceRate,
    }
  })
}

export async function fetchPlayerData(
  organizationId: string,
  filters?: FilterConfig
) {
  const where: Prisma.PersonOrganizationWhereInput = {
    organizationId,
  }

  if (filters?.playerIds && filters.playerIds.length > 0) {
    where.id = { in: filters.playerIds }
  }

  if (filters?.status && filters.status.length > 0) {
    where.status = { in: filters.status }
  }

  const players = await prisma.personOrganization.findMany({
    where,
    include: {
      person: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          nationality: true,
          photo: true,
        },
      },
    },
    orderBy: {
      person: {
        lastName: 'asc',
      },
    },
  })

  return players.map(player => ({
    id: player.id,
    personId: player.personId,
    firstName: player.person.firstName,
    lastName: player.person.lastName,
    fullName: `${player.person.firstName} ${player.person.lastName}`,
    position: player.position,
    jerseyNumber: player.jerseyNumber,
    status: player.status,
    tags: player.tags,
    dateOfBirth: player.person.dateOfBirth,
    nationality: player.person.nationality,
    photo: player.person.photo,
  }))
}

// ============================================
// DATA AGGREGATION FUNCTIONS
// ============================================

export function aggregateByDateGroup(
  data: any[],
  dateField: string,
  valueField: string,
  aggregation: 'sum' | 'average' | 'count',
  interval: 'day' | 'week' | 'month' = 'day'
): { date: string; value: number }[] {
  const grouped = new Map<string, number[]>()

  data.forEach(item => {
    const date = new Date(item[dateField])
    if (!date || isNaN(date.getTime())) return

    let key: string
    switch (interval) {
      case 'day':
        key = date.toISOString().split('T')[0] // YYYY-MM-DD
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
    }

    const value = extractNumericValue(item, valueField)
    if (value === null) return

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(value)
  })

  const result: { date: string; value: number }[] = []
  grouped.forEach((values, date) => {
    let aggregatedValue: number
    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((sum, v) => sum + v, 0)
        break
      case 'average':
        aggregatedValue = values.reduce((sum, v) => sum + v, 0) / values.length
        break
      case 'count':
        aggregatedValue = values.length
        break
    }
    result.push({ date, value: aggregatedValue })
  })

  return result.sort((a, b) => a.date.localeCompare(b.date))
}

export function aggregateByGroup(
  data: any[],
  groupField: string,
  valueField: string,
  aggregation: 'sum' | 'average' | 'count' | 'min' | 'max'
): { group: string; value: number }[] {
  const grouped = new Map<string, number[]>()

  data.forEach(item => {
    const group = item[groupField]?.toString() || 'Unknown'
    const value = extractNumericValue(item, valueField)
    if (value === null) return

    if (!grouped.has(group)) {
      grouped.set(group, [])
    }
    grouped.get(group)!.push(value)
  })

  const result: { group: string; value: number }[] = []
  grouped.forEach((values, group) => {
    let aggregatedValue: number
    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((sum, v) => sum + v, 0)
        break
      case 'average':
        aggregatedValue = values.reduce((sum, v) => sum + v, 0) / values.length
        break
      case 'count':
        aggregatedValue = values.length
        break
      case 'min':
        aggregatedValue = Math.min(...values)
        break
      case 'max':
        aggregatedValue = Math.max(...values)
        break
    }
    result.push({ group, value: aggregatedValue })
  })

  return result.sort((a, b) => b.value - a.value)
}

export function calculatePercentage(
  data: any[],
  numeratorField: string,
  denominatorField: string
): number {
  const numerator = data.reduce((sum, item) => {
    const value = extractNumericValue(item, numeratorField)
    return sum + (value || 0)
  }, 0)

  const denominator = data.reduce((sum, item) => {
    const value = extractNumericValue(item, denominatorField)
    return sum + (value || 0)
  }, 0)

  return denominator > 0 ? (numerator / denominator) * 100 : 0
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractNumericValue(item: any, field: string): number | null {
  // Handle nested fields (e.g., "data.wellness_score")
  const keys = field.split('.')
  let value: any = item

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      return null
    }
  }

  // Convert to number if possible
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }

  return null
}

export function formatDateForDisplay(dateStr: string, interval: 'day' | 'week' | 'month'): string {
  const date = new Date(dateStr)

  switch (interval) {
    case 'day':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'week':
      return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
}
