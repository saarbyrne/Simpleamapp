'use server'

import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getCachedUserWithOrganization, requireUser } from '@/lib/auth/cached-user'
import {
  getChangedFields,
  createBatchId,
  calculateExpiryDate,
  resolveAccessLevel,
  hasAccess,
  type AccessLevel,
  type DataChange,
  type ImpactSummary,
} from '@/lib/data-management'

// ============================================
// ROW-LEVEL CHANGE TRACKING
// ============================================

/**
 * Log a data change to the audit trail
 */
export async function logDataChange(change: DataChange) {
  try {
    await prisma.dataChangeLog.create({
      data: {
        spreadsheetId: change.spreadsheetId,
        rowId: change.rowId,
        userId: change.userId,
        organizationId: change.organizationId,
        action: change.action,
        previousData: change.previousData || Prisma.JsonNull,
        newData: change.newData || Prisma.JsonNull,
        changedFields: change.changedFields || [],
        batchId: change.batchId,
      },
    })
  } catch (error) {
    console.error('Failed to log data change:', error)
    // Don't throw - logging failures shouldn't break the main operation
  }
}

/**
 * Log multiple changes in a single batch
 */
export async function logBatchDataChanges(changes: DataChange[]) {
  const batchId = createBatchId()

  try {
    await prisma.dataChangeLog.createMany({
      data: changes.map((change) => ({
        spreadsheetId: change.spreadsheetId,
        rowId: change.rowId,
        userId: change.userId,
        organizationId: change.organizationId,
        action: change.action,
        previousData: change.previousData || Prisma.JsonNull,
        newData: change.newData || Prisma.JsonNull,
        changedFields: change.changedFields || [],
        batchId: batchId,
      })),
    })
  } catch (error) {
    console.error('Failed to log batch data changes:', error)
  }
}

/**
 * Get change history for a specific row
 */
export async function getRowHistory(spreadsheetId: string, rowId: string) {
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Check access to spreadsheet
    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    // Get change logs
    const changes = await prisma.dataChangeLog.findMany({
      where: {
        spreadsheetId,
        rowId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    })

    return { data: changes }
  } catch (error) {
    console.error('Failed to get row history:', error)
    return { error: 'Failed to retrieve history' }
  }
}

/**
 * Get change history for an entire spreadsheet
 */
