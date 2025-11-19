/**
 * Quick Actions Configuration
 *
 * This file defines the available quick actions that can be displayed in the
 * breadcrumb toolbar. Quick actions are shortcuts to frequently used actions
 * across the platform.
 *
 * To add a new quick action:
 * 1. Import the required icon from lucide-react
 * 2. Add a new entry to the AVAILABLE_QUICK_ACTIONS array
 * 3. Set enabled: true to show it by default
 * 4. If it opens a dialog, pass the dialog state handlers via actionProps
 */

import { LucideIcon, UserPlus, CalendarPlus, FileText, Table, StickyNote } from 'lucide-react'

export type QuickActionId =
  | 'add-player'
  | 'add-event'
  | 'add-form'
  | 'add-spreadsheet'
  | 'add-note'

export interface QuickAction {
  id: QuickActionId
  label: string
  icon: LucideIcon
  enabled: boolean
  /**
   * Optional onClick handler for simple actions.
   * For dialog-based actions, this should open the dialog.
   */
  onClick?: () => void
}

export interface QuickActionConfig extends Omit<QuickAction, 'onClick'> {
  /**
   * Description shown in settings or documentation.
   */
  description: string
  /**
   * Category for grouping in settings UI (future use).
   */
  category: 'people' | 'scheduling' | 'content' | 'data'
}

/**
 * Registry of all available quick actions.
 * This serves as the single source of truth for what actions can be added
 * to the quick actions toolbar.
 */
export const AVAILABLE_QUICK_ACTIONS: QuickActionConfig[] = [
  {
    id: 'add-player',
    label: 'Add Player',
    icon: UserPlus,
    enabled: true,
    description: 'Quickly add a new player to your organization',
    category: 'people',
  },
  {
    id: 'add-event',
    label: 'Add Event',
    icon: CalendarPlus,
    enabled: true,
    description: 'Create a new calendar event',
    category: 'scheduling',
  },
  {
    id: 'add-form',
    label: 'Add Form',
    icon: FileText,
    enabled: true, // Now implemented
    description: 'Create a new form for data collection',
    category: 'content',
  },
  {
    id: 'add-spreadsheet',
    label: 'Add Spreadsheet',
    icon: Table,
    enabled: false, // Not yet implemented
    description: 'Create a new spreadsheet for data management',
    category: 'data',
  },
  {
    id: 'add-note',
    label: 'Add Note',
    icon: StickyNote,
    enabled: true,
    description: 'Create a new note or document',
    category: 'content',
  },
]

/**
 * Get all enabled quick actions.
 * This is what will be displayed in the toolbar.
 */
export function getEnabledQuickActions(): QuickActionConfig[] {
  return AVAILABLE_QUICK_ACTIONS.filter(action => action.enabled)
}

/**
 * Get a specific quick action by ID.
 */
export function getQuickAction(id: QuickActionId): QuickActionConfig | undefined {
  return AVAILABLE_QUICK_ACTIONS.find(action => action.id === id)
}
