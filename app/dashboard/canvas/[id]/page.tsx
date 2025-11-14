import { notFound } from 'next/navigation'
import { getDrawing } from '@/app/actions/drawings'
import { DrawingEditorClient } from './drawing-editor-client'

export default async function DrawingEditorPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getDrawing(params.id)

  if (!result.success || !result.drawing) {
    notFound()
  }

  return (
    <DrawingEditorClient
      drawingId={result.drawing.id}
      drawingName={result.drawing.name}
      drawingType={result.drawing.type || undefined}
      initialData={result.drawing.data}
    />
  )
}
