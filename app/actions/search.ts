'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { Prisma } from '@prisma/client'

export interface SearchFilters {
  entityTypes?: SearchEntityType[]
  dateRange?: {
    from: Date
    to: Date
  }
  categories?: string[]
}

export type SearchEntityType =
  | 'player'
  | 'note'
  | 'event'
  | 'form'
  | 'form_template'
  | 'file'
  | 'spreadsheet'
  | 'spreadsheet_template'
  | 'event_template'
  | 'canvas'
  | 'plan'

export interface SearchResult {
  id: string
  type: SearchEntityType
  title: string
  description?: string
  excerpt?: string
  metadata: Record<string, any>
  url: string
  relevance: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  executionTime: number
}

/**
 * Global search across all entities in the organization
 *
 * @param query - Search query string (min 2 characters)
 * @param filters - Optional filters for entity types, date range, categories
 * @param limit - Maximum results to return (default 50)
 * @param offset - Pagination offset (default 0)
 */
export async function globalSearch(
  query: string,
  filters?: SearchFilters,
  limit: number = 50,
  offset: number = 0
): Promise<{ success: true; data: SearchResponse } | { error: string }> {
  const startTime = Date.now()

  // Validate query
  if (!query || query.trim().length < 2) {
    return { error: 'Search query must be at least 2 characters' }
  }

  // Get authenticated user
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)
    const organizationId = dbUser.organizationId

    // Prepare search query (convert to tsquery format)
    const searchQuery = query
      .trim()
      .split(/\s+/)
      .map(word => `${word}:*`)
      .join(' & ')

    // Determine which entity types to search
    const entityTypes = filters?.entityTypes || [
      'player',
      'note',
      'event',
      'form',
      'form_template',
      'file',
      'spreadsheet',
      'spreadsheet_template',
      'event_template',
      'canvas',
      'plan',
    ]

    // Execute searches in parallel
    const searchPromises = []

    if (entityTypes.includes('player')) {
      searchPromises.push(searchPlayers(searchQuery, organizationId, dbUser.id))
    }
    if (entityTypes.includes('note')) {
      searchPromises.push(searchNotes(searchQuery, organizationId, dbUser.id))
    }
    if (entityTypes.includes('event')) {
      searchPromises.push(searchEvents(searchQuery, organizationId, filters?.dateRange))
    }
    if (entityTypes.includes('form')) {
      searchPromises.push(searchForms(searchQuery, organizationId))
    }
    if (entityTypes.includes('form_template')) {
      searchPromises.push(searchFormTemplates(searchQuery, organizationId))
    }
    if (entityTypes.includes('file')) {
      searchPromises.push(searchFiles(searchQuery, organizationId))
    }
    if (entityTypes.includes('spreadsheet')) {
      searchPromises.push(searchSpreadsheets(searchQuery, organizationId))
    }
    if (entityTypes.includes('spreadsheet_template')) {
      searchPromises.push(searchSpreadsheetTemplates(searchQuery, organizationId))
    }
    if (entityTypes.includes('event_template')) {
      searchPromises.push(searchEventTemplates(searchQuery, organizationId))
    }
    if (entityTypes.includes('canvas')) {
      searchPromises.push(searchCanvasBoards(searchQuery, organizationId))
    }
    if (entityTypes.includes('plan')) {
      searchPromises.push(searchPlans(searchQuery, organizationId))
    }

    const searchResults = await Promise.all(searchPromises)

    // Merge and sort by relevance
    const mergedResults = searchResults
      .flat()
      .sort((a, b) => b.relevance - a.relevance)
      .slice(offset, offset + limit)

    const totalCount = searchResults.flat().length

    // Log search activity
    await prisma.activity.create({
      data: {
        type: 'search_performed',
        data: {
          query,
          resultCount: totalCount,
          entityTypes,
        },
        userId: user.id,
      },
    })

    const executionTime = Date.now() - startTime

    return {
      success: true,
      data: {
        results: mergedResults,
        totalCount,
        executionTime,
      },
    }
  } catch (error) {
    console.error('Search error:', error)
    return { error: 'Failed to perform search' }
  }
}

/**
 * Search players (Person entities with role=player)
 */
