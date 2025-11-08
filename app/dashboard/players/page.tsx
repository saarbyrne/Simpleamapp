import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlayersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
          <CardDescription>
            Manage your team roster and player information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>Player table component coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
