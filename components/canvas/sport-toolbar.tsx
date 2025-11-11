'use client'

import { useState } from 'react'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/dist/types/excalidraw/types'
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
    <div className="w-64 border-r bg-background flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Pitch Templates */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Pitch Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement('pitch-full')}
                className="flex flex-col h-auto py-2"
              >
                <Map className="h-5 w-5 mb-1" />
                <span className="text-xs">Full Pitch</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement('pitch-half')}
                className="flex flex-col h-auto py-2"
              >
                <Map className="h-5 w-5 mb-1" />
                <span className="text-xs">Half Pitch</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Players */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Players</h3>
            <div className="flex gap-2 mb-3">
              <Button
                variant={selectedTeam === 'team1' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTeam('team1')}
                className="flex-1"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                Team 1
              </Button>
              <Button
                variant={selectedTeam === 'team2' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTeam('team2')}
                className="flex-1"
              >
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                Team 2
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => addElement('player')}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </div>

          <Separator />

          {/* Equipment */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Equipment</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement('cone')}
                className="flex flex-col h-auto py-2"
              >
                <Triangle className="h-5 w-5 mb-1 text-orange-500" />
                <span className="text-xs">Cone</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement('ball')}
                className="flex flex-col h-auto py-2"
              >
                <Ball className="h-5 w-5 mb-1" />
                <span className="text-xs">Ball</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement('goal')}
                className="flex flex-col h-auto py-2"
              >
                <Goal className="h-5 w-5 mb-1" />
                <span className="text-xs">Goal</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Click elements to add to center</li>
              <li>Use arrow tool for movements</li>
              <li>Double-click to add labels</li>
              <li>Hold Shift to draw straight lines</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