async function searchPlayers(
  searchQuery: string,
  organizationId: string,
  userId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      p.id,
      p."firstName",
      p."lastName",
      p.email,
      p.photo,
      p."createdAt",
      p."updatedAt",
      po.position,
      po."jerseyNumber",
      po.status,
      po.tags,
      ts_rank(p.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM persons p
    INNER JOIN person_organizations po ON p.id = po."personId"
    WHERE po."organizationId" = ${organizationId}
      AND po.role = 'player'
      AND p.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'player' as const,
    title: `${row.firstName} ${row.lastName}`,
    description: row.position || undefined,
    metadata: {
      position: row.position,
      jerseyNumber: row.jerseyNumber,
      status: row.status,
      tags: row.tags,
      photo: row.photo,
    },
    url: `/dashboard/players/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search notes with privacy filtering
 */
async function searchNotes(
  searchQuery: string,
  organizationId: string,
  userId: string
): Promise<SearchResult[]> {
  // Get user's organization role to determine permissions
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  })

  const userRoles = user?.roles.map(r => r.role.name) || []
  const isMedical = userRoles.some(r => ['doctor', 'physio', 'admin'].includes(r.toLowerCase()))
  const isCoach = userRoles.some(r => ['coach', 'admin'].includes(r.toLowerCase()))

  // Build privacy filter based on user role
  const privacyConditions = []
  privacyConditions.push("n.\"privacyLevel\" = 'public'")

  if (isMedical) {
    privacyConditions.push("n.\"privacyLevel\" = 'medical'")
  }

  if (isCoach) {
    privacyConditions.push("n.\"privacyLevel\" = 'coaching'")
  }

  privacyConditions.push(`n.\"authorId\" = '${userId}'`)

  const privacyFilter = `(${privacyConditions.join(' OR ')})`

  const results = await prisma.$queryRaw<any[]>`
    SELECT
      n.id,
      n.title,
      n.content,
      n."privacyLevel",
      n.tags,
      n."createdAt",
      n."updatedAt",
      u.name as "authorName",
      ts_rank(n.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM notes n
    INNER JOIN users u ON n."authorId" = u.id
    WHERE n."organizationId" = ${organizationId}
      AND n.search_vector @@ to_tsquery('english', ${searchQuery})
      AND ${Prisma.raw(privacyFilter)}
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => {
    // Extract text excerpt from Tiptap JSON content
    let excerpt = ''
    try {
      const content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content
      if (content?.content) {
        const textNodes = content.content
          .filter((node: any) => node.type === 'paragraph')
          .slice(0, 2)
        excerpt = textNodes
          .map((node: any) =>
            node.content?.map((c: any) => c.text).join('') || ''
          )
          .join(' ')
          .slice(0, 150)
      }
    } catch (e) {
      excerpt = ''
    }

    return {
      id: row.id,
      type: 'note' as const,
      title: row.title,
      excerpt: excerpt || undefined,
      metadata: {
        privacyLevel: row.privacyLevel,
        tags: row.tags,
        author: row.authorName,
      },
      url: `/dashboard/notes/${row.id}`,
      relevance: parseFloat(row.rank) || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  })
}

/**
 * Search events
 */
async function searchEvents(
  searchQuery: string,
  organizationId: string,
  dateRange?: { from: Date; to: Date }
): Promise<SearchResult[]> {
  let dateFilter = ''
  if (dateRange) {
    dateFilter = `AND e."startTime" >= '${dateRange.from.toISOString()}' AND e."startTime" <= '${dateRange.to.toISOString()}'`
  }

  const results = await prisma.$queryRaw<any[]>`
    SELECT
      e.id,
      e.title,
      e.description,
      e.type,
      e.location,
      e."startTime",
      e."endTime",
      e."isRecurring",
      e."createdAt",
      e."updatedAt",
      ts_rank(e.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM events e
    WHERE e."organizationId" = ${organizationId}
      AND e.search_vector @@ to_tsquery('english', ${searchQuery})
      ${Prisma.raw(dateFilter)}
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'event' as const,
    title: row.title,
    description: row.description || undefined,
    metadata: {
      type: row.type,
      location: row.location,
      startTime: row.startTime,
      endTime: row.endTime,
      isRecurring: row.isRecurring,
    },
    url: `/dashboard/calendar?eventId=${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search forms
 */
async function searchForms(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      f.id,
      f.name,
      f.description,
      f.category,
      f."isActive",
      f."scheduleType",
      f."createdAt",
      f."updatedAt",
      COUNT(fr.id)::int as "responseCount",
      ts_rank(f.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM forms f
    LEFT JOIN form_responses fr ON f.id = fr."formId"
    WHERE f."organizationId" = ${organizationId}
      AND f.search_vector @@ to_tsquery('english', ${searchQuery})
    GROUP BY f.id
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'form' as const,
    title: row.name,
    description: row.description || undefined,
    metadata: {
      category: row.category,
      isActive: row.isActive,
      scheduleType: row.scheduleType,
      responseCount: row.responseCount,
    },
    url: `/dashboard/forms/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search form templates
 */
async function searchFormTemplates(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      ft.id,
      ft.name,
      ft.description,
      ft.category,
      ft."isPublic",
      ft."createdAt",
      ft."updatedAt",
      ts_rank(ft.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM form_templates ft
    WHERE (ft."organizationId" = ${organizationId} OR ft."isPublic" = true)
      AND ft.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'form_template' as const,
    title: row.name,
    description: row.description || undefined,
    metadata: {
      category: row.category,
      isPublic: row.isPublic,
    },
    url: `/dashboard/forms/templates/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search files
 */
async function searchFiles(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      f.id,
      f.name,
      f.size,
      f."mimeType",
      f.tags,
      f."createdAt",
      f."updatedAt",
      u.name as "uploaderName",
      ts_rank(f.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM files f
    INNER JOIN users u ON f."uploadedById" = u.id
    WHERE f."organizationId" = ${organizationId}
      AND f.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'file' as const,
    title: row.name,
    metadata: {
      size: row.size,
      mimeType: row.mimeType,
      tags: row.tags,
      uploader: row.uploaderName,
    },
    url: `/dashboard/files/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search spreadsheets
 */
async function searchSpreadsheets(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      s.id,
      s.name,
      s.description,
      s.category,
      s."createdAt",
      s."updatedAt",
      ts_rank(s.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM spreadsheets s
    WHERE s."organizationId" = ${organizationId}
      AND s.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'spreadsheet' as const,
    title: row.name,
    description: row.description || undefined,
    metadata: {
      category: row.category,
    },
    url: `/dashboard/spreadsheets/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search spreadsheet templates
 */
async function searchSpreadsheetTemplates(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      st.id,
      st.name,
      st.description,
      st.category,
      st."createdAt",
      st."updatedAt",
      ts_rank(st.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM spreadsheet_templates st
    WHERE st."organizationId" = ${organizationId}
      AND st.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'spreadsheet_template' as const,
    title: row.name,
    description: row.description || undefined,
    metadata: {
      category: row.category,
    },
    url: `/dashboard/spreadsheets/templates/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search event templates
 */
async function searchEventTemplates(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      et.id,
      et.name,
      et.description,
      et.type,
      et."defaultDuration",
      et."createdAt",
      et."updatedAt",
      ts_rank(et.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM event_templates et
    WHERE et."organizationId" = ${organizationId}
      AND et.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'event_template' as const,
    title: row.name,
    description: row.description || undefined,
    metadata: {
      type: row.type,
      defaultDuration: row.defaultDuration,
    },
    url: `/dashboard/calendar/templates/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search canvas boards
 */
async function searchCanvasBoards(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      c.id,
      c.name,
      c."createdAt",
      c."updatedAt",
      ts_rank(c.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM canvas_boards c
    WHERE c."organizationId" = ${organizationId}
      AND c.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'canvas' as const,
    title: row.name,
    metadata: {},
    url: `/dashboard/canvas/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}

/**
 * Search plans
 */
async function searchPlans(
  searchQuery: string,
  organizationId: string
): Promise<SearchResult[]> {
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      p.id,
      p.name,
      p.description,
      p."startDate",
      p."endDate",
      p."createdAt",
      p."updatedAt",
      ts_rank(p.search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM plans p
    WHERE p."organizationId" = ${organizationId}
      AND p.search_vector @@ to_tsquery('english', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `

  return results.map((row) => ({
    id: row.id,
    type: 'plan' as const,
    title: row.name,
    description: row.description || undefined,
    metadata: {
      startDate: row.startDate,
      endDate: row.endDate,
    },
    url: `/dashboard/planner/${row.id}`,
    relevance: parseFloat(row.rank) || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }))
}