export async function getSpreadsheetHistory(
  spreadsheetId: string,
  page: number = 1,
  limit: number = 50
) {
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Check access
    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    const skip = (page - 1) * limit

    const [changes, total] = await Promise.all([
      prisma.dataChangeLog.findMany({
        where: { spreadsheetId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.dataChangeLog.count({
        where: { spreadsheetId },
      }),
    ])

    return {
      data: {
        changes,
        total,
        hasMore: skip + changes.length < total,
      },
    }
  } catch (error) {
    console.error('Failed to get spreadsheet history:', error)
    return { error: 'Failed to retrieve history' }
  }
}

/**
 * Restore a row to a previous state
 */
export async function restoreRowToVersion(
  spreadsheetId: string,
  rowId: string,
  changeLogId: string
) {

  try {
    const user = await requireUser()

    // Get the change log entry
    const changeLog = await prisma.dataChangeLog.findUnique({
      where: { id: changeLogId },
    })

    if (!changeLog || changeLog.spreadsheetId !== spreadsheetId) {
      return { error: 'Change log not found' }
    }

    // Get spreadsheet
    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    // Check edit permission
    const userRoles = user.roleNames || []
    const userPermissions = user.permissions || []
    const accessLevel = resolveAccessLevel(user.id, userRoles, userPermissions, spreadsheet)

    if (!hasAccess(accessLevel, 'edit')) {
      return { error: 'Insufficient permissions' }
    }

    // Get the previous data from the change log
    const restoredData = changeLog.previousData

    if (!restoredData) {
      return { error: 'No previous data to restore' }
    }

    // Update the row in the spreadsheet data
    const data = spreadsheet.data as any[]
    const rowIndex = data.findIndex((r) => r.id === rowId)

    if (rowIndex === -1) {
      return { error: 'Row not found' }
    }

    const oldData = data[rowIndex]
    data[rowIndex] = restoredData

    // Update spreadsheet
    await prisma.spreadsheet.update({
      where: { id: spreadsheetId },
      data: {
        data: data as any,
        version: spreadsheet.version + 1,
      },
    })

    // Log the restore action
    await logDataChange({
      spreadsheetId,
      rowId,
      userId: user.id,
      organizationId: user.organizationId,
      action: 'restore',
      previousData: oldData,
      newData: restoredData,
      changedFields: getChangedFields(oldData, restoredData),
    })

    revalidatePath(`/dashboard/spreadsheets/${spreadsheetId}`)

    return { data: { success: true, restoredRow: restoredData } }
  } catch (error) {
    console.error('Failed to restore row:', error)
    return { error: 'Failed to restore row' }
  }
}

// ============================================
// SOFT DELETE & TRASH MANAGEMENT
// ============================================

/**
 * Soft delete a spreadsheet
 */
export async function softDeleteSpreadsheet(spreadsheetId: string) {

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    // Check admin permission
    const userRoles = user.roleNames || []
    const userPermissions = user.permissions || []
    const accessLevel = resolveAccessLevel(user.id, userRoles, userPermissions, spreadsheet)

    if (!hasAccess(accessLevel, 'admin')) {
      return { error: 'Insufficient permissions' }
    }

    // Soft delete the spreadsheet and create trash item
    const result = await prisma.$transaction([
      prisma.spreadsheet.update({
        where: { id: spreadsheetId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: user.id,
        },
      }),
      prisma.trashItem.create({
        data: {
          organizationId: user.organizationId,
          entityType: 'spreadsheet',
          entityId: spreadsheetId,
          entityName: spreadsheet.name,
          deletedBy: user.id,
          expiresAt: calculateExpiryDate(30),
        },
      }),
    ])

    revalidatePath('/dashboard/spreadsheets')
    revalidatePath('/dashboard/trash')

    return { data: { success: true } }
  } catch (error) {
    console.error('Failed to delete spreadsheet:', error)
    return { error: 'Failed to delete spreadsheet' }
  }
}

/**
 * Restore a spreadsheet from trash
 */
export async function restoreSpreadsheet(spreadsheetId: string) {

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    if (!spreadsheet.isDeleted) {
      return { error: 'Spreadsheet is not deleted' }
    }

    // Restore the spreadsheet and remove from trash
    await prisma.$transaction([
      prisma.spreadsheet.update({
        where: { id: spreadsheetId },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
        },
      }),
      prisma.trashItem.deleteMany({
        where: {
          entityType: 'spreadsheet',
          entityId: spreadsheetId,
        },
      }),
    ])

    revalidatePath('/dashboard/spreadsheets')
    revalidatePath('/dashboard/trash')

    return { data: { success: true } }
  } catch (error) {
    console.error('Failed to restore spreadsheet:', error)
    return { error: 'Failed to restore spreadsheet' }
  }
}

/**
 * Get all trash items for an organization
 */
export async function getTrashItems() {
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const items = await prisma.trashItem.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        deletedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { deletedAt: 'desc' },
    })

    return { data: items }
  } catch (error) {
    console.error('Failed to get trash items:', error)
    return { error: 'Failed to retrieve trash items' }
  }
}

/**
 * Permanently delete a trash item
 */
