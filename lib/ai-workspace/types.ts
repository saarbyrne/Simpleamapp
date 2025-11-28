/**
 * AI Workspace Types
 *
 * Type definitions for the AI Workspace feature including
 * artifact types, workspace states, and data structures
 */

export type ArtifactType = 'reports' | 'whiteboards' | 'uiPages' | 'plans';

export type WorkspaceStatus = 'generating' | 'draft' | 'updating' | 'ready' | 'published' | 'syncing';

// All metrics available in the system
export type MetricKey =
    | 'rpe'              // Rate of Perceived Exertion (1-10)
    | 'wellness_score'   // Composite wellness (0-100)
    | 'sleep_quality'    // Sleep rating (1-5)
    | 'mood'             // Mood score (1-10)
    | 'stress'           // Stress level (1-10)
    | 'load'             // Training load (AU)
    | 'fatigue'          // Fatigue index (1-10)
    | 'soreness'         // Muscle soreness (1-10)
    | 'hrv'              // Heart rate variability (ms)
    | 'sleep_duration';  // Hours slept

// Visualisation options
export type ChartType = 'bar' | 'line' | 'pie' | 'heatmap' | 'table' | 'scatter';

// Time period presets
export type TimePeriod =
    | 'last_7_days' | 'last_14_days' | 'last_30_days'
    | 'this_week' | 'last_week' | 'this_month' | 'last_month'
    | 'this_season' | 'custom';

// Position groups in football/soccer
export type PositionGroup =
    | 'goalkeepers' | 'defenders' | 'midfielders' | 'forwards' | 'all';

// User roles in the organisation
export type UserRole =
    | 'head_coach' | 'assistant_coach' | 'goalkeeper_coach' | 'fitness_coach'
    | 'head_of_performance' | 'sports_scientist' | 'analyst'
    | 'physio' | 'doctor' | 'nutritionist' | 'psychologist'
    | 'manager' | 'director' | 'admin';

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
