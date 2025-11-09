import { differenceInYears } from 'date-fns'
import { PlayersTable, type PlayerRow } from '@/components/dashboard/players-table-new'
import { getPlayers } from '@/app/actions/players'

export default async function PlayersPage() {
  const { players = [] } = await getPlayers()

  const roster: PlayerRow[] = players.map((player) => {
    const organization = player.organizations?.[0]
    const status = organization?.status ?? 'active'
    return {
      id: player.id,
      name: `${player.firstName} ${player.lastName}`,
      position: organization?.position ?? null,
      age: player.dateOfBirth
        ? differenceInYears(new Date(), new Date(player.dateOfBirth))
        : null,
      nationality: player.nationality ?? null,
      status: status.toLowerCase(),
      tags: organization?.tags ?? [],
      jerseyNumber: organization?.jerseyNumber ?? null,
      email: player.email ?? null,
      photo: player.photo ?? null,
    }
  })

  return <PlayersTable players={roster} />
}
