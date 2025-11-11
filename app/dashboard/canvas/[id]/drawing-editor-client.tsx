'use client'

import { DrawingEditor } from '@/components/canvas/drawing-editor'

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
  return (
    <DrawingEditor
      drawingId={drawingId}
      drawingName={drawingName}
      drawingType={drawingType}
      initialData={initialData}
    />
  )
}
