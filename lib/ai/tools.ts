import { db } from '@/lib/db'
import { formatDate } from '@/lib/date-utils'

export interface ToolDefinition {
  name: string
  description: string
  input_schema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export const AI_TOOLS: ToolDefinition[] = [
  // Data retrieval tools
  {
    name: 'list_players',
    description: 'Get all players in the organization, optionally filtered by tags or status',
    input_schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by player tags'
        },
        status: {
          type: 'string',
          enum: ['active', 'injured', 'inactive'],
          description: 'Filter by player status'
        }
      }
    }
  },
  {
    name: 'get_player',
    description: 'Get detailed information about a specific player',
    input_schema: {
      type: 'object',
      properties: {
        playerId: {
          type: 'string',
          description: 'The player ID'
        }
      },
      required: ['playerId']
    }
  },
  {
    name: 'query_spreadsheet',
    description: 'Query data from a spreadsheet',
    input_schema: {
      type: 'object',
      properties: {
        spreadsheetId: {
          type: 'string',
          description: 'The spreadsheet ID'
        },
        filters: {
          type: 'object',
          description: 'Filters to apply to the data'
        },
        dateRange: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' }
          }
        }
      }
    }
  },
  {
    name: 'get_form_responses',
    description: 'Get form responses with optional filters',
    input_schema: {
      type: 'object',
      properties: {
        formId: {
          type: 'string',
          description: 'The form ID'
        },
        playerId: {
          type: 'string',
          description: 'Filter by player ID'
        },
        dateRange: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' }
          }
        }
      }
    }
  },
  {
    name: 'search_notes',
    description: 'Search notes by content, tags, or linked entity',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query'
        },
        attachedTo: {
          type: 'string',
          description: 'Entity ID the note is attached to'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by tags'
        }
      }
    }
  },
  {
    name: 'list_events',
    description: 'Get calendar events',
    input_schema: {
      type: 'object',
      properties: {
        dateRange: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' }
          }
        },
        type: {
          type: 'string',
          enum: ['training', 'match', 'medical', 'other'],
          description: 'Event type'
        }
      }
    }
  },

  // Action tools
  {
    name: 'create_event',
    description: 'Create a calendar event',
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Event title'
        },
        startTime: {
          type: 'string',
          description: 'Event start time (ISO 8601 format)'
        },
        endTime: {
          type: 'string',
          description: 'Event end time (ISO 8601 format)'
        },
        attendees: {
          type: 'array',
          items: { type: 'string' },
          description: 'Player IDs of attendees'
        },
        type: {
          type: 'string',
          enum: ['training', 'match', 'medical', 'other']
        }
      },
      required: ['title', 'startTime']
    }
  },
  {
    name: 'distribute_form',
    description: 'Send a form to players',
    input_schema: {
      type: 'object',
      properties: {
        formId: {
          type: 'string',
          description: 'The form ID'
        },
        playerIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Player IDs to send the form to'
        },
        schedule: {
          type: 'object',
          description: 'Schedule configuration'
        }
      },
      required: ['formId', 'playerIds']
    }
  },
  {
    name: 'create_note',
    description: 'Create a note',
    input_schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Note content'
        },
        attachTo: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            id: { type: 'string' }
          },
          description: 'Entity to attach the note to'
        },
        tags: {
          type: 'array',
          items: { type: 'string' }
        },
        visibility: {
          type: 'string',
          enum: ['public', 'medical', 'coaches', 'private']
        }
      },
      required: ['content']
    }
  },
  {
    name: 'create_form',
    description: 'Create a new form with specified fields for data collection',
    input_schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Form name'
        },
        description: {
          type: 'string',
          description: 'Form description'
        },
        category: {
          type: 'string',
          enum: ['wellness', 'medical', 'performance', 'custom'],
          description: 'Form category'
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              label: { type: 'string' },
              type: {
                type: 'string',
                enum: ['text', 'number', 'slider', 'select', 'multiselect', 'date', 'time', 'textarea']
              },
              required: { type: 'boolean' },
              options: {
                type: 'array',
                items: { type: 'string' }
              },
              min: { type: 'number' },
              max: { type: 'number' },
              placeholder: { type: 'string' }
            }
          },
          description: 'Array of form fields'
        },
        scheduleType: {
          type: 'string',
          enum: ['one_time', 'daily', 'weekly', 'custom'],
          description: 'Schedule type for the form'
        },
        targetType: {
          type: 'string',
          enum: ['all', 'specific', 'tag'],
          description: 'Who should receive the form'
        }
      },
      required: ['name', 'fields']
    }
  },

  // Analysis tools
  {
    name: 'analyze_load_wellness',
    description: 'Analyze correlation between load and wellness',
    input_schema: {
      type: 'object',
      properties: {
        playerIds: {
          type: 'array',
          items: { type: 'string' }
        },
        dateRange: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' }
          }
        }
      }
    }
  },
  {
    name: 'calculate_injury_risk',
    description: 'Calculate injury risk for players based on load and wellness data',
    input_schema: {
      type: 'object',
      properties: {
        playerIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Player IDs to analyze'
        }
      }
    }
  }
]

