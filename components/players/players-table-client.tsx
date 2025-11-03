"use client"

import { useRouter } from 'next/navigation'
import { PlayersTable, Player } from '@/components/players-table'

interface PlayersTableClientProps {
  data: Player[]
}

export function PlayersTableClient({ data }: PlayersTableClientProps) {
  const router = useRouter()

  const handlePlayerClick = (playerId: string) => {
    router.push(`/dashboard/players/${playerId}`)
  }

  return <PlayersTable data={data} onPlayerClick={handlePlayerClick} />
}
