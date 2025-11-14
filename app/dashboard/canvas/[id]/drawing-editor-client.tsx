'use client'

import { useEffect } from 'react'
import { DrawingEditor } from '@/components/canvas/drawing-editor'
import { useBreadcrumb } from '@/lib/breadcrumb-context'

interface DrawingEditorClientProps {
  drawingId: string
  drawingName: string
  drawingType?: string
  initialData: any
}

export function DrawingEditorClient({
  drawingId,
  drawingName,
  drawingType,
  initialData,
}: DrawingEditorClientProps) {
  const { setCustomLabel } = useBreadcrumb()

  // Set breadcrumb label for the drawing
  useEffect(() => {
    setCustomLabel(drawingId, drawingName)
    return () => setCustomLabel(drawingId, null) // Cleanup on unmount
  }, [drawingId, drawingName, setCustomLabel])

  useEffect(() => {
    // Add global error handler for Excalidraw parentNode errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error && (
        event.error.message?.includes('Cannot read properties of null (reading \'parentNode\')') ||
        event.error.message?.includes('parentNode')
      )) {
        console.warn('Global Excalidraw parentNode error caught and prevented:', event.error)
        event.preventDefault() // Prevent the error from being logged as unhandled
        return true
      }
      return false
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'object' && 'message' in event.reason && (
        (event.reason as Error).message?.includes('Cannot read properties of null (reading \'parentNode\')') ||
        (event.reason as Error).message?.includes('parentNode')
      )) {
        console.warn('Global Excalidraw parentNode promise rejection caught and prevented:', event.reason)
        event.preventDefault() // Prevent the rejection from being logged as unhandled
        return true
      }
      return false
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <DrawingEditor
      drawingId={drawingId}
      drawingName={drawingName}
      drawingType={drawingType}
      initialData={initialData}
    />
  )
}