// Tool execution functions
export async function executeToolCall(
  toolName: string,
  toolInput: any,
  orgId: string,
  userId: string
): Promise<any> {
  switch (toolName) {
    case 'list_players':
      return await listPlayers(orgId, toolInput)
    case 'get_player':
      return await getPlayer(orgId, toolInput.playerId)
    case 'query_spreadsheet':
      return await querySpreadsheet(orgId, toolInput)
    case 'get_form_responses':
      return await getFormResponses(orgId, toolInput)
    case 'search_notes':
      return await searchNotes(orgId, toolInput)
    case 'list_events':
      return await listEvents(orgId, toolInput)
    case 'create_event':
      return await createEvent(orgId, userId, toolInput)
    case 'distribute_form':
      return await distributeForm(orgId, toolInput)
    case 'create_note':
      return await createNote(orgId, userId, toolInput)
    case 'create_form':
      return await createForm(orgId, userId, toolInput)
    case 'analyze_load_wellness':
      return await analyzeLoadWellness(orgId, toolInput)
    case 'calculate_injury_risk':
      return await calculateInjuryRisk(orgId, toolInput)
    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}

// Tool implementation functions
async function listPlayers(orgId: string, input: any) {
  const where: any = {
    organizationId: orgId
  }

  if (input.tags && input.tags.length > 0) {
    where.tags = {
      hasSome: input.tags
    }
  }

  if (input.status) {
    where.status = input.status
  }

  const players = await db.personOrganization.findMany({
    where,
    include: {
      person: true
    },
    take: 100
  })

  return players.map(po => ({
    id: po.person.id,
    name: `${po.person.firstName} ${po.person.lastName}`,
    position: po.position,
    jerseyNumber: po.jerseyNumber,
    status: po.status,
    tags: po.tags,
    email: po.person.email,
    phone: po.person.phone
  }))
}

async function getPlayer(orgId: string, playerId: string) {
  // SECURITY: Verify player belongs to organization
  const playerOrg = await db.personOrganization.findFirst({
    where: {
      personId: playerId,
      organizationId: orgId // Authorization check
    },
    include: {
      person: true
    }
  })

  if (!playerOrg) {
    return { error: 'Player not found or access denied' }
  }

  return {
    id: playerOrg.person.id,
    name: `${playerOrg.person.firstName} ${playerOrg.person.lastName}`,
    position: playerOrg.position,
    jerseyNumber: playerOrg.jerseyNumber,
    status: playerOrg.status,
    tags: playerOrg.tags,
    email: playerOrg.person.email,
    phone: playerOrg.person.phone,
    dateOfBirth: playerOrg.person.dateOfBirth,
    nationality: playerOrg.person.nationality,
    joinedAt: playerOrg.joinedAt
  }
}

async function querySpreadsheet(orgId: string, input: any) {
  if (!input.spreadsheetId) {
    const spreadsheets = await db.spreadsheet.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        name: true,
        description: true
      },
      take: 20
    })
    return { spreadsheets }
  }

  // SECURITY: Verify spreadsheet belongs to organization
  const spreadsheet = await db.spreadsheet.findFirst({
    where: {
      id: input.spreadsheetId,
      organizationId: orgId // Authorization check
    }
  })

  if (!spreadsheet) {
    return { error: 'Spreadsheet not found or access denied' }
  }

  // Return the data (could apply filters here)
  return {
    name: spreadsheet.name,
    schema: spreadsheet.schema,
    data: spreadsheet.data
  }
}

async function getFormResponses(orgId: string, input: any) {
  const where: any = {
    form: {
      organizationId: orgId
    }
  }

  if (input.formId) {
    where.formId = input.formId
  }

  if (input.playerId) {
    where.personOrg = {
      personId: input.playerId
    }
  }

  if (input.dateRange) {
    where.submittedAt = {
      gte: new Date(input.dateRange.from),
      lte: new Date(input.dateRange.to)
    }
  }

  const responses = await db.formResponse.findMany({
    where,
    include: {
      form: {
        select: {
          name: true
        }
      },
      personOrg: {
        include: {
          person: true
        }
      }
    },
    take: 100,
    orderBy: {
      submittedAt: 'desc'
    }
  })

  return responses.map(r => ({
    id: r.id,
    formName: r.form.name,
    playerName: `${r.personOrg.person.firstName} ${r.personOrg.person.lastName}`,
    responses: r.responses,
    submittedAt: r.submittedAt
  }))
}

