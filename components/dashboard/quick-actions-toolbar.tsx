'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getEnabledQuickActions } from '@/lib/quick-actions-config'

interface QuickActionsToolbarProps {
  /**
   * Handlers for each quick action.
   * Map of action ID to click handler.
   */
  actionHandlers: Record<string, () => void>
  /**
   * Optional class name for the container
   */
  className?: string
}

/**
 * QuickActionsToolbar
 *
 * Displays a dropdown menu of quick action buttons in the breadcrumb area.
 * All actions are contained within a "Quick Actions" dropdown menu.
 *
 * @example
 * ```tsx
 * <QuickActionsToolbar
 *   actionHandlers={{
 *     'add-player': () => setShowAddPlayerDialog(true),
 *     'add-event': () => setShowAddEventDialog(true),
 *   }}
 * />
 * ```
 */
export function QuickActionsToolbar({ actionHandlers, className }: QuickActionsToolbarProps) {
  const enabledActions = getEnabledQuickActions()

  // Don't render if no actions are enabled
  if (enabledActions.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            aria-label="Quick actions menu"
          >
            Quick Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {enabledActions.map(action => {
            const Icon = action.icon
            return (
              <DropdownMenuItem
                key={action.id}
                onClick={actionHandlers[action.id]}
              >
                <Icon className="me-2 h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
