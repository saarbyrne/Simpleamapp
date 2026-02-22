'use client'

import { useState } from 'react'
import { WorkspaceTopBar } from './workspace-top-bar'
import { ConversationPanel } from './conversation-panel'
import { CanvasContainer } from './canvas-container'
import { FiltersPanel } from './filters-panel'
import { cn } from '@/lib/utils'

interface WorkspaceCanvasProps {
  workspace: any // We'll type this properly based on the Prisma model
}

export function WorkspaceCanvas({ workspace }: WorkspaceCanvasProps) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(38) // 38% default
  const [isResizing, setIsResizing] = useState(false)
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)
  const [filtersPanelWidth, setFiltersPanelWidth] = useState(25) // 25% default

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const container = document.getElementById('workspace-container')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

    // Constrain between 25% and 50%
    if (newWidth >= 25 && newWidth <= 50) {
      setLeftPanelWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  // Add event listeners for resizing
  useState(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove as any)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  })

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <WorkspaceTopBar workspace={workspace} />

      {/* Split Screen Layout */}
      <div
        id="workspace-container"
        className="relative flex flex-1 overflow-hidden"
      >
        {/* Left Panel - Conversation + Controls */}
        <div
          className="flex flex-col border-r bg-background"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <ConversationPanel
            workspace={workspace}
            onToggleFilters={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
          />
        </div>

        {/* Resize Handle */}
        <div
          className={cn(
            'group relative w-1 cursor-col-resize bg-border transition-colors hover:bg-primary',
            isResizing && 'bg-primary'
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -start-1 -end-1" />
          <div className="absolute start-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/50 transition-colors group-hover:bg-primary" />
        </div>

        {/* Right Panel - Canvas */}
        <div
          className="flex flex-1 overflow-hidden"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          <div className="flex-1 overflow-auto bg-muted/30">
            <CanvasContainer workspace={workspace} />
          </div>

          {/* Filters Panel */}
          {isFiltersPanelOpen && (
            <>
              {/* Resize Handle for Filters */}
              <div
                className="group relative w-1 cursor-col-resize bg-border transition-colors hover:bg-primary"
              >
                <div className="absolute inset-y-0 -start-1 -end-1" />
                <div className="absolute start-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/50 transition-colors group-hover:bg-primary" />
              </div>

              <div
                className="border-l bg-background"
                style={{ width: `${filtersPanelWidth}%`, minWidth: '300px', maxWidth: '500px' }}
              >
                <FiltersPanel
                  workspace={workspace}
                  onClose={() => setIsFiltersPanelOpen(false)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
