'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Calendar,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  Circle,
  AlertCircle,
  Pause,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { deletePlan } from '@/app/actions/plans'
import { toast } from 'sonner'

type PlanRow = {
  id: string
  name: string
  description?: string | null
  type: string
  status: string
  startDate: Date
  endDate: Date
  owner: {
    id: string
    name: string
    avatar?: string | null
  }
  milestones: { id: string; status: string }[]
  _count: {
    milestones: number
  }
  isPublic: boolean
  isTemplate: boolean
}

type PlansTableProps = {
  plans: PlanRow[]
  total: number
}

const statusConfig = {
  not_started: {
    label: 'Not Started',
    icon: Circle,
    variant: 'secondary' as const,
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    variant: 'default' as const,
  },
  complete: {
    label: 'Complete',
    icon: CheckCircle2,
    variant: 'default' as const,
  },
  on_hold: {
    label: 'On Hold',
    icon: Pause,
    variant: 'outline' as const,
  },
}

const typeConfig: Record<string, { label: string; color: string }> = {
  season: { label: 'Season Plan', color: 'bg-blue-100 text-blue-800' },
  player_development: { label: 'Player Development', color: 'bg-green-100 text-green-800' },
  rehabilitation: { label: 'Rehabilitation', color: 'bg-red-100 text-red-800' },
  event_prep: { label: 'Event Preparation', color: 'bg-purple-100 text-purple-800' },
  custom: { label: 'Custom', color: 'bg-gray-100 text-gray-800' },
}

export function PlansTable({ plans, total }: PlansTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      const result = await deletePlan(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Plan deleted successfully')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to delete plan')
    } finally {
      setDeletingId(null)
    }
  }

  const calculateProgress = (milestones: { id: string; status: string }[]) => {
    if (milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.status === 'complete').length
    return Math.round((completed / milestones.length) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="h-8 w-8" />
                    <p>No plans found</p>
                    <p className="text-sm">Create your first plan to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => {
                const StatusIcon = statusConfig[plan.status as keyof typeof statusConfig]?.icon || Circle
                const progress = calculateProgress(plan.milestones)

                return (
                  <TableRow
                    key={plan.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/planner/${plan.id}`)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{plan.name}</div>
                          {plan.isTemplate && (
                            <Badge variant="outline" className="text-xs">
                              Template
                            </Badge>
                          )}
                        </div>
                        {plan.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {plan.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={typeConfig[plan.type]?.color || 'bg-gray-100'}
                      >
                        {typeConfig[plan.type]?.label || plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={plan.owner.avatar || undefined} />
                          <AvatarFallback>
                            {plan.owner.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{plan.owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(plan.startDate), 'MMM d, yyyy')}</div>
                        <div className="text-muted-foreground">
                          {format(new Date(plan.endDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {plan.milestones.filter((m) => m.status === 'complete').length}/
                            {plan._count.milestones} milestones
                          </span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[plan.status as keyof typeof statusConfig]?.variant}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[plan.status as keyof typeof statusConfig]?.label || plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/planner/${plan.id}`)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/planner/${plan.id}/edit`)
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(plan.id, plan.name)
                            }}
                            disabled={deletingId === plan.id}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
          <div>
            Showing {plans.length} of {total} plans
          </div>
        </div>
      )}
    </div>
  )
}
