'use client'

import { useState } from 'react'
// Using any types for Excalidraw to avoid import issues
type ExcalidrawImperativeAPI = any
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Circle,
  Triangle,
  Circle as Ball,
  Goal,
  Map,
  User,
  ArrowRight,
} from 'lucide-react'
import { createSportElement } from '@/lib/canvas/sport-elements'
import type { SportElementType } from '@/lib/canvas/sport-elements'
import { toast } from 'sonner'

interface SportToolbarProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null
}

interface ToolButton {
  id: SportElementType | 'pitch-full' | 'pitch-half'
  label: string
  icon: React.ReactNode
  color?: string
}

const TOOL_BUTTONS: ToolButton[] = [
  { id: 'pitch-full', label: 'Full Pitch', icon: <Map className="h-4 w-4" /> },
  { id: 'pitch-half', label: 'Half Pitch', icon: <Map className="h-4 w-4" /> },
  { id: 'player', label: 'Player', icon: <Circle className="h-4 w-4" />, color: '#1971c2' },
  { id: 'cone', label: 'Cone', icon: <Triangle className="h-4 w-4" />, color: '#f76707' },
  { id: 'ball', label: 'Ball', icon: <Ball className="h-4 w-4" /> },
  { id: 'goal', label: 'Goal', icon: <Goal className="h-4 w-4" /> },
]

export function SportToolbar({ excalidrawAPI }: SportToolbarProps) {
  const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2'>('team1')

  const addElement = (type: SportElementType | 'pitch-full' | 'pitch-half') => {
    if (!excalidrawAPI) {
      toast.error('Canvas not ready')
      return
    }

    try {
      // Get canvas center for placement
      const appState = excalidrawAPI.getAppState()
      const { scrollX = 0, scrollY = 0, zoom = { value: 1 } } = appState as any

      const centerX = (-scrollX + window.innerWidth / 2) / zoom.value
      const centerY = (-scrollY + window.innerHeight / 2) / zoom.value

      let elements: any
      const color = selectedTeam === 'team1' ? '#1971c2' : '#e03131'

      if (type === 'pitch-full') {
        elements = createSportElement('pitch-full', { x: centerX - 400, y: centerY - 260, type: 'full' })
      } else if (type === 'pitch-half') {
        elements = createSportElement('pitch-half', { x: centerX - 200, y: centerY - 260, type: 'half' })
      } else if (type === 'player') {
        elements = createSportElement('player', { x: centerX, y: centerY, color })
      } else {
        elements = createSportElement(type as SportElementType, { x: centerX, y: centerY })
      }

      const elementsArray = Array.isArray(elements) ? elements : [elements]
      const currentElements = excalidrawAPI.getSceneElements()

      excalidrawAPI.updateScene({
        elements: [...currentElements, ...elementsArray],
      })

      toast.success(`${type} added to canvas`)
    } catch (error) {
      console.error('Error adding element:', error)
      toast.error('Failed to add element')
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-background">
      {/* Selection Tool */}
      <Button variant="default" size="icon" className="h-9 w-9">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4l12 8-5.5 1.5L6 18l-2-2 4.5-2.5L2 8V4z" />
        </svg>
      </Button>

      {/* Players */}
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => addElement('player')} title="Add Player">
        <User className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => addElement('player')} title="Add Player 2">
        <User className="h-4 w-4" />
      </Button>

      {/* Arrow */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Draw Arrow">
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Rectangle */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Rectangle">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" strokeWidth="2" />
        </svg>
      </Button>

      {/* Line */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Line">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <line x1="5" y1="19" x2="19" y2="5" strokeWidth="2" />
        </svg>
      </Button>

      {/* Pen */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Draw">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </Button>

      {/* Diamond */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Diamond" onClick={() => addElement('cone')}>
        <Triangle className="h-4 w-4" />
      </Button>

      {/* Undo */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Undo">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </Button>

      {/* Redo */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Redo">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
      </Button>

      <Separator orientation="vertical" className="h-6 mx-2" />

      {/* Full Pitch Button */}
      <Button variant="outline" size="sm" onClick={() => addElement('pitch-full')} className="h-8">
        Full Pitch
      </Button>

      {/* Grid */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Grid">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      </Button>

      {/* More */}
      <Button variant="ghost" size="icon" className="h-9 w-9" title="More options">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="5" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="15" r="1.5" />
        </svg>
      </Button>
    </div>
  )
}
