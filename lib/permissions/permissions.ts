/**
 * System Permissions for Staff Management
 * These are fixed permissions that control access to different parts of the system
 */

export const PERMISSIONS = {
  ADMIN: 'admin',
  MEDICAL_ACCESS: 'medical_access',
  MENTAL_HEALTH_ACCESS: 'mental_health_access',
  MANAGE_PLAYERS: 'manage_players',
  MANAGE_EVENTS: 'manage_events',
  MANAGE_FORMS: 'manage_forms',
  VIEW_REPORTS: 'view_reports',
  MANAGE_STAFF: 'manage_staff',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

/**
 * Permission metadata for display in UI
 */
export const PERMISSION_METADATA: Record<Permission, {
  label: string
  description: string
  icon?: string
}> = {
  [PERMISSIONS.ADMIN]: {
    label: 'Admin',
    description: 'Full access: manage org settings, users, billing',
    icon: '⚙️',
  },
  [PERMISSIONS.MEDICAL_ACCESS]: {
    label: 'Medical Access',
    description: 'View and create medical notes, access injury data',
    icon: '🏥',
  },
  [PERMISSIONS.MENTAL_HEALTH_ACCESS]: {
    label: 'Mental Health Access',
    description: 'View and create psychology notes, private sessions',
    icon: '🧠',
  },
  [PERMISSIONS.MANAGE_PLAYERS]: {
    label: 'Manage Players',
    description: 'Add, edit, remove players from squad',
    icon: '👥',
  },
  [PERMISSIONS.MANAGE_EVENTS]: {
    label: 'Manage Events',
    description: 'Create and edit calendar events',
    icon: '📅',
  },
  [PERMISSIONS.MANAGE_FORMS]: {
    label: 'Manage Forms',
    description: 'Create forms and manage distributions',
    icon: '📋',
  },
  [PERMISSIONS.VIEW_REPORTS]: {
    label: 'View Reports',
    description: 'Access reports and analytics section',
    icon: '📊',
  },
  [PERMISSIONS.MANAGE_STAFF]: {
    label: 'Manage Staff',
    description: 'Manage staff roles and permissions',
    icon: '👤',
  },
}

/**
 * All available permissions as an array
 */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS)

/**
 * Common role suggestions for staff members
 */
export const COMMON_ROLES = [
  'Head Coach',
  'Assistant Coach',
  'Physiotherapist',
  'Sports Psychologist',
  'Performance Analyst',
  'Strength & Conditioning Coach',
  'Medical Staff',
  'Team Manager',
  'Nutritionist',
  'Video Analyst',
]
