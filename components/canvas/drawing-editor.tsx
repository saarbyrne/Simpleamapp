'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'

// Using any types to avoid import issues
type ExcalidrawImperativeAPI = any
type ExcalidrawElement = any

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading canvas...</div>
      </div>
    ),
  }
)
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Download, Share2, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { updateDrawing } from '@/app/actions/drawings'
import { ExportDialog } from './export-dialog'
import { CanvasErrorBoundary } from './canvas-error-boundary'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface DrawingEditorProps {
  drawingId: string
  initialData: any
  drawingName: string
  drawingType?: string
  onSave?: () => void
}

export function DrawingEditor({
  drawingId,
  initialData,
  drawingName,
  drawingType,
  onSave,
}: DrawingEditorProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Detect system theme preference - start with undefined to avoid hydration mismatch
  const [theme, setTheme] = useState<'light' | 'dark' | undefined>(undefined)

  useEffect(() => {
    // Check if user prefers dark mode (only runs client-side)
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(isDark ? 'dark' : 'light')

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Removed problematic updateScene call that was triggering onChange loop
  // The selection tool is now set via initialData only

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && excalidrawAPI) {
      // Clear previous timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      // Set new timer for auto-save after 3 seconds of inactivity
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave()
      }, 3000)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [hasUnsavedChanges])

  // Track initialization to avoid false "unsaved changes"
  // Use a more robust approach with timestamp to avoid race conditions
  const initTimestamp = useRef<number>(Date.now())
  const changeCountRef = useRef<number>(0)

  const handleChange = (elements: readonly ExcalidrawElement[], appState: any) => {
    changeCountRef.current++

    // Ignore the first 2 onChange calls which happen during initialization
    // and any changes within the first 500ms after mount
    const timeSinceInit = Date.now() - initTimestamp.current
    if (changeCountRef.current <= 2 || timeSinceInit < 500) {
      return
    }

    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!excalidrawAPI) return

    setIsSaving(true)
    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const files = excalidrawAPI.getFiles()

      const sceneData = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          gridSize: appState.gridSize,
          // Don't save activeTool state - always default to selection on load
        },
        files,
      }

      const result = await updateDrawing(drawingId, {
        data: sceneData,
      })

      if (result.success) {
        setHasUnsavedChanges(false)
        toast.success('Drawing saved successfully')
        onSave?.()
      } else {
        toast.error(result.error || 'Failed to save drawing')
      }
    } catch (error) {
      console.error('Error saving drawing:', error)
      toast.error('Failed to save drawing')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    setShowExportDialog(true)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    toast.info('Share functionality coming soon')
  }

  // Properly sanitize initialData while preserving user's viewport and preferences
  const sanitizedInitialData = initialData ? {
    elements: initialData.elements || [],
    appState: {
      // Preserve all existing appState properties
      ...(initialData.appState || {}),
      // Only override activeTool to prevent hand tool lock icon
      activeTool: {
        type: 'selection',
        locked: false,
        lastActiveTool: null,
      },
      // Ensure required properties have defaults if missing
      currentItemTextAlign: initialData.appState?.currentItemTextAlign || 'left',
      currentItemFontFamily: initialData.appState?.currentItemFontFamily || 1,
      viewBackgroundColor: initialData.appState?.viewBackgroundColor || '#ffffff',
    },
    files: initialData.files || {},
  } : {
    // Empty canvas with selection tool - no blank pitch template
    elements: [],
    appState: {
      activeTool: {
        type: 'selection',
        locked: false,
        lastActiveTool: null,
      },
      viewBackgroundColor: '#ffffff',
    },
    files: {},
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Minimal Top Bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div>
          <h2 className="text-sm font-semibold">{drawingName}</h2>
          <p className="text-xs text-muted-foreground">{drawingType || 'Tactical Board'}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">Unsaved</span>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            size="sm"
            variant="ghost"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
          <Button onClick={handleExport} size="sm" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas - Using Excalidraw's native toolbar */}
      <div className="flex-1 relative overflow-hidden">
        <CanvasErrorBoundary>
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={sanitizedInitialData}
            onChange={handleChange}
            viewModeEnabled={false}
            zenModeEnabled={false}
            theme={theme}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: false,
                clearCanvas: false,
                export: { saveFileToDisk: false },
                loadScene: false,
                saveAsImage: false,
              },
            }}
          />
        </CanvasErrorBoundary>
      </div>

      {/* Export dialog */}
      {showExportDialog && excalidrawAPI && (
        <ExportDialog
          excalidrawAPI={excalidrawAPI}
          drawingName={drawingName}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  )
}
