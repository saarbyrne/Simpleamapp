/**
 * Data Management & Historical Trends
 * Utilities for row-level change tracking, soft deletes, and permissions
 */

import { nanoid } from 'nanoid'

// ============================================
// ROW-LEVEL CHANGE TRACKING
// ============================================

export interface DataChange {
  spreadsheetId: string
  rowId: string
  userId: string
  organizationId: string
  action: 'create' | 'update' | 'delete' | 'restore'
  previousData?: any
  newData?: any
  changedFields?: string[]
  batchId?: string
}

/**
 * Calculate which fields changed between two row objects
 */
export function getChangedFields(previous: any, current: any): string[] {
  const changed: string[] = []
  const allKeys = new Set([...Object.keys(previous || {}), ...Object.keys(current || {})])

  for (const key of allKeys) {
    if (key === 'id') continue // Skip ID field
    const prev = previous?.[key]
    const curr = current?.[key]

    // Deep equality check for objects/arrays
    if (JSON.stringify(prev) !== JSON.stringify(curr)) {
      changed.push(key)
    }
  }

  return changed
}

/**
 * Create a batch ID for grouping bulk operations
 */
export function createBatchId(): string {
  return `batch_${nanoid(12)}`
}

// ============================================
// SOFT DELETE HELPERS
// ============================================

export interface TrashItemData {
  organizationId: string
  entityType: string
  entityId: string
  entityName: string
  parentId?: string
  parentName?: string
  metadata?: any
  deletedBy: string
  expiresAt: Date
}

/**
 * Calculate expiration date for trash items
 * @param retentionDays - Number of days to keep in trash (default: 30)
 */
export function calculateExpiryDate(retentionDays: number = 30): Date {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + retentionDays)
  return expiresAt
}

// ============================================
// PERMISSION HELPERS
// ============================================

export type AccessLevel = 'none' | 'view' | 'edit' | 'admin'

export interface PermissionGrant {
  grantType: 'user' | 'role' | 'permission'
  grantValue: string
  accessLevel: AccessLevel
}

/**
 * Resolve user's access level for a spreadsheet
 */
export function resolveAccessLevel(
  userId: string,
  userRoles: string[],
  userPermissions: string[],
  spreadsheet: {
    visibility: string
    createdById?: string | null
    permissions?: Array<{
      grantType: string
      grantValue: string
      accessLevel: string
    }>
  }
): AccessLevel {
  // Org admin always has admin access
  if (userPermissions.includes('admin')) return 'admin'

  // Creator always has admin access
  if (spreadsheet.createdById === userId) return 'admin'

  // Check explicit permissions first
  const explicitLevel = getExplicitPermission(
    spreadsheet.permissions || [],
    userId,
    userRoles,
    userPermissions
  )

  if (explicitLevel !== 'none') return explicitLevel

  // If org-wide visibility, everyone can view by default
  if (spreadsheet.visibility === 'org') return 'view'

  // Restricted visibility with no explicit permission = no access
  return 'none'
}

function getExplicitPermission(
  permissions: Array<{
    grantType: string
    grantValue: string
    accessLevel: string
  }>,
  userId: string,
  userRoles: string[],
  userPermissions: string[]
): AccessLevel {
  let highestLevel: AccessLevel = 'none'

  for (const perm of permissions) {
    let matches = false

    switch (perm.grantType) {
      case 'user':
        matches = perm.grantValue === userId
        break
      case 'role':
        matches = userRoles.includes(perm.grantValue)
        break
      case 'permission':
        matches = userPermissions.includes(perm.grantValue)
        break
    }

    if (matches) {
      const level = perm.accessLevel as AccessLevel
      if (getAccessLevelPriority(level) > getAccessLevelPriority(highestLevel)) {
        highestLevel = level
      }
    }
  }

  return highestLevel
}

function getAccessLevelPriority(level: AccessLevel): number {
  const priorities: Record<AccessLevel, number> = {
    none: 0,
    view: 1,
    edit: 2,
    admin: 3,
  }
  return priorities[level] || 0
}

/**
 * Check if user has specific access level or higher
 */
export function hasAccess(
  currentLevel: AccessLevel,
  requiredLevel: AccessLevel
): boolean {
  return getAccessLevelPriority(currentLevel) >= getAccessLevelPriority(requiredLevel)
}

// ============================================
// IMPACT ANALYSIS
// ============================================

export interface ImpactSummary {
  affectedRows?: number
  affectedSpreadsheets?: number
  affectedPlayers?: number
  relatedEntities?: Array<{
    type: string
    count: number
    names?: string[]
  }>
  warnings?: string[]
}

/**
 * Calculate impact of deleting a column
 */
export function calculateColumnDeleteImpact(
  columnName: string,
  spreadsheet: {
    data: any
    schema: any
  },
  allSpreadsheets?: any[]
): ImpactSummary {
  const rows = Array.isArray(spreadsheet.data) ? spreadsheet.data : []
  const schema = Array.isArray(spreadsheet.schema) ? spreadsheet.schema : []

  const impact: ImpactSummary = {
    affectedRows: rows.length,
    warnings: [],
  }

  // Check for formula dependencies
  const formulaColumns = schema.filter((col: any) => col.type === 'formula')
  const dependentFormulas = formulaColumns.filter((col: any) =>
    col.settings?.formula?.includes(columnName)
  )

  if (dependentFormulas.length > 0) {
    impact.warnings?.push(
      `${dependentFormulas.length} formula${dependentFormulas.length > 1 ? 's' : ''} reference this column and will break`
    )
  }

  // TODO: Check for report dependencies when reports system is integrated
  // TODO: Check for visualization dependencies

  return impact
}
