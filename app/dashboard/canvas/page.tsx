import { DrawingLibrary } from '@/components/canvas/drawing-library'

export default function CanvasPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tactical Whiteboard</h1>
        <p className="text-muted-foreground">
          Create formations, drills, and tactical diagrams
        </p>
      </div>
      <DrawingLibrary />
    </div>
  )
}
