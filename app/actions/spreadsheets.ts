'use server'

import { prisma } from '@/lib/db'
import { revalidatePath, unstable_cache } from 'next/cache'
import { getCachedUserWithOrganization, requireUser } from '@/lib/auth/cached-user'
import { Prisma } from '@prisma/client'
import type { ColumnDefinition, SpreadsheetRow } from '@/lib/types/spreadsheet'

// Note: Cannot export constants in "use server" files - they only allow async functions
// Cache is configured inline within each function using unstable_cache with revalidate option

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

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.create({
      data: {
        name: data.name,
        description: data.description,
        schema: data.schema as unknown as Prisma.InputJsonValue,
        data: (data.data || []) as unknown as Prisma.InputJsonValue,
        templateId: data.templateId,
        organizationId: user.organizationId,
        createdById: user.id,
        version: 1,
        tags: [],
        starred: false,
        sharedWith: [],
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

  try {
    const user = await requireUser()

    // Get current spreadsheet to check ownership
    const current = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!current || current.organizationId !== user.organizationId) {
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

      // Track row-level changes if data changed - OPTIMIZED with batch inserts
      if (data.data) {
        const { getChangedFields } = await import('@/lib/data-management')
        const oldData = (current.data as any[]) || []
        const newData = data.data || []
        const batchId = Math.random().toString(36).substring(7)

        // Track created, updated, and deleted rows
        const oldRowIds = new Set(oldData.map((r: any) => r.id))
        const newRowIds = new Set(newData.map((r: any) => r.id))

        // Collect all change logs to insert in a single batch
        const changeLogs: any[] = []

        // Created rows
        for (const row of newData) {
          if (!oldRowIds.has(row.id)) {
            changeLogs.push({
              spreadsheetId: spreadsheet.id,
              rowId: row.id,
              userId: user.id,
              organizationId: user.organizationId,
              action: 'create',
              previousData: Prisma.JsonNull,
              newData: row as unknown as Prisma.InputJsonValue,
              changedFields: [],
              batchId,
            })
          }
        }

        // Updated rows
        for (const newRow of newData) {
          const oldRow = oldData.find((r: any) => r.id === newRow.id)
          if (oldRow) {
            const changedFields = getChangedFields(oldRow, newRow)
            if (changedFields.length > 0) {
              changeLogs.push({
                spreadsheetId: spreadsheet.id,
                rowId: newRow.id,
                userId: user.id,
                organizationId: user.organizationId,
                action: 'update',
                previousData: oldRow as unknown as Prisma.InputJsonValue,
                newData: newRow as unknown as Prisma.InputJsonValue,
                changedFields,
                batchId,
              })
            }
          }
        }

        // Deleted rows
        for (const oldRow of oldData) {
          if (!newRowIds.has(oldRow.id)) {
            changeLogs.push({
              spreadsheetId: spreadsheet.id,
              rowId: oldRow.id,
              userId: user.id,
              organizationId: user.organizationId,
              action: 'delete',
              previousData: oldRow as unknown as Prisma.InputJsonValue,
              newData: Prisma.JsonNull,
              changedFields: [],
              batchId,
            })
          }
        }

        // Batch insert all change logs in a single query - MUCH FASTER!
        if (changeLogs.length > 0) {
          await tx.dataChangeLog.createMany({
            data: changeLogs,
          })
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

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
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
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Cache spreadsheet list for 60 seconds per organization
    const getCachedSpreadsheets = unstable_cache(
      async (organizationId: string) => {
        return await prisma.spreadsheet.findMany({
          where: {
            organizationId,
            isDeleted: false, // Exclude soft-deleted spreadsheets
          },
          include: {
            template: true,
            folder: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        })
      },
      [`spreadsheets-${user.organizationId}`],
      { revalidate: 60, tags: ['spreadsheets', `org-${user.organizationId}`] }
    )

    const spreadsheets = await getCachedSpreadsheets(user.organizationId)

    return { success: true, spreadsheets }
  } catch (error) {
    console.error('Error fetching spreadsheets:', error)
    return { error: 'Failed to fetch spreadsheets' }
  }
}

// Toggle starred status
export async function toggleSpreadsheetStar(spreadsheetId: string, starred: boolean) {

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    await prisma.spreadsheet.update({
      where: { id: spreadsheetId },
      data: { starred },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true }
  } catch (error) {
    console.error('Error toggling star:', error)
    return { error: 'Failed to update spreadsheet' }
  }
}

// Update spreadsheet tags
export async function updateSpreadsheetTags(spreadsheetId: string, tags: string[]) {

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found or access denied' }
    }

    await prisma.spreadsheet.update({
      where: { id: spreadsheetId },
      data: { tags },
    })

    revalidatePath('/dashboard/spreadsheets')

    return { success: true }
  } catch (error) {
    console.error('Error updating tags:', error)
    return { error: 'Failed to update tags' }
  }
}

// Get a single spreadsheet
export async function getSpreadsheet(spreadsheetId: string) {
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

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

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
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
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const templates = await prisma.spreadsheetTemplate.findMany({
      where: {
        OR: [
          { isPublic: true },
          { organizationId: user.organizationId },
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

  try {
    const user = await requireUser()

    const template = await prisma.spreadsheetTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        schema: data.schema as unknown as Prisma.InputJsonValue,
        sampleData: (data.sampleData || []) as unknown as Prisma.InputJsonValue,
        isPublic: data.isPublic || false,
        organizationId: user.organizationId,
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

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
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
