'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ArrowLeft,
  Save,
  Undo2,
  Redo2,
  Eraser,
  Users,
  User,
  MousePointer2,
  PenTool,
  ArrowRight,
  Square,
  Minus,
  Grid3X3,
  X,
  Film,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Settings,
  RotateCcw,
  Copy,
  Minimize2,
} from 'lucide-react'

interface TacticalBoard {
  id: string
  title: string
  formation: string
  phase_of_play?: string
  created_at: string
  opponent?: string
  match_date?: string
  objectives?: string[]
}

interface Player {
  id: string
  name: string
  number: number
  position: { x: number; y: number }
  team: 'home' | 'away'
}

interface DrawnObject {
  id: string
  type: 'player' | 'opposition' | 'arrow' | 'zone' | 'line' | 'drawing'
  position: { x: number; y: number }
  endPosition?: { x: number; y: number }
  team?: 'home' | 'away'
  label?: string
  path?: { x: number; y: number }[]
}

interface Keyframe {
  id: string
  name: string
  timestamp: number
  players: Player[]
  objects: DrawnObject[]
}

interface TacticalBoardEditorProps {
  board: TacticalBoard
  onBack: () => void
  onSave: (board: TacticalBoard) => void
}

const fieldBackgrounds = [
  { id: 'empty', label: 'Empty' },
  { id: 'full', label: 'Full Pitch' },
  { id: 'attacking', label: 'Attacking Half' },
  { id: 'defensive', label: 'Defensive Half' },
]

const drawingTools = [
  { id: 'select', label: 'Select', icon: MousePointer2, cursor: 'default', shortcut: 'S' },
  { id: 'player', label: 'Player', icon: Users, cursor: 'crosshair', shortcut: 'P' },
  { id: 'opposition', label: 'Opposition', icon: User, cursor: 'crosshair', shortcut: 'O' },
  { id: 'arrow', label: 'Arrow', icon: ArrowRight, cursor: 'crosshair', shortcut: 'A' },
  { id: 'zone', label: 'Zone', icon: Square, cursor: 'crosshair', shortcut: 'Z' },
  { id: 'line', label: 'Line', icon: Minus, cursor: 'crosshair', shortcut: 'L' },
  { id: 'pen', label: 'Draw', icon: PenTool, cursor: 'crosshair', shortcut: 'D' },
  { id: 'eraser', label: 'Eraser', icon: Eraser, cursor: 'pointer', shortcut: 'E' },
]

const formations = [
  '4-3-3',
  '4-4-2',
  '3-5-2',
  '4-2-3-1',
  '3-4-3',
  '5-3-2',
]

const phaseOptions = [
  'Build-up',
  'Attacking',
  'Defensive',
  'Transition',
  'Set Pieces',
]

type ToolState = 'idle' | 'drawing' | 'dragging' | 'selecting'

