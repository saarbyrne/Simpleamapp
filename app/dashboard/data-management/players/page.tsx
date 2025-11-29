import { getPlayersData } from '@/app/actions/data-tables'
import { DataTableView } from '@/components/data-management/data-table-view'

export const metadata = {
  title: 'Players | SAM',
  description: 'Manage player data',
}

export default async function PlayersDataPage() {
  const result = await getPlayersData()

  if (result.error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">{result.error}</div>
      </div>
    )
  }

  return (
    <DataTableView
      tableName={result.meta?.tableName || 'Players'}
      description={result.meta?.description || 'Manage player data'}
      schema={result.schema || []}
      data={result.data || []}
      dataType="players"
    />
  )
}
