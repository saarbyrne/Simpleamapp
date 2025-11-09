import { differenceInYears } from 'date-fns'
import { PlayersTable, type PlayerRow } from '@/components/dashboard/players-table-new'
import { getPlayers } from '@/app/actions/players'

type PlayersPageProps = {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 0
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : 20
  
  const result = await getPlayers(page, pageSize)
  
  // Handle errors
  if (result.error) {
    console.error('Error fetching players:', result.error)
  }
  
  const { players = [], total = 0 } = result

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
      phone: player.phone ?? null,
      photo: player.photo ?? null,
      joinedAt: organization?.joinedAt ?? null,
    }
  })

  return <PlayersTable players={roster} total={total} />
}
