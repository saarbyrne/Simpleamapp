'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useAuth } from '../auth/auth-provider'
import { LogOut, Eye, SquarePlay, Users } from 'lucide-react'

export function GuestDashboard() {
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
            <span className="text-muted-foreground">Guest Access</span>
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">View Tactical Boards</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Browse shared tactical boards and formations
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Content</CardTitle>
              <SquarePlay className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Access public training materials and resources
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Limited Access</CardTitle>
            <CardDescription>
              You're viewing LuvFutbol as a guest. For full access, contact your coach or sign up as a coach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Guest features coming soon
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}