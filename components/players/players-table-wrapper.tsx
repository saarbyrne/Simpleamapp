import { getPlayers } from '@/app/actions/players'
import { PlayersTable } from '@/components/players-table'

export async function PlayersTableWrapper({ onPlayerClick }: { onPlayerClick?: (playerId: string, playerName: string) => void }) {
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

  return <PlayersTable data={tableData} onPlayerClick={onPlayerClick} />
}
