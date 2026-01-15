import { differenceInYears } from 'date-fns'
import { getPlayer } from '@/app/actions/players'
import { getCurrentUserProfile } from '@/app/actions/profile'
import { formatDate } from '@/lib/date'
import { getPlayerStatusColor } from '@/design-system/tokens/status-colors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageCard } from '@/components/ui/page-card'
import { NotesList } from '@/components/notes/notes-list'
import { createServerClient } from '@/lib/supabase/server'
import { Mail, Phone, Edit } from 'lucide-react'
import { PlayerProfileHeader } from '@/components/dashboard/player-profile-header'
import { PlayerProfileTabs } from '@/components/dashboard/player-profile-tabs'

const statusLabel = (value: string) => {
  const normalized = value?.toLowerCase()
  if (normalized === 'active' || normalized === 'available') {
    return 'Available'
  }
  if (normalized === 'injured') {
    return 'Injured'
  }
  if (normalized === 'suspended') {
    return 'Suspended'
  }
  if (normalized === 'inactive') {
    return 'Inactive'
  }
  return normalized ? normalized.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : 'Unknown'
}

const titleCase = (value: string | null | undefined) => {
  if (!value) {
    return ''
  }
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  // Fetch player data, current user, and preferences in parallel
  const supabase = await createServerClient()
  const [result, { data: { user } }, profileResult] = await Promise.all([
    getPlayer(params.id),
    supabase.auth.getUser(),
    getCurrentUserProfile(),
  ])

  // Extract preferences from profile result
  const preferences = profileResult.success && profileResult.data ? {
    timezone: profileResult.data.timezone,
    dateFormat: profileResult.data.dateFormat,
    timeFormat: profileResult.data.timeFormat,
    language: profileResult.data.language,
  } : null

  // Redirect if player not found
  if (!result.success || !result.player) {
    // In server components, we use redirect from next/navigation
    const { redirect } = await import('next/navigation')
    redirect('/dashboard/players')
  }

  // TypeScript guard: player is guaranteed to exist here
  const player = result.player!
  const currentUser = user ? { id: user.id } : null

  const organization = player.organizations?.[0]
  const status = organization?.status ?? 'active'
  const normalizedStatus = status.toLowerCase()
  const statusColorClass = getPlayerStatusColor(status)

  // Calculate age server-side once
  const age = player.dateOfBirth
    ? differenceInYears(new Date(), new Date(player.dateOfBirth))
    : null

  const playerName = `${player.firstName} ${player.lastName}`

  return (
    <>
      {/* Client component for breadcrumb state management */}
      <PlayerProfileHeader playerId={params.id} playerName={playerName} />
    <PageCard
      variant="table"
      title={
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {player.photo ? (
              <AvatarImage src={player.photo} alt={playerName} />
            ) : (
              <AvatarFallback className="text-xl">
                {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">{playerName}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              {organization?.jerseyNumber && (
                <span>#{organization.jerseyNumber}</span>
              )}
              {organization?.position && (
                <>
                  {organization.jerseyNumber && <span>·</span>}
                  <span>{titleCase(organization.position)}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColorClass}>
                {statusLabel(normalizedStatus)}
              </Badge>
              {organization?.tags && organization.tags.length > 0 && (
                <>
                  {organization.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {titleCase(tag)}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      }
      headerActions={
        <Button variant="outline">
          <Edit className="me-2 h-4 w-4" />
          Edit Profile
        </Button>
      }
    >
      {/* Tabs */}
      <PlayerProfileTabs
        overviewTab={
          <>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {player.dateOfBirth && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p className="text-sm">
                      {formatDate(player.dateOfBirth, preferences || undefined)}
                    </p>
                  </div>
                )}
                {age !== null && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="text-sm">{age} years old</p>
                  </div>
                )}
                {player.nationality && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                    <p className="text-sm">{titleCase(player.nationality)}</p>
                  </div>
                )}
                {player.email && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${player.email}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {player.email}
                    </a>
                  </div>
                )}
                {player.phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${player.phone}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {player.phone}
                    </a>
                  </div>
                )}
                {organization?.joinedAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Joined</p>
                    <p className="text-sm">
                      {formatDate(organization.joinedAt, preferences || undefined)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent activity and updates for this player</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            </CardContent>
          </Card>
          </>
        }
        formsTab={
          <Card>
            <CardHeader>
              <CardTitle>Form Responses</CardTitle>
              <CardDescription>View all form responses submitted by this player</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No form responses yet</p>
              </div>
            </CardContent>
          </Card>
        }
        eventsTab={
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>View all events this player has attended</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No events yet</p>
              </div>
            </CardContent>
          </Card>
        }
        performanceTab={
          <Card>
            <CardHeader>
              <CardTitle>Performance Data</CardTitle>
              <CardDescription>View performance metrics and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No performance data available</p>
              </div>
            </CardContent>
          </Card>
        }
        notesTab={
          <NotesList
            linkedPersonId={params.id}
            currentUserId={currentUser?.id}
            showFilters={true}
            showCreateButton={true}
          />
        }
        filesTab={
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>View all files attached to this player</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No files uploaded</p>
              </div>
            </CardContent>
          </Card>
        }
        spreadsheetsTab={
          <Card>
            <CardHeader>
              <CardTitle>Spreadsheets</CardTitle>
              <CardDescription>View spreadsheets containing data for this player</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No spreadsheets linked</p>
              </div>
            </CardContent>
          </Card>
        }
      />
    </PageCard>
    </>
  )
}
