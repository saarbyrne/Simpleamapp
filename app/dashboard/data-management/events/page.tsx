import { getEventsData } from '@/app/actions/data-tables'
import { DataTableView } from '@/components/data-management/data-table-view'

export const metadata = {
  title: 'Events | SAM',
  description: 'Manage events data',
}

export default async function EventsDataPage() {
  const result = await getEventsData()

  if (result.error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">{result.error}</div>
      </div>
    )
  }

  return (
    <DataTableView
      tableName={result.meta?.tableName || 'Events'}
      description={result.meta?.description || 'Manage events data'}
      schema={result.schema || []}
      data={result.data || []}
      dataType="events"
    />
  )
}
