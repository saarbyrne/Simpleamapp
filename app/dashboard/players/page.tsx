import { differenceInYears } from 'date-fns'
import { PlayersTable, type PlayerRow } from '@/components/dashboard/players-table-new'
import { getPlayers } from '@/app/actions/players'

type PlayersPageProps = {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

// ISR: Regenerate page every 5 minutes for frequently accessed data
export const revalidate = 300

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  // For small datasets (< 100 players), fetch all at once for better client-side performance
  // This eliminates pagination delays and enables instant filtering/sorting
  const result = await getPlayers(0, 1000) // Fetch up to 1000 players

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
