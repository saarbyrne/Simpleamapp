/**
 * Feature Metadata Configuration
 * 
 * Defines all features available in the platform with their metadata,
 * including labels, descriptions, icons, sub-feature relationships,
 * and release status.
 */

import {
  Sparkles,
  Users,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  StickyNote,
  Table,
  PencilRuler,
  Folder,
  CalendarCheck,
  Layout,
  Wand2,
  Database,
  type LucideIcon,
} from 'lucide-react'

export type FeatureKey =
  | 'aiWorkspace'
  | 'ai'
  | 'players'
  | 'forms'
  | 'reports'
  | 'calendar'
  | 'messages'
  | 'notes'
  | 'spreadsheets'
  | 'canvas'
  | 'files'
  | 'planner'
  | 'templates'
  | 'dataManagement'

export type SubFeatureKey =
  // Reports sub-features
  | 'reportsBuilder'
  | 'reportsTemplates'
  | 'reportsScheduling'
  | 'reportsAiInsights'
  | 'reportsSharing'
  // Calendar sub-features
  | 'calendarAttendance'
  | 'calendarForms'
  | 'calendarDrawings'
  | 'calendarSpreadsheets'
  | 'calendarNotes'
  | 'calendarFiles'
  // Forms sub-features
  | 'formsBuilder'
  | 'formsResponses'
  | 'formsScheduling'
  // Players sub-features
  | 'playersNotes'
  | 'playersFiles'
  | 'playersMedicalData'

export interface SubFeatureMetadata {
  key: SubFeatureKey
  label: string
  description: string
  fieldName: string // Database field name
}

export interface FeatureMetadata {
  key: FeatureKey
  label: string
  description: string
  icon: LucideIcon
  fieldName: string // Database field name
  subFeatures: SubFeatureMetadata[]
  navPath: string // Navigation path
  /**
   * Whether the feature is released and available to end users.
   * - true: Feature is production-ready and visible based on subscription tier
   * - false: Feature is in development and only visible to platform admins
   */
  released: boolean
}

