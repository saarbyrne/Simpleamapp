import { Permission, PERMISSIONS } from './permissions'

/**
 * Check if a user has a specific permission
 * Admin permission grants access to everything
 */
export function hasPermission(
  userPermissions: string[],
  permission: Permission
): boolean {
  return (
    userPermissions.includes(PERMISSIONS.ADMIN) ||
    userPermissions.includes(permission)
  )
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return true
  }
  return permissions.some(permission => userPermissions.includes(permission))
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return true
  }
  return permissions.every(permission => userPermissions.includes(permission))
}

/**
 * Check if a user is an admin
 */
export function isAdmin(userPermissions: string[]): boolean {
  return userPermissions.includes(PERMISSIONS.ADMIN)
}

/**
 * Filter permissions that a user has
 */
export function filterPermissions(
  userPermissions: string[],
  availablePermissions: Permission[]
): Permission[] {
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return availablePermissions
  }
  return availablePermissions.filter(permission =>
    userPermissions.includes(permission)
  )
}
