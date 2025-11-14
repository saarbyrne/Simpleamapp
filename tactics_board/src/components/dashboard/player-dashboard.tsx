'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useAuth } from '../auth/auth-provider'
import { LogOut, User, Calendar, SquarePlay } from 'lucide-react'

export function PlayerDashboard() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold text-xl">LuvFutbol</h1>
            <span className="text-muted-foreground">Player Dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                View your player profile and statistics
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tactical Boards</CardTitle>
              <SquarePlay className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                View tactical boards shared by your coach
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Fixtures</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No upcoming fixtures scheduled
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Player Dashboard</CardTitle>
            <CardDescription>
              Access training materials and team information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Player features coming soon
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}