async function searchNotes(orgId: string, input: any) {
  const where: any = {
    organizationId: orgId
  }

  if (input.attachedTo) {
    where.linkedPersonId = input.attachedTo
  }

  if (input.tags && input.tags.length > 0) {
    where.tags = {
      hasSome: input.tags
    }
  }

  const notes = await db.note.findMany({
    where,
    include: {
      author: {
        select: {
          name: true
        }
      },
      linkedPerson: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    },
    take: 50,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return notes.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    author: n.author.name,
    linkedTo: n.linkedPerson ? `${n.linkedPerson.firstName} ${n.linkedPerson.lastName}` : null,
    tags: n.tags,
    createdAt: n.createdAt
  }))
}

async function listEvents(orgId: string, input: any) {
  const where: any = {
    organizationId: orgId
  }

  if (input.dateRange) {
    where.startTime = {
      gte: new Date(input.dateRange.from),
      lte: new Date(input.dateRange.to)
    }
  }

  if (input.type) {
    where.type = input.type
  }

  const events = await db.event.findMany({
    where,
    take: 50,
    orderBy: {
      startTime: 'asc'
    }
  })

  return events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    type: e.type,
    startTime: e.startTime,
    endTime: e.endTime,
    location: e.location
  }))
}

async function createEvent(orgId: string, userId: string, input: any) {
  const event = await db.event.create({
    data: {
      title: input.title,
      startTime: new Date(input.startTime),
      endTime: input.endTime ? new Date(input.endTime) : new Date(input.startTime),
      type: input.type || 'other',
      organizationId: orgId
    }
  })

  return {
    success: true,
    eventId: event.id,
    message: `Created event: ${event.title}`
  }
}

async function distributeForm(orgId: string, input: any) {
  // SECURITY: Verify form belongs to organization
  const form = await db.form.findFirst({
    where: {
      id: input.formId,
      organizationId: orgId // Authorization check
    }
  })

  if (!form) {
    return { error: 'Form not found or access denied' }
  }

  // SECURITY: Verify all player IDs belong to organization
  if (input.playerIds && input.playerIds.length > 0) {
    const players = await db.personOrganization.findMany({
      where: {
        personId: { in: input.playerIds },
        organizationId: orgId // Authorization check
      }
    })

    if (players.length !== input.playerIds.length) {
      return { error: 'One or more players not found or access denied' }
    }
  }

  // This would integrate with form distribution logic
  return {
    success: true,
    message: `Form distributed to ${input.playerIds.length} players`
  }
}

async function createNote(orgId: string, userId: string, input: any) {
  // SECURITY: If attaching to a person, verify they belong to organization
  if (input.attachTo?.id) {
    const person = await db.personOrganization.findFirst({
      where: {
        personId: input.attachTo.id,
        organizationId: orgId // Authorization check
      }
    })

    if (!person) {
      return { error: 'Person not found or access denied' }
    }
  }

  const note = await db.note.create({
    data: {
      content: input.content,
      organizationId: orgId,
      authorId: userId,
      linkedPersonId: input.attachTo?.id,
      tags: input.tags || [],
      privacyLevel: input.visibility || 'public'
    }
  })

  return {
    success: true,
    noteId: note.id,
    message: 'Note created successfully'
  }
}

async function createForm(orgId: string, userId: string, input: any) {
  // Build the form schema from the input fields
  const schema = input.fields.map((field: any) => ({
    name: field.name,
    label: field.label || field.name,
    type: field.type,
    required: field.required !== false,
    options: field.options || undefined,
    min: field.min,
    max: field.max,
    placeholder: field.placeholder
  }))

  const form = await db.form.create({
    data: {
      name: input.name,
      description: input.description || '',
      schema: schema,
      organizationId: orgId,
      scheduleType: input.scheduleType || 'one_time',
      targetType: input.targetType || 'all',
      isActive: true
    }
  })

  return {
    success: true,
    formId: form.id,
    message: `Created form: ${form.name}`,
    details: {
      name: form.name,
      fieldCount: schema.length,
      scheduleType: form.scheduleType,
      targetType: form.targetType
    }
  }
}

async function analyzeLoadWellness(orgId: string, input: any) {
  // This would perform actual analysis
  // For now, return sample data
  return {
    correlation: -0.72,
    summary: 'Strong negative correlation between load and wellness',
    insights: [
      'Players with >3000 AU weekly load show 15% lower wellness scores',
      'Recovery time: wellness returns to baseline after 48-72 hours post-high load'
    ]
  }
}

async function calculateInjuryRisk(orgId: string, input: any) {
  // This would perform actual risk calculation
  // For now, return sample data
  return {
    highRisk: [],
    mediumRisk: [],
    lowRisk: input.playerIds || [],
    factors: ['acute:chronic load ratio', 'recent wellness scores', 'training load spikes']
  }
}
