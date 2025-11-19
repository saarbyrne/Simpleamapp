import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { QuickActionsToolbar } from '@/components/dashboard/quick-actions-toolbar'

vi.mock('@/components/ui/dropdown-menu', () => {
  return {
    DropdownMenu: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dropdown-menu">{children}</div>
    ),
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
      <div role="menu">{children}</div>
    ),
    DropdownMenuItem: ({
      children,
      onClick,
    }: {
      children: React.ReactNode
      onClick?: () => void
    }) => (
      <button type="button" role="menuitem" onClick={onClick}>
        {children}
      </button>
    ),
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
  }
})
import {
  getEnabledQuickActions,
  getQuickAction,
  AVAILABLE_QUICK_ACTIONS
} from '@/lib/quick-actions-config'

describe('QuickActionsToolbar', () => {
  const mockHandlers = {
    'add-player': vi.fn(),
    'add-event': vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderToolbar = () =>
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{ dashboard: { quickActions: 'Quick Actions' } }}
      >
        <QuickActionsToolbar actionHandlers={mockHandlers} />
      </NextIntlClientProvider>
    )

  const openMenu = () => {
    const trigger = screen.getByRole('button', { name: 'Quick actions menu' })
    fireEvent.pointerDown(trigger, { button: 0 })
    fireEvent.click(trigger)
    return trigger
  }

  describe('Desktop View', () => {
    it('renders enabled quick actions as dropdown items', () => {
      renderToolbar()
      openMenu()

      const enabledActions = getEnabledQuickActions()
      expect(enabledActions.length).toBeGreaterThan(0)

      enabledActions.forEach(action => {
        expect(
          screen.getByRole('menuitem', { name: action.label })
        ).toBeDefined()
      })
    })

    it('calls the correct handler when an action menu item is clicked', () => {
      renderToolbar()
      openMenu()

      const addPlayerItem = screen.getByRole('menuitem', { name: 'Add Player' })
      fireEvent.click(addPlayerItem)
      expect(mockHandlers['add-player']).toHaveBeenCalledTimes(1)
    })

    it('displays the quick actions label inside the dropdown', () => {
      renderToolbar()
      openMenu()

      expect(screen.getAllByText('Quick Actions')[0]).toBeDefined()
    })
  })

  describe('Mobile View', () => {
    it('renders a dropdown menu button', () => {
      renderToolbar()

      // The mobile dropdown trigger should have aria-label
      const dropdownTrigger = screen.getByLabelText('Quick actions menu')
      expect(dropdownTrigger).toBeDefined()
    })
  })

  describe('Configuration', () => {
    it('only renders enabled actions', () => {
      const enabledActions = getEnabledQuickActions()

      const enabledIds = enabledActions.map(a => a.id)

      expect(enabledIds).toEqual(
        expect.arrayContaining(['add-player', 'add-event', 'add-form', 'add-note'])
      )

      const disabledActions = AVAILABLE_QUICK_ACTIONS.filter((action) => !action.enabled).map(
        (action) => action.id
      )
      disabledActions.forEach((id) => {
        expect(enabledIds).not.toContain(id)
      })
    })
  })

  describe('Accessibility', () => {
    it('makes each action available via accessible menu items', () => {
      renderToolbar()
      openMenu()

      const enabledActions = getEnabledQuickActions()
      enabledActions.forEach(action => {
        expect(
          screen.getByRole('menuitem', { name: action.label })
        ).toBeDefined()
      })
    })

    it('has proper aria-label on dropdown menu trigger', () => {
      renderToolbar()

      const dropdownTrigger = openMenu()
      expect(dropdownTrigger).toBeDefined()
      expect(dropdownTrigger.getAttribute('aria-label')).toBe('Quick actions menu')
    })

    it('uses a semantic button element for the dropdown trigger', () => {
      renderToolbar()

      const dropdownTrigger = screen.getByRole('button', { name: 'Quick actions menu' })
      expect(dropdownTrigger.tagName).toBe('BUTTON')
    })
  })
})

describe('Quick Actions Configuration', () => {
  it('defines all available quick actions', () => {
    expect(AVAILABLE_QUICK_ACTIONS).toBeDefined()
    expect(Array.isArray(AVAILABLE_QUICK_ACTIONS)).toBe(true)
    expect(AVAILABLE_QUICK_ACTIONS.length).toBeGreaterThan(0)

    // Check structure of each action
    AVAILABLE_QUICK_ACTIONS.forEach((action) => {
      expect(action).toHaveProperty('id')
      expect(action).toHaveProperty('label')
      expect(action).toHaveProperty('icon')
      expect(action).toHaveProperty('enabled')
      expect(action).toHaveProperty('description')
      expect(action).toHaveProperty('category')
    })
  })

  it('includes expected action IDs', () => {
    const actionIds = AVAILABLE_QUICK_ACTIONS.map((a) => a.id)

    expect(actionIds).toContain('add-player')
    expect(actionIds).toContain('add-event')
    expect(actionIds).toContain('add-form')
    expect(actionIds).toContain('add-spreadsheet')
    expect(actionIds).toContain('add-note')
  })

  it('categorizes actions correctly', () => {
    const categories = new Set(AVAILABLE_QUICK_ACTIONS.map((a) => a.category))

    // Should have multiple categories
    expect(categories.size).toBeGreaterThan(1)

    // Should include expected categories
    expect(Array.from(categories)).toEqual(
      expect.arrayContaining(['people', 'scheduling', 'content', 'data'])
    )
  })

  it('getQuickAction returns correct action by ID', () => {
    const addPlayerAction = getQuickAction('add-player')
    expect(addPlayerAction).toBeDefined()
    expect(addPlayerAction?.id).toBe('add-player')
    expect(addPlayerAction?.label).toBe('Add Player')

    const addEventAction = getQuickAction('add-event')
    expect(addEventAction).toBeDefined()
    expect(addEventAction?.id).toBe('add-event')
    expect(addEventAction?.label).toBe('Add Event')

    const nonExistent = getQuickAction('non-existent' as any)
    expect(nonExistent).toBeUndefined()
  })
})
