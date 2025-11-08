import { getPlayers } from '@/app/actions/players'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayersTableClient } from '@/components/players/players-table-client'
import { AddPlayerModal } from '@/components/players/add-player-modal'
import { ImportPlayersCSV } from '@/components/players/import-players-csv'

export default async function PlayersPage() {
  const { players } = await getPlayers()

  // Transform database players to match table format
  const tableData = players.map((player) => {
    const org = player.organizations[0]
    const firstName = player.firstName?.trim() || 'Unknown'
    const lastName = player.lastName?.trim() || ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    return {
      id: player.id,
      name: fullName,
      position: org?.position || 'N/A',
      status: (org?.status || 'active') as 'active' | 'injured',
      nationality: player.nationality || 'Unknown',
      tags: org?.tags || [],
      avatar: player.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName || 'player'}`,
    }
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Players</CardTitle>
              <CardDescription>
                Manage your team roster and player information.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <ImportPlayersCSV />
              <AddPlayerModal />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PlayersTableClient data={tableData} />
        </CardContent>
      </Card>
    </div>
  )
}
