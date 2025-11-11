'use client'

import { useState, useEffect, useRef } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/dist/types/excalidraw/types'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/dist/types/excalidraw/element/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Download, Share2, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { updateDrawing } from '@/app/actions/drawings'
import { ExportDialog } from './export-dialog'
import { SportToolbar } from './sport-toolbar'
import { AiAssistant } from './ai-assistant'
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
  const [showAiAssistant, setShowAiAssistant] = useState(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  const handleChange = (elements: readonly ExcalidrawElement[], appState: any) => {
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{drawingName}</h2>
          {hasUnsavedChanges && (
            <Badge variant="secondary">Unsaved changes</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Sheet open={showAiAssistant} onOpenChange={setShowAiAssistant}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>AI Tactical Assistant</SheetTitle>
                <SheetDescription>
                  Get AI-powered suggestions for your tactical setup
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AiAssistant
                  drawingData={initialData}
                  drawingType={drawingType}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sport-specific toolbar */}
        <SportToolbar excalidrawAPI={excalidrawAPI} />

        {/* Excalidraw canvas */}
        <div className="flex-1">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={initialData}
            onChange={handleChange}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: true,
                clearCanvas: true,
                export: false, // We handle this
                loadScene: false,
                saveAsImage: false,
              },
            }}
          />
        </div>
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
