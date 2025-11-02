import { getPlayers } from '@/app/actions/players'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayersTable } from '@/components/players-table'
import { AddPlayerDialog } from '@/components/players/add-player-dialog'

export default async function PlayersPage() {
  const { players } = await getPlayers()

  // Transform database players to match table format
  const tableData = players.map((player) => {
    const org = player.organizations[0]
    return {
      id: player.id,
      name: `${player.firstName} ${player.lastName}`,
      position: org?.position || 'N/A',
      status: (org?.status || 'active') as 'active' | 'injured',
      nationality: player.nationality || 'Unknown',
      tags: org?.tags || [],
      avatar: player.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.firstName}`,
    }
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Players</CardTitle>
              <CardDescription>
                Manage your team roster and player information.
              </CardDescription>
            </div>
            <AddPlayerDialog />
          </div>
        </CardHeader>
        <CardContent>
          <PlayersTable data={tableData} />
        </CardContent>
      </Card>
    </div>
  )
}
