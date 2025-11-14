'use client'

import { useAuth } from '../auth/auth-provider'
import { AuthScreen } from '../auth/auth-screen'
import { CoachDashboard } from './coach-dashboard'
import { PlayerDashboard } from './player-dashboard'
import { GuestDashboard } from './guest-dashboard'
import { Skeleton } from '../ui/skeleton'

export function Dashboard() {
  const { user, loading, isCoach, isPlayer } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  if (isCoach) {
    return <CoachDashboard />
  }

  if (isPlayer) {
    return <PlayerDashboard />
  }

  return <GuestDashboard />
}