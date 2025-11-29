'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { Prisma } from '@prisma/client'

// Types
export interface ColumnDefinition {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'person' | 'event' | 'team' | 'formula'
  settings?: {
    filter?: string // For person type: 'players', 'staff', 'all'
    formula?: string // For formula type
  }
}

export interface SpreadsheetRow {
  [key: string]: any
}

export interface CreateSpreadsheetData {
  name: string
  description?: string
  schema: ColumnDefinition[]
  data?: SpreadsheetRow[]
  templateId?: string
}

export interface UpdateSpreadsheetData {
  name?: string
  description?: string
  schema?: ColumnDefinition[]
  data?: SpreadsheetRow[]
  changeNote?: string
}

// Create a new spreadsheet
export async function createSpreadsheet(data: CreateSpreadsheetData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const spreadsheet = await prisma.spreadsheet.create({
      data: {
        name: data.name,
        description: data.description,
        schema: data.schema as unknown as Prisma.InputJsonValue,
        data: (data.data || []) as unknown as Prisma.InputJsonValue,
        templateId: data.templateId,
        organizationId: dbUser.organizationId,
        createdById: user.id,
        version: 1,
      },
    })

    // Create initial version
    await prisma.spreadsheetVersion.create({
      data: {
        spreadsheetId: spreadsheet.id,
        version: 1,
        schema: data.schema as unknown as Prisma.InputJsonValue,
        data: (data.data || []) as unknown as Prisma.InputJsonValue,
        createdById: user.id,
        changeNote: 'Initial version',
      },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true, spreadsheet }
  } catch (error) {
    console.error('Error creating spreadsheet:', error)
    return { error: 'Failed to create spreadsheet' }
  }
}

// Update an existing spreadsheet
export async function updateSpreadsheet(
  spreadsheetId: string,
  data: UpdateSpreadsheetData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    // Get current spreadsheet to check ownership
    const current = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!current || current.organizationId !== dbUser.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update spreadsheet
      const updatedSchema = data.schema ?? current.schema
      const updatedData = data.data ?? current.data

      const spreadsheet = await tx.spreadsheet.update({
        where: { id: spreadsheetId },
        data: {
          name: data.name ?? current.name,
          description: data.description ?? current.description,
          schema: updatedSchema === null ? Prisma.JsonNull : (updatedSchema as unknown as Prisma.InputJsonValue),
          data: updatedData === null ? Prisma.JsonNull : (updatedData as unknown as Prisma.InputJsonValue),
          version: current.version + 1,
        },
      })

      // Create new version if data or schema changed
      if (data.schema || data.data) {
        await tx.spreadsheetVersion.create({
          data: {
            spreadsheetId: spreadsheet.id,
            version: spreadsheet.version,
            schema: updatedSchema === null ? Prisma.JsonNull : (updatedSchema as unknown as Prisma.InputJsonValue),
            data: updatedData === null ? Prisma.JsonNull : (updatedData as unknown as Prisma.InputJsonValue),
            createdById: user.id,
            changeNote: data.changeNote || `Updated to version ${spreadsheet.version}`,
          },
        })
      }

      // Track row-level changes if data changed
      if (data.data) {
        const { getChangedFields } = await import('@/lib/data-management')
        const oldData = (current.data as any[]) || []
        const newData = data.data || []
        const batchId = Math.random().toString(36).substring(7)

        // Track created, updated, and deleted rows
        const oldRowIds = new Set(oldData.map((r: any) => r.id))
        const newRowIds = new Set(newData.map((r: any) => r.id))

        // Created rows
        for (const row of newData) {
          if (!oldRowIds.has(row.id)) {
            await tx.dataChangeLog.create({
              data: {
                spreadsheetId: spreadsheet.id,
                rowId: row.id,
                userId: user.id,
                organizationId: dbUser.organizationId,
                action: 'create',
                previousData: null,
                newData: row as unknown as Prisma.InputJsonValue,
                changedFields: [],
                batchId,
              }
            })
          }
        }

        // Updated rows
        for (const newRow of newData) {
          const oldRow = oldData.find((r: any) => r.id === newRow.id)
          if (oldRow) {
            const changedFields = getChangedFields(oldRow, newRow)
            if (changedFields.length > 0) {
              await tx.dataChangeLog.create({
                data: {
                  spreadsheetId: spreadsheet.id,
                  rowId: newRow.id,
                  userId: user.id,
                  organizationId: dbUser.organizationId,
                  action: 'update',
                  previousData: oldRow as unknown as Prisma.InputJsonValue,
                  newData: newRow as unknown as Prisma.InputJsonValue,
                  changedFields,
                  batchId,
                }
              })
            }
          }
        }

        // Deleted rows
        for (const oldRow of oldData) {
          if (!newRowIds.has(oldRow.id)) {
            await tx.dataChangeLog.create({
              data: {
                spreadsheetId: spreadsheet.id,
                rowId: oldRow.id,
                userId: user.id,
                organizationId: dbUser.organizationId,
                action: 'delete',
                previousData: oldRow as unknown as Prisma.InputJsonValue,
                newData: null,
                changedFields: [],
                batchId,
              }
            })
          }
        }
      }

      return spreadsheet
    })

    revalidatePath('/dashboard/spreadsheets')
    revalidatePath(`/dashboard/spreadsheets/${spreadsheetId}`)
    revalidatePath('/dashboard/data-management')

    return { success: true, spreadsheet: result }
  } catch (error) {
    console.error('Error updating spreadsheet:', error)
    return { error: 'Failed to update spreadsheet' }
  }
}

