'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { differenceInYears } from 'date-fns'
import { getPlayer } from '@/app/actions/players'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate } from '@/lib/date-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageCard } from '@/components/ui/page-card'
import { useBreadcrumb } from '@/lib/breadcrumb-context'
import { 
  FileText, 
  Calendar, 
  BarChart3, 
  StickyNote, 
  FolderOpen, 
  Table,
  Mail,
  Phone,
  Edit,
} from 'lucide-react'

const statusColors: Record<string, string> = {
  active: 'bg-green-600 text-white hover:bg-green-700',
  available: 'bg-green-600 text-white hover:bg-green-700',
  injured: 'bg-destructive text-white hover:bg-destructive/90',
  suspended: 'bg-muted text-muted-foreground hover:bg-muted/80',
  inactive: 'bg-muted text-muted-foreground hover:bg-muted/80',
}

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

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { setCustomLabel } = useBreadcrumb()
  const { preferences } = useUserPreferences()
  const [player, setPlayer] = React.useState<Awaited<ReturnType<typeof getPlayer>>['player'] | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadPlayer() {
      const result = await getPlayer(params.id)
      if (!result.success || !result.player) {
        router.push('/dashboard/players')
        return
      }
      setPlayer(result.player)
      const playerName = `${result.player.firstName} ${result.player.lastName}`
      setCustomLabel(params.id, playerName)
      setIsLoading(false)
    }
    loadPlayer()
  }, [params.id, setCustomLabel, router])

  if (isLoading || !player) {
    return null // Will show loading.tsx
  }

  const organization = player.organizations?.[0]
  const status = organization?.status ?? 'active'
  const normalizedStatus = status.toLowerCase()
  const statusColorClass = statusColors[normalizedStatus] ?? 'bg-muted text-muted-foreground'
  
  const age = player.dateOfBirth
    ? differenceInYears(new Date(), new Date(player.dateOfBirth))
    : null

  const playerName = `${player.firstName} ${player.lastName}`

  return (
    <PageCard
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
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="forms">
            <FileText className="me-2 h-4 w-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="me-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="me-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="me-2 h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="files">
            <FolderOpen className="me-2 h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="spreadsheets">
            <Table className="me-2 h-4 w-4" />
            Spreadsheets
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
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
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="mt-6">
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
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-6">
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
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6">
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
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>View all notes related to this player</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No notes yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
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
        </TabsContent>

        {/* Spreadsheets Tab */}
        <TabsContent value="spreadsheets" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </PageCard>
  )
}
