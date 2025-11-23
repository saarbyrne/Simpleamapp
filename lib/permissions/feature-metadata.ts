/**
 * Feature Metadata Configuration
 * 
 * Defines all features available in the platform with their metadata,
 * including labels, descriptions, icons, and sub-feature relationships.
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
  type LucideIcon,
} from 'lucide-react'

export type FeatureKey = 
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
}

export const FEATURE_METADATA: Record<FeatureKey, FeatureMetadata> = {
  ai: {
    key: 'ai',
    label: 'AI Assistant',
    description: 'AI-powered insights and assistance for data analysis and decision making',
    icon: Sparkles,
    fieldName: 'aiEnabled',
    subFeatures: [],
    navPath: '/dashboard/ai',
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
  },
  messages: {
    key: 'messages',
    label: 'Messages',
    description: 'Team chat and real-time messaging',
    icon: MessageSquare,
    fieldName: 'messagesEnabled',
    subFeatures: [],
    navPath: '/dashboard/chat',
  },
  notes: {
    key: 'notes',
    label: 'Notes',
    description: 'Note-taking and documentation with privacy controls',
    icon: StickyNote,
    fieldName: 'notesEnabled',
    subFeatures: [],
    navPath: '/dashboard/notes',
  },
  spreadsheets: {
    key: 'spreadsheets',
    label: 'Spreadsheets',
    description: 'Data management with spreadsheet functionality',
    icon: Table,
    fieldName: 'spreadsheetsEnabled',
    subFeatures: [],
    navPath: '/dashboard/spreadsheets',
  },
  canvas: {
    key: 'canvas',
    label: 'Canvas',
    description: 'Tactical drawings and whiteboard for session planning',
    icon: PencilRuler,
    fieldName: 'canvasEnabled',
    subFeatures: [],
    navPath: '/dashboard/canvas',
  },
  files: {
    key: 'files',
    label: 'Files',
    description: 'File storage and management',
    icon: Folder,
    fieldName: 'filesEnabled',
    subFeatures: [],
    navPath: '/dashboard/files',
  },
  planner: {
    key: 'planner',
    label: 'Planner',
    description: 'Long-term planning and milestone tracking',
    icon: CalendarCheck,
    fieldName: 'plannerEnabled',
    subFeatures: [],
    navPath: '/dashboard/planner',
  },
  templates: {
    key: 'templates',
    label: 'Templates',
    description: 'Community template marketplace',
    icon: Layout,
    fieldName: 'templatesEnabled',
    subFeatures: [],
    navPath: '/dashboard/templates',
  },
}

/**
 * Get all main features as an array
 */
export function getAllFeatures(): FeatureMetadata[] {
  return Object.values(FEATURE_METADATA)
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

