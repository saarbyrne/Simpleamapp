'use client'

import { useRef } from 'react'
import { DrawingLibrary, type DrawingLibraryHandle } from '@/components/canvas/drawing-library'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CanvasPage() {
  const drawingLibraryRef = useRef<DrawingLibraryHandle>(null)

  return (
    <>
      <PageHeader
        title="Tactical Whiteboard"
        description="Create formations, drills, and tactical diagrams"
        headerActions={
          <Button onClick={() => drawingLibraryRef.current?.openCreateDialog()}>
            <Plus className="h-4 w-4 me-2" />
            New Drawing
          </Button>
        }
      />
      <DrawingLibrary ref={drawingLibraryRef} />
    </>
  )
}