export function TacticalBoardEditor({
  board,
  onBack,
  onSave,
}: TacticalBoardEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Core state
  const [selectedTool, setSelectedTool] = useState('select')
  const [toolState, setToolState] = useState<ToolState>('idle')
  const [fieldBackground, setFieldBackground] = useState('full')
  const [showGrid, setShowGrid] = useState(false)

  // Drawing state
  const [players, setPlayers] = useState<Player[]>([])
  const [drawnObjects, setDrawnObjects] = useState<DrawnObject[]>([])
  const [selectedObject, setSelectedObject] = useState<string | null>(null)

  // Animation state
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    {
      id: '1',
      name: 'Start',
      timestamp: 0,
      players: [],
      objects: [],
    },
  ])
  const [currentKeyframe, setCurrentKeyframe] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(3)

  // Interaction state
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [previewObject, setPreviewObject] = useState<DrawnObject | null>(null)

  // Canvas dimensions
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  })

  // History management
  const [undoStack, setUndoStack] = useState<{
    players: Player[]
    objects: DrawnObject[]
  }[]>([])
  const [redoStack, setRedoStack] = useState<{
    players: Player[]
    objects: DrawnObject[]
  }[]>([])

  // Settings
  const [boardSettings, setBoardSettings] = useState({
    title: board.title,
    formation: board.formation,
    phase_of_play: board.phase_of_play || '',
    objectives: board.objectives?.join(', ') || '',
    opponent: board.opponent || '',
    notes: '',
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Memoized cursor style for performance
  const currentCursor = useMemo(() => {
    const tool = drawingTools.find(t => t.id === selectedTool)
    return tool?.cursor || 'default'
  }, [selectedTool])

  // History management utilities
  const saveToHistory = useCallback(() => {
    setUndoStack(prev => [...prev, { players: [...players], objects: [...drawnObjects] }])
    setRedoStack([]) // Clear redo stack when new action is performed
  }, [players, drawnObjects])

  // Keyframe state restoration
  const restoreKeyframeState = useCallback((keyframe: Keyframe) => {
    const clonedPlayers = keyframe.players.map(player => ({
      ...player,
      position: { ...player.position }
    }))

    const clonedObjects = keyframe.objects.map(obj => ({
      ...obj,
      position: { ...obj.position },
      endPosition: obj.endPosition ? { ...obj.endPosition } : undefined,
      path: obj.path ? obj.path.map(point => ({ ...point })) : undefined
    }))

    setPlayers(clonedPlayers)
    setDrawnObjects(clonedObjects)
    setSelectedObject(null)
  }, [])

  // Playback animation system
  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current)
      playbackTimerRef.current = null
    }
  }, [])

  // Handle playback toggle
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback()
    } else {
      if (keyframes.length <= 1) return

      if (currentKeyframe >= keyframes.length - 1) {
        setCurrentKeyframe(0)
        restoreKeyframeState(keyframes[0])
      }

      setIsPlaying(true)
    }
  }, [isPlaying, stopPlayback, keyframes, currentKeyframe, restoreKeyframeState])

  // Playback effect
  useEffect(() => {
    if (!isPlaying || keyframes.length <= 1) {
      return
    }

    const playNextFrame = () => {
      setCurrentKeyframe(prev => {
        const nextFrame = prev + 1

        if (nextFrame >= keyframes.length) {
          setIsPlaying(false)
          return prev
        }

        const keyframe = keyframes[nextFrame]
        restoreKeyframeState(keyframe)

        if (nextFrame + 1 < keyframes.length) {
          playbackTimerRef.current = setTimeout(() => {
            playNextFrame()
          }, 2000 / playbackSpeed)
        } else {
          playbackTimerRef.current = setTimeout(() => {
            setIsPlaying(false)
          }, 2000 / playbackSpeed)
        }

        return nextFrame
      })
    }

    playbackTimerRef.current = setTimeout(() => {
      playNextFrame()
    }, 2000 / playbackSpeed)

    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current)
        playbackTimerRef.current = null
      }
    }
  }, [isPlaying, keyframes, playbackSpeed, restoreKeyframeState])

  // Navigate to specific keyframe
  const goToKeyframe = useCallback((index: number) => {
    if (index >= 0 && index < keyframes.length && index !== currentKeyframe) {
      if (isPlaying) {
        stopPlayback()
      }

      setCurrentKeyframe(index)
      const keyframe = keyframes[index]
      if (keyframe) {
        restoreKeyframeState(keyframe)
      }
    }
  }, [keyframes, restoreKeyframeState, isPlaying, stopPlayback, currentKeyframe])

  // Delete selected object
  const deleteSelectedObject = useCallback(() => {
    if (!selectedObject) return

    saveToHistory()

    const playerToDelete = players.find(p => p.id === selectedObject)
    if (playerToDelete) {
      setPlayers(prev => prev.filter(p => p.id !== selectedObject))
      setSelectedObject(null)
      return
    }

    const objectToDelete = drawnObjects.find(obj => obj.id === selectedObject)
    if (objectToDelete) {
      setDrawnObjects(prev => prev.filter(obj => obj.id !== selectedObject))
      setSelectedObject(null)
      return
    }
  }, [selectedObject, players, drawnObjects, saveToHistory])

  // Add keyframe
  const addKeyframe = useCallback(() => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      name: `Frame ${keyframes.length + 1}`,
      timestamp: Date.now(),
      players: players.map(player => ({
        ...player,
        position: { ...player.position }
      })),
      objects: drawnObjects.map(obj => ({
        ...obj,
        position: { ...obj.position },
        endPosition: obj.endPosition ? { ...obj.endPosition } : undefined,
        path: obj.path ? obj.path.map(point => ({ ...point })) : undefined
      })),
    }

    setKeyframes(prev => [...prev, newKeyframe])
    setCurrentKeyframe(keyframes.length)
  }, [players, drawnObjects, keyframes.length])

  // Remove keyframe
  const removeKeyframe = useCallback((index: number) => {
    if (keyframes.length <= 1) return

    if (isPlaying && index <= currentKeyframe) {
      stopPlayback()
    }

    const newKeyframes = keyframes.filter((_, i) => i !== index)
    setKeyframes(newKeyframes)

    if (currentKeyframe >= newKeyframes.length) {
      const newIndex = newKeyframes.length - 1
      setCurrentKeyframe(newIndex)
      restoreKeyframeState(newKeyframes[newIndex])
    } else if (currentKeyframe === index) {
      const newIndex = Math.max(0, index - 1)
      setCurrentKeyframe(newIndex)
      restoreKeyframeState(newKeyframes[newIndex])
    }
  }, [keyframes, currentKeyframe, isPlaying, stopPlayback, restoreKeyframeState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current)
        playbackTimerRef.current = null
      }
    }
  }, [])

  // Tool selection
  const handleToolSelect = useCallback((toolId: string) => {
    if (selectedTool === toolId && toolId !== 'select') {
      setSelectedTool('select')
    } else {
      setSelectedTool(toolId)
    }
    setSelectedObject(null)
    setToolState('idle')
    setPreviewObject(null)
    setCurrentPath([])
  }, [selectedTool])

  // Canvas sizing
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    const backgroundCanvas = backgroundCanvasRef.current
    const container = containerRef.current

    if (!canvas || !backgroundCanvas || !container) return

    const containerRect = container.getBoundingClientRect()
    if (containerRect.width <= 0 || containerRect.height <= 0) return

    // Increased available height since no header
    const padding = 16
    const availableWidth = Math.max(containerRect.width - padding, 200)
    const availableHeight = Math.max(containerRect.height - padding, 150)

    const aspectRatio = 4 / 3
    let width = availableWidth
    let height = width / aspectRatio

    if (height > availableHeight) {
      height = availableHeight
      width = height * aspectRatio
    }

    width = Math.max(width, 400)
    height = Math.max(height, 300)

    if (
      Math.abs(canvasSize.width - width) > 2 ||
      Math.abs(canvasSize.height - height) > 2
    ) {
      setCanvasSize({ width, height })

      const devicePixelRatio = window.devicePixelRatio || 1

      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      backgroundCanvas.width = width * devicePixelRatio
      backgroundCanvas.height = height * devicePixelRatio
      backgroundCanvas.style.width = `${width}px`
      backgroundCanvas.style.height = `${height}px`

      const ctx = canvas.getContext('2d')
      const bgCtx = backgroundCanvas.getContext('2d')

      if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio)
      }
      if (bgCtx) {
        bgCtx.scale(devicePixelRatio, devicePixelRatio)
      }
    }
  }, [canvasSize.width, canvasSize.height])

  // Canvas resize observer
  useEffect(() => {
    updateCanvasSize()

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateCanvasSize])

  // Background rendering
  const drawBackground = useCallback(() => {
    const canvas = backgroundCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (canvasSize.width <= 0 || canvasSize.height <= 0) return

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    ctx.fillStyle = '#4ade80'
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    if (fieldBackground !== 'empty') {
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2

      const padding = 20
      const fieldWidth = canvasSize.width - padding * 2
      const fieldHeight = canvasSize.height - padding * 2

      ctx.strokeRect(padding, padding, fieldWidth, fieldHeight)
    }

    if (fieldBackground !== 'empty') {
      const padding = 20
      const fieldWidth = canvasSize.width - padding * 2
      const fieldHeight = canvasSize.height - padding * 2
      const centerX = canvasSize.width / 2
      const centerY = canvasSize.height / 2

      if (fieldBackground === 'full') {
        ctx.beginPath()
        ctx.moveTo(centerX, padding)
        ctx.lineTo(centerX, canvasSize.height - padding)
        ctx.stroke()

        ctx.beginPath()
        const circleRadius = Math.max(Math.min(fieldWidth, fieldHeight) * 0.1, 10)
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      const penaltyWidth = fieldWidth * 0.125
      const penaltyHeight = fieldHeight * 0.27
      const goalWidth = fieldWidth * 0.05
      const goalHeight = fieldHeight * 0.13

      if (fieldBackground === 'full' || fieldBackground === 'attacking') {
        ctx.strokeRect(
          canvasSize.width - padding - penaltyWidth,
          centerY - penaltyHeight / 2,
          penaltyWidth,
          penaltyHeight,
        )
        ctx.strokeRect(
          canvasSize.width - padding - goalWidth,
          centerY - goalHeight / 2,
          goalWidth,
          goalHeight,
        )
      }

      if (fieldBackground === 'full' || fieldBackground === 'defensive') {
        ctx.strokeRect(
          padding,
          centerY - penaltyHeight / 2,
          penaltyWidth,
          penaltyHeight,
        )
        ctx.strokeRect(
          padding,
          centerY - goalHeight / 2,
          goalWidth,
          goalHeight,
        )
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1

      const gridSize = Math.min(canvasSize.width, canvasSize.height) / 20

      for (let x = 0; x < canvasSize.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasSize.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvasSize.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasSize.width, y)
        ctx.stroke()
      }
    }
  }, [fieldBackground, showGrid, canvasSize])

  // Dynamic content rendering
  const drawDynamicContent = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (canvasSize.width <= 0 || canvasSize.height <= 0) return

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    const playerRadius = Math.max(Math.abs(canvasSize.width * 0.015), 8)

    // Draw players
    players.forEach((player) => {
      const isSelected = selectedObject === player.id
      const isHovered = selectedTool === 'eraser'

      ctx.fillStyle = player.team === 'home' ? '#3b82f6' : '#ef4444'

      if (isSelected) {
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 4
      } else if (isHovered) {
        ctx.strokeStyle = '#ff4444'
        ctx.lineWidth = 2
      } else {
        ctx.strokeStyle = 'transparent'
        ctx.lineWidth = 3
      }

      ctx.beginPath()
      ctx.arc(
        player.position.x,
        player.position.y,
        Math.max(playerRadius, 1),
        0,
        Math.PI * 2,
      )
      ctx.fill()

      if (isSelected || isHovered) {
        ctx.stroke()
      }

      ctx.fillStyle = 'white'
      ctx.font = `${Math.max(playerRadius * 0.7, 8)}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        player.number.toString(),
        player.position.x,
        player.position.y,
      )
    })

    // Draw objects
    drawnObjects.forEach((obj) => {
      const isSelected = selectedObject === obj.id
      const isHovered = selectedTool === 'eraser'
      const lineWidth = Math.max(canvasSize.width * 0.004, 2)

      switch (obj.type) {
        case 'opposition':
          ctx.fillStyle = '#ef4444'

          if (isSelected) {
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 4
          } else if (isHovered) {
            ctx.strokeStyle = '#ff4444'
            ctx.lineWidth = 2
          } else {
            ctx.strokeStyle = 'transparent'
            ctx.lineWidth = 3
          }

          ctx.beginPath()
          ctx.arc(
            obj.position.x,
            obj.position.y,
            Math.max(playerRadius, 1),
            0,
            Math.PI * 2,
          )
          ctx.fill()

          if (isSelected || isHovered) {
            ctx.stroke()
          }

          ctx.strokeStyle = 'white'
          ctx.lineWidth = 2
          const crossSize = Math.max(playerRadius * 0.5, 3)
          ctx.beginPath()
          ctx.moveTo(obj.position.x - crossSize, obj.position.y - crossSize)
          ctx.lineTo(obj.position.x + crossSize, obj.position.y + crossSize)
          ctx.moveTo(obj.position.x + crossSize, obj.position.y - crossSize)
          ctx.lineTo(obj.position.x - crossSize, obj.position.y + crossSize)
          ctx.stroke()
          break

        case 'arrow':
          if (obj.endPosition) {
            ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#ff4444' : '#fbbf24'
            ctx.lineWidth = isSelected || isHovered ? lineWidth + 1 : lineWidth
            ctx.beginPath()
            ctx.moveTo(obj.position.x, obj.position.y)
            ctx.lineTo(obj.endPosition.x, obj.endPosition.y)
            ctx.stroke()

            const angle = Math.atan2(
              obj.endPosition.y - obj.position.y,
              obj.endPosition.x - obj.position.x,
            )
            const arrowSize = Math.max(playerRadius * 0.8, 5)
            ctx.beginPath()
            ctx.moveTo(obj.endPosition.x, obj.endPosition.y)
            ctx.lineTo(
              obj.endPosition.x - arrowSize * Math.cos(angle - Math.PI / 6),
              obj.endPosition.y - arrowSize * Math.sin(angle - Math.PI / 6),
            )
            ctx.lineTo(
              obj.endPosition.x - arrowSize * Math.cos(angle + Math.PI / 6),
              obj.endPosition.y - arrowSize * Math.sin(angle + Math.PI / 6),
            )
            ctx.closePath()
            ctx.fillStyle = isSelected ? '#ffffff' : isHovered ? '#ff4444' : '#fbbf24'
            ctx.fill()
          }
          break

        case 'zone':
          if (obj.endPosition) {
            // Calculate proper rectangle dimensions
            const rectX = Math.min(obj.position.x, obj.endPosition.x);
            const rectY = Math.min(obj.position.y, obj.endPosition.y);
            const rectWidth = Math.abs(obj.endPosition.x - obj.position.x);
            const rectHeight = Math.abs(obj.endPosition.y - obj.position.y);
            
            ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#ff4444' : '#8b5cf6';
            ctx.fillStyle = isSelected
              ? 'rgba(255, 255, 255, 0.2)'
              : isHovered
              ? 'rgba(255, 68, 68, 0.2)'
              : 'rgba(139, 92, 246, 0.2)';
            ctx.lineWidth = isSelected || isHovered ? lineWidth + 1 : lineWidth;

            if (rectWidth > 0 && rectHeight > 0) {
              ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
              ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
            }
          }
          break

        case 'line':
          if (obj.endPosition) {
            ctx.strokeStyle = isSelected ? '#fbbf24' : isHovered ? '#ff4444' : '#ffffff'
            ctx.lineWidth = isSelected || isHovered ? lineWidth + 1 : lineWidth
            ctx.beginPath()
            ctx.moveTo(obj.position.x, obj.position.y)
            ctx.lineTo(obj.endPosition.x, obj.endPosition.y)
            ctx.stroke()
          }
          break

        case 'drawing':
          if (obj.path && obj.path.length > 1) {
            ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#ff4444' : '#ff6b35'
            ctx.lineWidth = isSelected || isHovered ? Math.max(lineWidth + 1, 4) : Math.max(lineWidth, 3)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            ctx.beginPath()
            ctx.moveTo(obj.path[0].x, obj.path[0].y)
            for (let i = 1; i < obj.path.length; i++) {
              ctx.lineTo(obj.path[i].x, obj.path[i].y)
            }
            ctx.stroke()
          }
          break
      }
    })

    // Draw preview object during drawing
    if (previewObject) {
      ctx.save()
      ctx.globalAlpha = 0.7

      switch (previewObject.type) {
        case 'zone':
          if (previewObject.endPosition) {
            // Calculate proper preview rectangle bounds
            const previewRectX = Math.min(previewObject.position.x, previewObject.endPosition.x);
            const previewRectY = Math.min(previewObject.position.y, previewObject.endPosition.y);
            const previewRectWidth = Math.abs(previewObject.endPosition.x - previewObject.position.x);
            const previewRectHeight = Math.abs(previewObject.endPosition.y - previewObject.position.y);
            
            ctx.strokeStyle = '#8b5cf6';
            ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            if (previewRectWidth > 0 && previewRectHeight > 0) {
              ctx.fillRect(previewRectX, previewRectY, previewRectWidth, previewRectHeight);
              ctx.strokeRect(previewRectX, previewRectY, previewRectWidth, previewRectHeight);
            }
          }
          break

        case 'arrow':
          if (previewObject.endPosition) {
            ctx.strokeStyle = '#fbbf24'
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])

            ctx.beginPath()
            ctx.moveTo(previewObject.position.x, previewObject.position.y)
            ctx.lineTo(previewObject.endPosition.x, previewObject.endPosition.y)
            ctx.stroke()
          }
          break

        case 'line':
          if (previewObject.endPosition) {
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])

            ctx.beginPath()
            ctx.moveTo(previewObject.position.x, previewObject.position.y)
            ctx.lineTo(previewObject.endPosition.x, previewObject.endPosition.y)
            ctx.stroke()
          }
          break
      }

      ctx.restore()
    }

    // Draw current drawing path
    if (currentPath.length > 1) {
      ctx.strokeStyle = '#ff6b35'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = 0.8

      ctx.beginPath()
      ctx.moveTo(currentPath[0].x, currentPath[0].y)
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y)
      }
      ctx.stroke()
    }
  }, [players, drawnObjects, selectedObject, canvasSize, previewObject, currentPath, selectedTool])

  // Rendering effects
  useEffect(() => {
    drawBackground()
  }, [drawBackground])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      drawDynamicContent()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [drawDynamicContent])

  // Coordinate calculation
  const getCanvasCoordinates = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    try {
      const rect = canvas.getBoundingClientRect()
      const clientX = 'touches' in event
        ? event.touches[0]?.clientX || event.changedTouches[0]?.clientX
        : event.clientX
      const clientY = 'touches' in event
        ? event.touches[0]?.clientY || event.changedTouches[0]?.clientY
        : event.clientY

      if (!canvasSize.width || !canvasSize.height || rect.width <= 0 || rect.height <= 0) {
        return { x: 0, y: 0 }
      }

      return {
        x: Math.max(0, Math.min(
          (clientX - rect.left) * (canvasSize.width / rect.width),
          canvasSize.width,
        )),
        y: Math.max(0, Math.min(
          (clientY - rect.top) * (canvasSize.height / rect.height),
          canvasSize.height,
        )),
      }
    } catch (error) {
      console.error('Coordinate calculation error:', error)
      return { x: 0, y: 0 }
    }
  }, [canvasSize])

  // Object detection
  const findObjectAt = useCallback((x: number, y: number) => {
    if (canvasSize.width <= 0 || canvasSize.height <= 0) return null

    const playerRadius = Math.max(Math.abs(canvasSize.width * 0.015), 8)

    for (const player of [...players].reverse()) {
      const dx = player.position.x - x
      const dy = player.position.y - y
      if (Math.sqrt(dx * dx + dy * dy) <= playerRadius) {
        return { type: 'player', id: player.id, object: player }
      }
    }

    for (const obj of [...drawnObjects].reverse()) {
      if (obj.type === 'player' || obj.type === 'opposition') {
        const dx = obj.position.x - x
        const dy = obj.position.y - y
        if (Math.sqrt(dx * dx + dy * dy) <= playerRadius) {
          return { type: 'object', id: obj.id, object: obj }
        }
      } else if (obj.type === 'drawing' && obj.path) {
        for (const point of obj.path) {
          const dx = point.x - x
          const dy = point.y - y
          if (Math.sqrt(dx * dx + dy * dy) <= 10) {
            return { type: 'object', id: obj.id, object: obj }
          }
        }
      } else if ((obj.type === 'arrow' || obj.type === 'line') && obj.endPosition) {
        const lineLength = Math.sqrt(
          Math.pow(obj.endPosition.x - obj.position.x, 2) +
          Math.pow(obj.endPosition.y - obj.position.y, 2)
        )
        if (lineLength > 0) {
          const t = Math.max(0, Math.min(1,
            ((x - obj.position.x) * (obj.endPosition.x - obj.position.x) +
             (y - obj.position.y) * (obj.endPosition.y - obj.position.y)) / (lineLength * lineLength)
          ))
          const closestX = obj.position.x + t * (obj.endPosition.x - obj.position.x)
          const closestY = obj.position.y + t * (obj.endPosition.y - obj.position.y)
          const distance = Math.sqrt(Math.pow(x - closestX, 2) + Math.pow(y - closestY, 2))
          if (distance <= 8) {
            return { type: 'object', id: obj.id, object: obj }
          }
        }
      } else if (obj.type === 'zone' && obj.endPosition) {
        const minX = Math.min(obj.position.x, obj.endPosition.x)
        const maxX = Math.max(obj.position.x, obj.endPosition.x)
        const minY = Math.min(obj.position.y, obj.endPosition.y)
        const maxY = Math.max(obj.position.y, obj.endPosition.y)
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          return { type: 'object', id: obj.id, object: obj }
        }
      }
    }

    return null
  }, [players, drawnObjects, canvasSize])

  // Canvas interaction handlers
  const handleCanvasStart = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault()
    const coords = getCanvasCoordinates(event)

    try {
      if (selectedTool === 'select') {
        const foundObject = findObjectAt(coords.x, coords.y)
        if (foundObject) {
          setSelectedObject(foundObject.id)
          setToolState('dragging')
          setStartPoint(coords)
        } else {
          setSelectedObject(null)
          setToolState('idle')
        }
        return
      }

      if (selectedTool === 'eraser') {
        const foundObject = findObjectAt(coords.x, coords.y)
        if (foundObject) {
          saveToHistory()
          if (foundObject.type === 'player') {
            setPlayers(prev => prev.filter(p => p.id !== foundObject.id))
          } else {
            setDrawnObjects(prev => prev.filter(obj => obj.id !== foundObject.id))
          }
        }
        return
      }

      saveToHistory()

      if (selectedTool === 'player') {
        const newPlayer: Player = {
          id: `player-${Date.now()}`,
          name: `Player ${players.filter((p) => p.team === 'home').length + 1}`,
          number: players.filter((p) => p.team === 'home').length + 1,
          position: coords,
          team: 'home',
        }
        setPlayers(prev => [...prev, newPlayer])
        setToolState('idle')
        return
      }

      if (selectedTool === 'opposition') {
        const newOpposition: DrawnObject = {
          id: `opp-${Date.now()}`,
          type: 'opposition',
          position: coords,
          team: 'away',
        }
        setDrawnObjects(prev => [...prev, newOpposition])
        setToolState('idle')
        return
      }

      if (['arrow', 'zone', 'line'].includes(selectedTool)) {
        setToolState('drawing')
        setIsDrawing(true)

        setPreviewObject({
          id: 'preview',
          type: selectedTool as 'arrow' | 'zone' | 'line',
          position: coords,
          endPosition: coords,
        })
        return
      }

      if (selectedTool === 'pen') {
        setToolState('drawing')
        setIsDrawing(true)
        setCurrentPath([coords])
        return
      }
    } catch (error) {
      console.error('Canvas start error:', error)
    }
  }, [selectedTool, getCanvasCoordinates, findObjectAt, players, saveToHistory])

  const handleCanvasMove = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault()
    const coords = getCanvasCoordinates(event)

    try {
      if (selectedTool === 'select' && selectedObject && toolState === 'dragging' && startPoint) {
        const selectedPlayer = players.find(p => p.id === selectedObject)
        if (selectedPlayer) {
          setPlayers(prev =>
            prev.map((p) =>
              p.id === selectedObject ? { ...p, position: coords } : p,
            ),
          )
        }

        const selectedDrawnObject = drawnObjects.find(obj => obj.id === selectedObject)
        if (selectedDrawnObject) {
          setDrawnObjects(prev =>
            prev.map((obj) =>
              obj.id === selectedObject ? { ...obj, position: coords } : obj,
            ),
          )
        }
        return
      }

      if (!isDrawing) return

      if (['arrow', 'zone', 'line'].includes(selectedTool) && startPoint) {
        let previewStart = startPoint;
        let previewEnd = coords;
        
        // For zone preview, calculate proper rectangle bounds
        if (selectedTool === 'zone') {
          const minX = Math.min(startPoint.x, coords.x);
          const minY = Math.min(startPoint.y, coords.y);
          const maxX = Math.max(startPoint.x, coords.x);
          const maxY = Math.max(startPoint.y, coords.y);
          
          previewStart = { x: minX, y: minY };
          previewEnd = { x: maxX, y: maxY };
        }
        
        setPreviewObject({
          id: 'preview',
          type: selectedTool as 'arrow' | 'zone' | 'line',
          position: previewStart,
          endPosition: previewEnd,
        })
        return
      }

      if (selectedTool === 'pen') {
        setCurrentPath(prev => [...prev, coords])
        return
      }
    } catch (error) {
      console.error('Canvas move error:', error)
    }
  }, [isDrawing, selectedTool, selectedObject, startPoint, getCanvasCoordinates, players, drawnObjects, toolState])

  const handleCanvasEnd = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault()
    const coords = getCanvasCoordinates(event)

    try {
      if (selectedTool === 'select' && toolState === 'dragging') {
        setToolState('idle')
        setStartPoint(null)
        return
      }

      if (!isDrawing) {
        setToolState('idle')
        return
      }

      if (['arrow', 'zone', 'line'].includes(selectedTool) && startPoint) {
        let finalStart = startPoint;
        let finalEnd = coords;
        
        // For zone (rectangle), ensure proper bounds
        if (selectedTool === 'zone') {
          const minX = Math.min(startPoint.x, coords.x);
          const minY = Math.min(startPoint.y, coords.y);
          const maxX = Math.max(startPoint.x, coords.x);
          const maxY = Math.max(startPoint.y, coords.y);
          
          finalStart = { x: minX, y: minY };
          finalEnd = { x: maxX, y: maxY };
        }
        
        const newObject: DrawnObject = {
          id: `${selectedTool}-${Date.now()}`,
          type: selectedTool as 'arrow' | 'zone' | 'line',
          position: finalStart,
          endPosition: finalEnd,
        }
        setDrawnObjects(prev => [...prev, newObject])
        setPreviewObject(null)
      }

      if (selectedTool === 'pen' && currentPath.length > 1) {
        const newDrawing: DrawnObject = {
          id: `drawing-${Date.now()}`,
          type: 'drawing',
          position: currentPath[0],
          path: [...currentPath],
        }
        setDrawnObjects(prev => [...prev, newDrawing])
        setCurrentPath([])
      }

      setIsDrawing(false)
      setStartPoint(null)
      setToolState('idle')
    } catch (error) {
      console.error('Canvas end error:', error)
    }
  }, [isDrawing, selectedTool, toolState, startPoint, currentPath, getCanvasCoordinates])

  // Undo/Redo
  const handleUndo = useCallback(() => {
    try {
      if (undoStack.length === 0) return

      const lastState = undoStack[undoStack.length - 1]
      setRedoStack(prev => [...prev, { players: [...players], objects: [...drawnObjects] }])
      setUndoStack(prev => prev.slice(0, -1))
      setPlayers(lastState.players)
      setDrawnObjects(lastState.objects)
      setSelectedObject(null)
    } catch (error) {
      console.error('Undo error:', error)
    }
  }, [undoStack, players, drawnObjects])

  const handleRedo = useCallback(() => {
    try {
      if (redoStack.length === 0) return

      const nextState = redoStack[redoStack.length - 1]
      setUndoStack(prev => [...prev, { players: [...players], objects: [...drawnObjects] }])
      setRedoStack(prev => prev.slice(0, -1))
      setPlayers(nextState.players)
      setDrawnObjects(nextState.objects)
      setSelectedObject(null)
    } catch (error) {
      console.error('Redo error:', error)
    }
  }, [redoStack, players, drawnObjects])

  // Team management
  const handleClearTeam = useCallback((teamType: 'home' | 'away') => {
    saveToHistory()
    setPlayers(prev => prev.filter(p => p.team !== teamType))
    setDrawnObjects(prev => prev.filter(obj => obj.team !== teamType))
    setSelectedObject(null)
  }, [saveToHistory])

  // Save board
  const handleSave = useCallback(() => {
    try {
      const updatedBoard = {
        ...board,
        ...boardSettings,
        objectives: boardSettings.objectives
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }
      onSave(updatedBoard)
    } catch (error) {
      console.error('Save error:', error)
    }
  }, [board, boardSettings, onSave])

  return (
    <TooltipProvider>
      <div className="h-screen flex bg-muted/30">
        {/* Left control column */}
        <aside className="w-[280px] border-r bg-background shadow-sm">
          <div className="flex h-full flex-col gap-8 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">New</p>
                  <h1 className="text-lg font-semibold leading-tight">{boardSettings.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {boardSettings.formation}
                    {boardSettings.phase_of_play && ` • ${boardSettings.phase_of_play}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Animation</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => goToKeyframe(Math.max(0, currentKeyframe - 1))}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={togglePlayback}
                    disabled={keyframes.length <= 1}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => goToKeyframe(Math.min(keyframes.length - 1, currentKeyframe + 1))}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <div className="ml-auto text-xs font-medium text-muted-foreground">{playbackSpeed}x</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, keyframes.length - 1)}
                  value={currentKeyframe}
                  onChange={(e) => goToKeyframe(Number(e.target.value))}
                  className="w-full h-1 rounded-full bg-muted"
                  disabled={keyframes.length <= 1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                  <span>Keyframes ({keyframes.length})</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={addKeyframe}>
                    + Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {keyframes.map((keyframe, index) => (
                    <button
                      type="button"
                      key={keyframe.id}
                      onClick={() => goToKeyframe(index)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                        currentKeyframe === index ? 'border-primary bg-primary/5' : 'hover:bg-muted/60'
                      }`}
                    >
                      <span className="truncate">{keyframe.name}</span>
                      {index !== 0 && (
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeKeyframe(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button onClick={handleSave} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Board
              </Button>
            </div>
          </div>
        </aside>

        {/* Canvas + bottom toolbar */}
        <div className="flex-1 flex flex-col min-h-0 px-4 py-6 lg:px-8">
          <div className="relative flex flex-1 flex-col rounded-3xl border bg-card shadow-md p-4 md:p-6">
            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border bg-card/90 px-2 py-1 shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={containerRef} className="flex-1 flex items-center justify-center">
              <div className="relative flex h-full w-full items-center justify-center">
                <canvas
                  ref={backgroundCanvasRef}
                  className="rounded-3xl border border-emerald-400 shadow-lg"
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    touchAction: 'none',
                  }}
                />

                <canvas
                  ref={canvasRef}
                  className="absolute rounded-3xl border border-transparent"
                  onMouseDown={handleCanvasStart}
                  onMouseMove={handleCanvasMove}
                  onMouseUp={handleCanvasEnd}
                  onTouchStart={handleCanvasStart}
                  onTouchMove={handleCanvasMove}
                  onTouchEnd={handleCanvasEnd}
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    touchAction: 'none',
                    cursor: currentCursor,
                  }}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <div className="flex w-full max-w-4xl flex-wrap items-center gap-2 rounded-full border bg-background px-4 py-3 shadow">
                {drawingTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedTool === tool.id ? 'default' : 'ghost'}
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => handleToolSelect(tool.id)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="flex items-center gap-2">
                          <span>{tool.label}</span>
                          <kbd className="text-xs px-1.5 py-0.5 bg-muted rounded">
                            {tool.shortcut}
                          </kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}

                <div className="mx-2 h-6 w-px bg-muted" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={handleUndo} disabled={undoStack.length === 0}>
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Undo (⌘Z)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={handleRedo} disabled={redoStack.length === 0}>
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Redo (⌘Y)</TooltipContent>
                </Tooltip>

                <div className="mx-2 h-6 w-px bg-muted" />

                <Select value={fieldBackground} onValueChange={setFieldBackground}>
                  <SelectTrigger className="h-10 w-[140px] rounded-full text-sm">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldBackgrounds.map((bg) => (
                      <SelectItem key={bg.id} value={bg.id}>
                        {bg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showGrid ? 'default' : 'ghost'}
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => setShowGrid(!showGrid)}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{showGrid ? 'Hide Grid' : 'Show Grid'}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleClearTeam('home')}>
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Clear Home Team</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleClearTeam('away')}>
                      <User className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Clear Opposition</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => {
                        setPlayers([]);
                        setDrawnObjects([]);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Reset Board</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board Settings</DialogTitle>
            <DialogDescription>Update tactical board details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="board-title">Title</Label>
              <Input
                id="board-title"
                value={boardSettings.title}
                onChange={(e) => setBoardSettings((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select
                value={boardSettings.formation}
                onValueChange={(value) => setBoardSettings((prev) => ({ ...prev, formation: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((formation) => (
                    <SelectItem key={formation} value={formation}>
                      {formation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phase of Play</Label>
              <Select
                value={boardSettings.phase_of_play}
                onValueChange={(value) => setBoardSettings((prev) => ({ ...prev, phase_of_play: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {phaseOptions.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="board-objectives">Objectives</Label>
              <Textarea
                id="board-objectives"
                rows={3}
                placeholder="Comma separated objectives"
                value={boardSettings.objectives}
                onChange={(e) => setBoardSettings((prev) => ({ ...prev, objectives: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
