'use client'

import * as React from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getEnabledQuickActions, QuickActionConfig } from '@/lib/quick-actions-config'

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
 * Displays a toolbar of quick action buttons in the breadcrumb area.
 * Responsive design: shows individual icon buttons on larger screens,
 * and collapses to a dropdown menu on smaller screens.
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
      {/* Desktop view: Individual icon buttons with tooltips */}
      <div className="hidden md:flex items-center gap-1">
        {enabledActions.map(action => (
          <QuickActionButton
            key={action.id}
            action={action}
            onClick={actionHandlers[action.id]}
          />
        ))}
      </div>

      {/* Mobile view: Dropdown menu */}
      <div className="flex md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8"
              aria-label="Quick actions menu"
            >
              <MoreHorizontal className="h-4 w-4" />
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
                  <Icon className="mr-2 h-4 w-4" />
                  {action.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/**
 * Individual quick action button with tooltip
 */
function QuickActionButton({
  action,
  onClick,
}: {
  action: QuickActionConfig
  onClick?: () => void
}) {
  const Icon = action.icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          aria-label={action.label}
          className="h-8 w-8"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {action.label}
      </TooltipContent>
    </Tooltip>
  )
}