// Delete a spreadsheet
export async function deleteSpreadsheet(spreadsheetId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== dbUser.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    // Use soft delete instead of hard delete
    const { softDeleteSpreadsheet } = await import('./data-management')
    const result = await softDeleteSpreadsheet(spreadsheetId)

    if (result.error) {
      return { error: result.error }
    }

    revalidatePath('/dashboard/spreadsheets')
    revalidatePath('/dashboard/data-management')

    return { success: true }
  } catch (error) {
    console.error('Error deleting spreadsheet:', error)
    return { error: 'Failed to delete spreadsheet' }
  }
}

// Get all spreadsheets for the organization
export async function getSpreadsheets() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const spreadsheets = await prisma.spreadsheet.findMany({
      where: {
        organizationId: dbUser.organizationId,
        isDeleted: false, // Exclude soft-deleted spreadsheets
      },
      include: {
        template: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return { success: true, spreadsheets }
  } catch (error) {
    console.error('Error fetching spreadsheets:', error)
    return { error: 'Failed to fetch spreadsheets' }
  }
}

// Get a single spreadsheet
export async function getSpreadsheet(spreadsheetId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: {
        template: true,
        versions: {
          orderBy: { version: 'desc' },
          take: 10, // Last 10 versions
        },
      },
    })

    if (!spreadsheet || spreadsheet.organizationId !== dbUser.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    return { success: true, spreadsheet }
  } catch (error) {
    console.error('Error fetching spreadsheet:', error)
    return { error: 'Failed to fetch spreadsheet' }
  }
}

// Get spreadsheet templates
export async function getSpreadsheetTemplates() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const templates = await prisma.spreadsheetTemplate.findMany({
      where: {
        OR: [
          { isPublic: true },
          { organizationId: dbUser.organizationId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, templates }
  } catch (error) {
    console.error('Error fetching templates:', error)
    return { error: 'Failed to fetch templates' }
  }
}

// Create a template (for seeding or user-created templates)
export async function createSpreadsheetTemplate(data: {
  name: string
  description?: string
  category: string
  schema: ColumnDefinition[]
  sampleData?: SpreadsheetRow[]
  isPublic?: boolean
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const template = await prisma.spreadsheetTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        schema: data.schema as unknown as Prisma.InputJsonValue,
        sampleData: (data.sampleData || []) as unknown as Prisma.InputJsonValue,
        isPublic: data.isPublic || false,
        organizationId: dbUser.organizationId,
      },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true, template }
  } catch (error) {
    console.error('Error creating template:', error)
    return { error: 'Failed to create template' }
  }
}

// Restore a specific version
export async function restoreSpreadsheetVersion(
  spreadsheetId: string,
  versionId: string
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== dbUser.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    const version = await prisma.spreadsheetVersion.findUnique({
      where: { id: versionId },
    })

    if (!version || version.spreadsheetId !== spreadsheetId) {
      return { error: 'Version not found' }
    }

    const result = await updateSpreadsheet(spreadsheetId, {
      schema: version.schema as unknown as ColumnDefinition[],
      data: version.data as unknown as SpreadsheetRow[],
      changeNote: `Restored version ${version.version}`,
    })

    return result
  } catch (error) {
    console.error('Error restoring version:', error)
    return { error: 'Failed to restore version' }
  }
}
