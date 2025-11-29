import { getTrashItems } from '@/app/actions/data-management'
import { TrashClient } from './trash-client'

export const metadata = {
  title: 'Trash | SAM',
  description: 'Manage deleted items',
}

export default async function TrashPage() {
  const result = await getTrashItems()

  if (result.error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">{result.error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <TrashClient items={result.data || []} />
    </div>
  )
}
