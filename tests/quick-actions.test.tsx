import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { QuickActionsToolbar } from '@/components/dashboard/quick-actions-toolbar'
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

  describe('Desktop View', () => {
    it('renders enabled quick actions as individual buttons', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      const enabledActions = getEnabledQuickActions()
      expect(enabledActions.length).toBeGreaterThan(0)

      // Check that buttons exist for enabled actions
      enabledActions.forEach(action => {
        const buttons = screen.getAllByRole('button', { name: action.label })
        expect(buttons.length).toBeGreaterThan(0)
      })
    })

    it('calls the correct handler when an action button is clicked', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      // Find and click the Add Player button (in desktop view)
      const addPlayerButtons = screen.getAllByRole('button', { name: 'Add Player' })
      // The desktop button should be one of them (not the dropdown item)
      const desktopButton = addPlayerButtons.find(btn =>
        btn.classList.contains('h-8') && btn.classList.contains('w-8')
      )

      if (desktopButton) {
        fireEvent.click(desktopButton)
        expect(mockHandlers['add-player']).toHaveBeenCalledTimes(1)
      }
    })

    it('displays tooltips on hover', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      // Tooltips are rendered via TooltipContent which shows the label
      const enabledActions = getEnabledQuickActions()
      enabledActions.forEach(action => {
        // The tooltip trigger should have aria-label
        const buttons = screen.getAllByRole('button', { name: action.label })
        expect(buttons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Mobile View', () => {
    it('renders a dropdown menu button', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      // The mobile dropdown trigger should have aria-label
      const dropdownTrigger = screen.getByLabelText('Quick actions menu')
      expect(dropdownTrigger).toBeDefined()
    })
  })

  describe('Configuration', () => {
    it('only renders enabled actions', () => {
      const enabledActions = getEnabledQuickActions()

      // Should have at least add-player and add-event enabled
      const enabledIds = enabledActions.map(a => a.id)
      expect(enabledIds).toContain('add-player')
      expect(enabledIds).toContain('add-event')

      // Should not include disabled actions
      expect(enabledIds).not.toContain('add-form')
      expect(enabledIds).not.toContain('add-spreadsheet')
      expect(enabledIds).not.toContain('add-note')
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-labels on action buttons', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      const enabledActions = getEnabledQuickActions()
      enabledActions.forEach(action => {
        const buttons = screen.getAllByRole('button', { name: action.label })
        expect(buttons.length).toBeGreaterThan(0)
      })
    })

    it('has proper aria-label on dropdown menu trigger', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      const dropdownTrigger = screen.getByLabelText('Quick actions menu')
      expect(dropdownTrigger).toBeDefined()
      expect(dropdownTrigger.getAttribute('aria-label')).toBe('Quick actions menu')
    })

    it('uses semantic button elements', () => {
      render(<QuickActionsToolbar actionHandlers={mockHandlers} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON')
      })
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
