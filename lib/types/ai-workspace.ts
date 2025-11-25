/**
 * AI Workspace Types
 *
 * Type definitions for the AI Workspace feature including
 * artifact types, workspace states, and data structures
 */

export type ArtifactType = 'reports' | 'whiteboards' | 'uiPages' | 'plans'

export type WorkspaceStatus = 'generating' | 'draft' | 'updating' | 'ready' | 'published' | 'syncing'

export interface ArtifactTypeInfo {
  type: ArtifactType
  label: string
  description: string
  icon: string
}

export interface Workspace {
  id: string
  name: string
  artifactType: ArtifactType
  status: WorkspaceStatus
  initialPrompt: string
  userId: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  publishedTo?: PublishDestination[]
}

export interface PublishDestination {
  type: 'navigation' | 'event' | 'playerProfile' | 'teamProfile' | 'library'
  id?: string // ID of the event, player, or team if applicable
  name?: string // Name of the destination
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  workspaceId: string
}

export interface ArtifactData {
  // Report-specific data
  reportConfig?: {
    timePeriod?: string
    startDate?: string
    endDate?: string
    players?: string[]
    metrics?: string[]
    visualizationType?: 'line' | 'bar' | 'table' | 'heatmap' | 'pie' | 'area' | 'scatter'
    groupBy?: string
    filterBy?: Record<string, any>
  }

  // Whiteboard-specific data
  whiteboardConfig?: {
    sportType?: string
    formation?: string
    viewOptions?: {
      fullField?: boolean
      halfField?: boolean
      zones?: boolean
      showGrid?: boolean
      showMeasurements?: boolean
    }
    elements?: any[] // Drawing elements, tokens, annotations
  }

  // UI Pages-specific data
  uiPageConfig?: {
    componentType?: string
    layoutOptions?: any
    dataSource?: string
    permissions?: string[]
    components?: any[]
  }

  // Plans-specific data
  planConfig?: {
    timeHorizon?: string
    milestoneTypes?: string[]
    entityAssociations?: {
      players?: string[]
      events?: string[]
      teams?: string[]
    }
    viewMode?: 'timeline' | 'list' | 'calendar'
    milestones?: Milestone[]
  }

  // Generated artifact content
  generatedContent?: any

  // Version tracking
  version?: number
  lastModified?: Date
}

export interface Milestone {
  id: string
  title: string
  description?: string
  date: Date
  status: 'pending' | 'in-progress' | 'completed'
  dependencies?: string[] // IDs of other milestones
}

export interface WorkspaceState {
  workspace: Workspace | null
  artifactData: ArtifactData | null
  conversationHistory: ConversationMessage[]
  isGenerating: boolean
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
}

// Control types for structured refinement
export interface ControlValue {
  [key: string]: any
}

export interface ControlChange {
  key: string
  value: any
}
