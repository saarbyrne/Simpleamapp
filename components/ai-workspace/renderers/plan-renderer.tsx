'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle2, Circle, Clock, Target } from 'lucide-react'
import { format, parseISO, differenceInDays, isBefore, isAfter } from 'date-fns'

interface PlanRendererProps {
  workspace: any
}

export function PlanRenderer({ workspace }: PlanRendererProps) {
  const artifactData = workspace.artifactData
  const planConfig = artifactData?.planConfig

  if (!planConfig) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Plan Configuration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to generate a plan
          </p>
        </div>
      </div>
    )
  }

  const {
    title = 'Plan',
    timeHorizon = '3months',
    viewMode = 'timeline',
    milestones = [],
    associations,
  } = planConfig

  const now = new Date()

  const getMilestoneStatus = (milestone: any) => {
    if (milestone.status === 'completed') return 'completed'
    if (milestone.date) {
      const milestoneDate = parseISO(milestone.date)
      if (isBefore(milestoneDate, now)) return 'overdue'
      if (differenceInDays(milestoneDate, now) <= 7) return 'upcoming'
    }
    return 'pending'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'overdue':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'upcoming':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5" />
      case 'overdue':
        return <Clock className="h-5 w-5" />
      default:
        return <Circle className="h-5 w-5" />
    }
  }

  const renderTimeline = () => {
    if (milestones.length === 0) {
      return (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <Target className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No milestones defined yet</p>
          </div>
        </div>
      )
    }

    // Sort milestones by date
    const sortedMilestones = [...milestones].sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    return (
      <div className="relative space-y-4 pl-8">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-[15px] top-0 w-0.5 bg-border" />

        {sortedMilestones.map((milestone: any, index: number) => {
          const status = getMilestoneStatus(milestone)
          const statusColor = getStatusColor(status)

          return (
            <div key={milestone.id || index} className="relative">
              {/* Timeline dot */}
              <div className={`absolute -left-8 flex h-8 w-8 items-center justify-center rounded-full border-2 ${statusColor}`}>
                {getStatusIcon(status)}
              </div>

              {/* Milestone card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      {milestone.date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(parseISO(milestone.date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    <Badge variant={status === 'completed' ? 'default' : 'outline'}>
                      {status}
                    </Badge>
                  </div>
                </CardHeader>
                {milestone.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    {milestone.dependencies && milestone.dependencies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">Depends on:</span>
                        {milestone.dependencies.map((dep: string) => (
                          <Badge key={dep} variant="secondary" className="text-xs">
                            {sortedMilestones.find((m: any) => m.id === dep)?.title || dep}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAssociations = () => {
    if (!associations) return null

    const hasAssociations =
      (associations.players && associations.players.length > 0) ||
      (associations.events && associations.events.length > 0) ||
      (associations.teams && associations.teams.length > 0)

    if (!hasAssociations) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Associated With</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {associations.players && associations.players.length > 0 && (
              <div>
                <span className="text-sm font-medium">Players:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {associations.players.map((player: string) => (
                    <Badge key={player} variant="secondary">
                      {player}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {associations.events && associations.events.length > 0 && (
              <div>
                <span className="text-sm font-medium">Events:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {associations.events.map((event: string) => (
                    <Badge key={event} variant="secondary">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {associations.teams && associations.teams.length > 0 && (
              <div>
                <span className="text-sm font-medium">Teams:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {associations.teams.map((team: string) => (
                    <Badge key={team} variant="secondary">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <Badge variant="outline">{timeHorizon.replace(/([A-Z])/g, ' $1')}</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milestones.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {milestones.filter((m: any) => m.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {milestones.filter((m: any) => getMilestoneStatus(m) === 'upcoming').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Milestones and key dates</CardDescription>
        </CardHeader>
        <CardContent>{renderTimeline()}</CardContent>
      </Card>

      {/* Associations */}
      {renderAssociations()}

      {/* Integration Note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <div>
              <p className="font-medium">Calendar Integration</p>
              <p className="text-xs">
                Publish this plan to add milestones to your calendar and track progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
