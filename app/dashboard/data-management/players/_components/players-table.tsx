import { getPlayersData } from '@/app/actions/data-tables'
import { DataTableView } from '@/components/data-management/data-table-view'

/**
 * Server Component that fetches and renders the players table
 * This streams independently, allowing the page header to render instantly
 */
export async function PlayersTable() {
  // Fetch first page of players (100 records with pagination)
  const result = await getPlayersData(1, 100)

  if (result.error) {
    return (
      <div className="text-center text-destructive p-8">
        {result.error}
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