export const FEATURE_METADATA: Record<FeatureKey, FeatureMetadata> = {
  aiWorkspace: {
    key: 'aiWorkspace',
    label: 'AI Workspace',
    description: 'AI-powered workspace for creating reports, whiteboards, UI pages, and plans',
    icon: Wand2,
    fieldName: 'aiWorkspaceEnabled',
    subFeatures: [],
    navPath: '/dashboard/ai-workspace',
    released: true,
  },
  ai: {
    key: 'ai',
    label: 'AI Assistant',
    description: 'AI-powered insights and assistance for data analysis and decision making',
    icon: Sparkles,
    fieldName: 'aiEnabled',
    subFeatures: [],
    navPath: '/dashboard/ai',
    released: true,
  },
  players: {
    key: 'players',
    label: 'Players',
    description: 'Player roster management, profiles, and performance tracking',
    icon: Users,
    fieldName: 'playersEnabled',
    subFeatures: [
      {
        key: 'playersNotes',
        label: 'Player Notes',
        description: 'Add and view notes for individual players',
        fieldName: 'playersNotesEnabled',
      },
      {
        key: 'playersFiles',
        label: 'Player Files',
        description: 'Upload and manage files for players',
        fieldName: 'playersFilesEnabled',
      },
      {
        key: 'playersMedicalData',
        label: 'Medical Data',
        description: 'Access to medical and health information',
        fieldName: 'playersMedicalDataEnabled',
      },
    ],
    navPath: '/dashboard/players',
    released: true,
  },
  forms: {
    key: 'forms',
    label: 'Forms',
    description: 'Custom form builder for data collection and wellness tracking',
    icon: FileText,
    fieldName: 'formsEnabled',
    subFeatures: [
      {
        key: 'formsBuilder',
        label: 'Form Builder',
        description: 'Create and edit custom forms',
        fieldName: 'formsBuilderEnabled',
      },
      {
        key: 'formsResponses',
        label: 'Form Responses',
        description: 'View and analyze form submissions',
        fieldName: 'formsResponsesEnabled',
      },
      {
        key: 'formsScheduling',
        label: 'Form Scheduling',
        description: 'Schedule recurring form distributions',
        fieldName: 'formsSchedulingEnabled',
      },
    ],
    navPath: '/dashboard/forms',
    released: true,
  },
  reports: {
    key: 'reports',
    label: 'Reports',
    description: 'Analytics, reporting, and data visualization',
    icon: BarChart3,
    fieldName: 'reportsEnabled',
    subFeatures: [
      {
        key: 'reportsBuilder',
        label: 'Report Builder',
        description: 'Create custom reports and dashboards',
        fieldName: 'reportsBuilderEnabled',
      },
      {
        key: 'reportsTemplates',
        label: 'Report Templates',
        description: 'Use pre-built report templates',
        fieldName: 'reportsTemplatesEnabled',
      },
      {
        key: 'reportsScheduling',
        label: 'Report Scheduling',
        description: 'Schedule automated report delivery',
        fieldName: 'reportsSchedulingEnabled',
      },
      {
        key: 'reportsAiInsights',
        label: 'AI Insights',
        description: 'AI-generated insights and recommendations',
        fieldName: 'reportsAiInsightsEnabled',
      },
      {
        key: 'reportsSharing',
        label: 'Report Sharing',
        description: 'Share reports with external stakeholders',
        fieldName: 'reportsSharingEnabled',
      },
    ],
    navPath: '/dashboard/reports',
    released: true,
  },
  calendar: {
    key: 'calendar',
    label: 'Calendar',
    description: 'Event scheduling, calendar management, and attendance tracking',
    icon: Calendar,
    fieldName: 'calendarEnabled',
    subFeatures: [
      {
        key: 'calendarAttendance',
        label: 'Attendance Tracking',
        description: 'Track attendance for events',
        fieldName: 'calendarAttendanceEnabled',
      },
      {
        key: 'calendarForms',
        label: 'Event Forms',
        description: 'Link forms to calendar events',
        fieldName: 'calendarFormsEnabled',
      },
      {
        key: 'calendarDrawings',
        label: 'Event Drawings',
        description: 'Add tactical drawings to events',
        fieldName: 'calendarDrawingsEnabled',
      },
      {
        key: 'calendarSpreadsheets',
        label: 'Event Spreadsheets',
        description: 'Attach spreadsheets to events',
        fieldName: 'calendarSpreadsheetsEnabled',
      },
      {
        key: 'calendarNotes',
        label: 'Event Notes',
        description: 'Add notes to calendar events',
        fieldName: 'calendarNotesEnabled',
      },
      {
        key: 'calendarFiles',
        label: 'Event Files',
        description: 'Upload files to events',
        fieldName: 'calendarFilesEnabled',
      },
    ],
    navPath: '/dashboard/calendar',
    released: true,
  },
  messages: {
    key: 'messages',
    label: 'Messages',
    description: 'Team chat and real-time messaging',
    icon: MessageSquare,
    fieldName: 'messagesEnabled',
    subFeatures: [],
    navPath: '/dashboard/chat',
    released: true,
  },
  notes: {
    key: 'notes',
    label: 'Notes',
    description: 'Note-taking and documentation with privacy controls',
    icon: StickyNote,
    fieldName: 'notesEnabled',
    subFeatures: [],
    navPath: '/dashboard/notes',
    released: true,
  },
  spreadsheets: {
    key: 'spreadsheets',
    label: 'Spreadsheets',
    description: 'Data management with spreadsheet functionality',
    icon: Table,
    fieldName: 'spreadsheetsEnabled',
    subFeatures: [],
    navPath: '/dashboard/spreadsheets',
    released: true,
  },
  canvas: {
    key: 'canvas',
    label: 'Canvas',
    description: 'Tactical drawings and whiteboard for session planning',
    icon: PencilRuler,
    fieldName: 'canvasEnabled',
    subFeatures: [],
    navPath: '/dashboard/canvas',
    released: true,
  },
  files: {
    key: 'files',
    label: 'Files',
    description: 'File storage and management',
    icon: Folder,
    fieldName: 'filesEnabled',
    subFeatures: [],
    navPath: '/dashboard/files',
    released: true,
  },
  planner: {
    key: 'planner',
    label: 'Planner',
    description: 'Long-term planning and milestone tracking',
    icon: CalendarCheck,
    fieldName: 'plannerEnabled',
    subFeatures: [],
    navPath: '/dashboard/planner',
    released: true,
  },
  templates: {
    key: 'templates',
    label: 'Templates',
    description: 'Community template marketplace',
    icon: Layout,
    fieldName: 'templatesEnabled',
    subFeatures: [],
    navPath: '/dashboard/templates',
    released: true,
  },
  dataManagement: {
    key: 'dataManagement',
    label: 'Data Management',
    description: 'Advanced data tables, import/export, and data organization',
    icon: Database,
    fieldName: 'dataManagementEnabled',
    subFeatures: [],
    navPath: '/dashboard/data-management',
    released: true,
  },
}

/**
 * Get all main features as an array
 */
export function getAllFeatures(): FeatureMetadata[] {
  return Object.values(FEATURE_METADATA)
}

/**
 * Get only released features
 */
export function getReleasedFeatures(): FeatureMetadata[] {
  return getAllFeatures().filter(feature => feature.released)
}

/**
 * Get only unreleased (in development) features
 */
export function getUnreleasedFeatures(): FeatureMetadata[] {
  return getAllFeatures().filter(feature => !feature.released)
}

/**
 * Check if a feature is released
 */
export function isFeatureReleased(key: FeatureKey): boolean {
  return FEATURE_METADATA[key]?.released ?? false
}

/**
 * Get feature metadata by key
 */
export function getFeatureMetadata(key: FeatureKey): FeatureMetadata | undefined {
  return FEATURE_METADATA[key]
}

/**
 * Get all features with sub-features
 */
export function getFeaturesWithSubFeatures(): FeatureMetadata[] {
  return getAllFeatures().filter(feature => feature.subFeatures.length > 0)
}

/**
 * Get feature hierarchy for display
 */
export interface FeatureNode {
  feature: FeatureMetadata
  children: SubFeatureMetadata[]
}

export function getFeatureHierarchy(): FeatureNode[] {
  return getAllFeatures().map(feature => ({
    feature,
    children: feature.subFeatures,
  }))
}

/**
 * Map navigation path to feature key
 */
export function getFeatureKeyFromPath(path: string): FeatureKey | null {
  const feature = getAllFeatures().find(f => path.startsWith(f.navPath))
  return feature?.key || null
}
