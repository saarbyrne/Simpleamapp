import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Player Profile</CardTitle>
          <CardDescription>
            Player ID: {params.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>Player profile component coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