export async function permanentlyDelete(trashItemId: string) {

  try {
    const user = await requireUser()

    const trashItem = await prisma.trashItem.findUnique({
      where: { id: trashItemId },
    })

    if (!trashItem || trashItem.organizationId !== user.organizationId) {
      return { error: 'Trash item not found' }
    }

    // Actually delete the entity based on type
    if (trashItem.entityType === 'spreadsheet') {
      await prisma.spreadsheet.delete({
        where: { id: trashItem.entityId },
      })
    }
    // Add other entity types as needed

    // Delete the trash item
    await prisma.trashItem.delete({
      where: { id: trashItemId },
    })

    revalidatePath('/dashboard/trash')

    return { data: { success: true } }
  } catch (error) {
    console.error('Failed to permanently delete:', error)
    return { error: 'Failed to permanently delete' }
  }
}

// ============================================
// PERMISSIONS MANAGEMENT
// ============================================

/**
 * Grant permission to a user/role for a spreadsheet
 */
export async function grantSpreadsheetPermission(
  spreadsheetId: string,
  grantType: 'user' | 'role' | 'permission',
  grantValue: string,
  accessLevel: AccessLevel
) {

  try {
    const user = await requireUser()

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    // Check admin permission
    const userRoles = user.roleNames || []
    const userPermissions = user.permissions || []
    const currentAccessLevel = resolveAccessLevel(
      user.id,
      userRoles,
      userPermissions,
      spreadsheet
    )

    if (!hasAccess(currentAccessLevel, 'admin')) {
      return { error: 'Insufficient permissions' }
    }

    // Create or update permission
    const permission = await prisma.spreadsheetPermission.upsert({
      where: {
        spreadsheetId_grantType_grantValue: {
          spreadsheetId,
          grantType,
          grantValue,
        },
      },
      create: {
        spreadsheetId,
        grantType,
        grantValue,
        accessLevel,
        grantedBy: user.id,
      },
      update: {
        accessLevel,
        grantedBy: user.id,
        grantedAt: new Date(),
      },
    })

    revalidatePath(`/dashboard/spreadsheets/${spreadsheetId}`)

    return { data: permission }
  } catch (error) {
    console.error('Failed to grant permission:', error)
    return { error: 'Failed to grant permission' }
  }
}

/**
 * Revoke permission from a user/role
 */
export async function revokeSpreadsheetPermission(permissionId: string) {

  try {
    const user = await requireUser()

    const permission = await prisma.spreadsheetPermission.findUnique({
      where: { id: permissionId },
      include: { spreadsheet: true },
    })

    if (
      !permission ||
      permission.spreadsheet.organizationId !== user.organizationId
    ) {
      return { error: 'Permission not found' }
    }

    // Check admin permission
    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: permission.spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet) {
      return { error: 'Spreadsheet not found' }
    }

    const userRoles = user.roleNames || []
    const userPermissions = user.permissions || []
    const accessLevel = resolveAccessLevel(
      user.id,
      userRoles,
      userPermissions,
      spreadsheet
    )

    if (!hasAccess(accessLevel, 'admin')) {
      return { error: 'Insufficient permissions' }
    }

    await prisma.spreadsheetPermission.delete({
      where: { id: permissionId },
    })

    revalidatePath(`/dashboard/spreadsheets/${permission.spreadsheetId}`)

    return { data: { success: true } }
  } catch (error) {
    console.error('Failed to revoke permission:', error)
    return { error: 'Failed to revoke permission' }
  }
}

/**
 * Get user's access level for a spreadsheet
 */
export async function getSpreadsheetAccessLevel(spreadsheetId: string) {
  try {
    const user = await getCachedUserWithOrganization()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const spreadsheet = await prisma.spreadsheet.findUnique({
      where: { id: spreadsheetId },
      include: { permissions: true },
    })

    if (!spreadsheet || spreadsheet.organizationId !== user.organizationId) {
      return { error: 'Spreadsheet not found' }
    }

    const userRoles = user.roleNames || []
    const userPermissions = user.permissions || []
    const accessLevel = resolveAccessLevel(
      user.id,
      userRoles,
      userPermissions,
      spreadsheet
    )

    return { data: { accessLevel } }
  } catch (error) {
    console.error('Failed to get access level:', error)
    return { error: 'Failed to get access level' }
  }
}
