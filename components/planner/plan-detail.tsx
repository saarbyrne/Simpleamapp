'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
  Share2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowLeft,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageFrame } from '@/components/dashboard/page-frame'
import { MilestonesList } from './milestones-list'
import { CreateMilestoneDialog } from './create-milestone-dialog'
import { PlanTimeline } from './plan-timeline'
import { deletePlan, publishPlan, unpublishPlan } from '@/app/actions/plans'
import { toast } from 'sonner'

type PlanDetailProps = {
  plan: {
    id: string
    name: string
    description?: string | null
    type: string
    status: string
    startDate: Date
    endDate: Date
    isPublic: boolean
    isTemplate: boolean
    publishedAt?: Date | null
    owner: {
      id: string
      name: string
      avatar?: string | null
      email: string
    }
    milestones: any[]
  }
}

const statusConfig = {
  not_started: { label: 'Not Started', variant: 'secondary' as const },
  in_progress: { label: 'In Progress', variant: 'default' as const },
  complete: { label: 'Complete', variant: 'success' as const },
  on_hold: { label: 'On Hold', variant: 'warning' as const },
}

const typeConfig: Record<string, string> = {
  season: 'Season Plan',
  player_development: 'Player Development',
  rehabilitation: 'Rehabilitation',
  event_prep: 'Event Preparation',
  custom: 'Custom',
}

export function PlanDetail({ plan }: PlanDetailProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${plan.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deletePlan(plan.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Plan deleted successfully')
        router.push('/dashboard/planner')
      }
    } catch (error) {
      toast.error('Failed to delete plan')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePublish = async () => {
    setIsPublishing(true)
    try {
      const result = plan.isPublic
        ? await unpublishPlan(plan.id)
        : await publishPlan(plan.id)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(plan.isPublic ? 'Plan unpublished' : 'Plan published')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to update plan')
    } finally {
      setIsPublishing(false)
    }
  }

  const completedMilestones = plan.milestones.filter((m) => m.status === 'complete').length
  const totalMilestones = plan.milestones.length
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  return (
    <PageFrame>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => router.push('/dashboard/planner')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">{plan.name}</h1>
              {plan.description && (
                <p className="text-muted-foreground">{plan.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge variant={statusConfig[plan.status as keyof typeof statusConfig]?.variant}>
                  {statusConfig[plan.status as keyof typeof statusConfig]?.label}
                </Badge>
                <Badge variant="outline">{typeConfig[plan.type]}</Badge>
                {plan.isTemplate && <Badge variant="outline">Template</Badge>}
                {plan.isPublic && <Badge variant="default">Published</Badge>}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/planner/${plan.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Plan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTogglePublish} disabled={isPublishing}>
              {plan.isPublic ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="my-6" />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="text-xs text-muted-foreground">
              {completedMilestones} of {totalMilestones} milestones
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {format(new Date(plan.startDate), 'MMM d, yyyy')}
            </div>
            <div className="text-xs text-muted-foreground">
              to {format(new Date(plan.endDate), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owner</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={plan.owner.avatar || undefined} />
                <AvatarFallback>
                  {plan.owner.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{plan.owner.name}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {statusConfig[plan.status as keyof typeof statusConfig]?.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {plan.isPublic ? 'Published' : 'Draft'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="milestones" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <CreateMilestoneDialog
            planId={plan.id}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            }
          />
        </div>

        <TabsContent value="milestones" className="space-y-4">
          <MilestonesList planId={plan.id} milestones={plan.milestones} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <PlanTimeline
            startDate={new Date(plan.startDate)}
            endDate={new Date(plan.endDate)}
            milestones={plan.milestones}
          />
        </TabsContent>
      </Tabs>
    </PageFrame>
  )
}
