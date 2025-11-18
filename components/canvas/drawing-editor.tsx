'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'

// Using any types to avoid import issues
type ExcalidrawImperativeAPI = any
type ExcalidrawElement = any

// Wrapper component to handle Excalidraw parentNode errors with React 18
function ExcalidrawWrapper({
  excalidrawAPI,
  initialData,
  onChange,
  theme,
}: {
  excalidrawAPI: (api: ExcalidrawImperativeAPI) => void
  initialData: any
  onChange: (elements: readonly ExcalidrawElement[], appState: any) => void
  theme: 'light' | 'dark' | undefined
}) {
  return (
    <Excalidraw
      excalidrawAPI={(api) => {
        try {
          excalidrawAPI(api)
        } catch (error) {
          console.warn('Excalidraw API error:', error)
        }
      }}
      initialData={initialData}
      onChange={(elements, appState) => {
        try {
          onChange(elements, appState)
        } catch (error) {
          console.warn('Excalidraw onChange error:', error)
        }
      }}
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
  )
}

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
import { Save, Share2, Loader2, Sparkles, Menu, Download } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

  // Track initialization to avoid false "unsaved changes"
  // Use a more robust approach with timestamp to avoid race conditions
  const initTimestamp = useRef<number>(Date.now())
  const changeCountRef = useRef<number>(0)
  const lastChangeTimeRef = useRef<number>(0)

  const handleChange = (elements: readonly ExcalidrawElement[], appState: any) => {
    changeCountRef.current++
    lastChangeTimeRef.current = Date.now()

    // Ignore the first 2 onChange calls which happen during initialization
    // and any changes within the first 500ms after mount
    const timeSinceInit = Date.now() - initTimestamp.current
    if (changeCountRef.current <= 2 || timeSinceInit < 500) {
      return
    }

    setHasUnsavedChanges(true)
  }

  const handleSave = useCallback(async (showFeedback: boolean = true) => {
    if (!excalidrawAPI) return

    if (showFeedback) {
      setIsSaving(true)
    }
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
        if (showFeedback) {
          toast.success('Drawing saved successfully')
        }
        onSave?.()
      } else {
        if (showFeedback) {
          toast.error(result.error || 'Failed to save drawing')
        } else {
          console.warn('Save failed:', result.error)
        }
      }
    } catch (error) {
      console.error('Error saving drawing:', error)
      if (showFeedback) {
        toast.error('Failed to save drawing')
      }
    } finally {
      if (showFeedback) {
        setIsSaving(false)
      }
    }
  }, [excalidrawAPI, drawingId, onSave])

  // Auto-save function without visual feedback to prevent flickering
  const performAutoSave = useCallback(async () => {
    await handleSave(false)
  }, [handleSave])

  // Auto-save functionality - only save when user has been inactive for 2+ seconds
  useEffect(() => {
    if (hasUnsavedChanges && excalidrawAPI) {
      // Clear previous timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      // Set new timer for auto-save after 10 seconds of inactivity
      autoSaveTimerRef.current = setTimeout(() => {
        // Check if user has been inactive for at least 2 seconds before auto-saving
        const timeSinceLastChange = Date.now() - lastChangeTimeRef.current
        if (timeSinceLastChange >= 2000) {
          // Perform auto-save without visual feedback to avoid flickering
          performAutoSave()
        }
      }, 10000)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [hasUnsavedChanges, excalidrawAPI, performAutoSave])

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
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Canvas - Using Excalidraw's native toolbar */}
      <div className="flex-1 relative overflow-hidden">
        {/* Canvas Menu */}
        <div className="fixed top-4 left-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border shadow-lg"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Download Canvas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">Unsaved</span>
          )}
          <Button
            onClick={() => handleSave()}
            disabled={isSaving || !hasUnsavedChanges}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
        </div>
        <CanvasErrorBoundary>
          <ExcalidrawWrapper
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={sanitizedInitialData}
            onChange={handleChange}
            theme={theme}
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
