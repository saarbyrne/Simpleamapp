'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  Calendar,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  Circle,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { DataTable } from '@/components/data-table'
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
  season: { label: 'Season Plan', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  player_development: { label: 'Player Development', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  rehabilitation: { label: 'Rehabilitation', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  event_prep: { label: 'Event Preparation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  custom: { label: 'Custom', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
}

const calculateProgress = (milestones: { id: string; status: string }[]) => {
  if (milestones.length === 0) return 0
  const completed = milestones.filter((m) => m.status === 'complete').length
  return Math.round((completed / milestones.length) * 100)
}

export function PlansTable({ plans, total }: PlansTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

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

  const columns = useMemo<ColumnDef<PlanRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Plan',
        size: 280,
        cell: ({ row }) => {
          const plan = row.original
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/planner/${plan.id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline"
                  prefetch={false}
                  onClick={(e) => e.stopPropagation()}
                >
                  {plan.name}
                </Link>
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
          )
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableHiding: true,
        cell: ({ getValue }) => {
          const type = getValue() as string
          return (
            <Badge
              variant="secondary"
              className={typeConfig[type]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}
            >
              {typeConfig[type]?.label || type}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        enableHiding: true,
        cell: ({ getValue }) => {
          const owner = getValue() as PlanRow['owner']
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={owner.avatar || undefined} />
                <AvatarFallback>
                  {owner.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{owner.name}</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Timeline',
        enableHiding: true,
        cell: ({ row }) => {
          const plan = row.original
          return (
            <div className="text-sm">
              <div>{format(new Date(plan.startDate), 'MMM d, yyyy')}</div>
              <div className="text-muted-foreground">
                {format(new Date(plan.endDate), 'MMM d, yyyy')}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'milestones',
        header: 'Progress',
        enableHiding: true,
        enableSorting: false,
        cell: ({ row }) => {
          const plan = row.original
          const progress = calculateProgress(plan.milestones)
          return (
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
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableHiding: true,
        cell: ({ getValue }) => {
          const status = getValue() as string
          const StatusIcon = statusConfig[status as keyof typeof statusConfig]?.icon || Circle
          return (
            <Badge variant={statusConfig[status as keyof typeof statusConfig]?.variant}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig[status as keyof typeof statusConfig]?.label || status}
            </Badge>
          )
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const plan = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
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
            </div>
          )
        },
      },
    ],
    [router, deletingId]
  )

  return (
    <DataTable
      data={plans}
      columns={columns}
      sorting={sorting}
      onSortingChange={setSorting}
      enableColumnResizing={true}
      enableColumnVisibility={true}
      enableColumnReordering={false}
      enableRowSelection={false}
      enableGrouping={false}
      enableBulkActions={false}
      enableExport={false}
      emptyMessage={
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-12">
          <Calendar className="h-8 w-8" />
          <p>No plans found</p>
          <p className="text-sm">Create your first plan to get started</p>
        </div>
      }
    />
  )
}
