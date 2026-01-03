'use client'

import { useEffect } from 'react'
import { useBreadcrumb } from '@/lib/breadcrumb-context'

interface PlayerProfileHeaderProps {
  playerId: string
  playerName: string
}

export function PlayerProfileHeader({ playerId, playerName }: PlayerProfileHeaderProps) {
  const { setCustomLabel } = useBreadcrumb()

  useEffect(() => {
    setCustomLabel(playerId, playerName)
  }, [playerId, playerName, setCustomLabel])

  return null // This component only manages breadcrumb state
}
