'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/components/ui/utils'
import { reorderMilestones, updateMilestone, deleteMilestone } from '@/app/actions/milestones'
import { CreateMilestoneDialog } from './create-milestone-dialog'
import { toast } from 'sonner'

type Milestone = {
  id: string
  title: string
  description?: string | null
  status: string
  progress: number
  startDate?: Date | null
  endDate?: Date | null
  dueDate?: Date | null
  order: number
  assignee?: {
    id: string
    name: string
    avatar?: string | null
  } | null
  links: { id: string; targetType: string; targetId: string }[]
  _count?: {
    links: number
    comments: number
  }
}

type MilestonesListProps = {
  planId: string
  milestones: Milestone[]
  enableReordering?: boolean
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Circle,
    variant: 'secondary' as const,
    color: 'text-gray-500',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    variant: 'default' as const,
    color: 'text-blue-500',
  },
  complete: {
    label: 'Complete',
    icon: CheckCircle2,
    variant: 'default' as const,
    color: 'text-green-500',
  },
  blocked: {
    label: 'Blocked',
    icon: AlertCircle,
    variant: 'destructive' as const,
    color: 'text-red-500',
  },
}

function SortableMilestone({
  milestone,
  planId,
  onEdit,
  onDelete,
}: {
  milestone: Milestone
  planId: string
  onEdit: () => void
  onDelete: () => void
}) {
  const router = useRouter()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const StatusIcon = statusConfig[milestone.status as keyof typeof statusConfig]?.icon || Circle

  const handleToggleComplete = async (checked: boolean | string) => {
    const newStatus = milestone.status === 'complete' ? 'pending' : 'complete'
    const result = await updateMilestone(milestone.id, { status: newStatus })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Milestone marked as ${newStatus}`)
      router.refresh()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('mb-3', isDragging && 'opacity-50')}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              className="cursor-grab touch-none p-1 hover:bg-muted rounded mt-1"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <Checkbox
              checked={milestone.status === 'complete'}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4
                    className={cn(
                      'font-medium text-sm',
                      milestone.status === 'complete' && 'line-through text-muted-foreground'
                    )}
                  >
                    {milestone.title}
                  </h4>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {milestone.description}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="me-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="me-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                <Badge variant={statusConfig[milestone.status as keyof typeof statusConfig]?.variant}>
                  <StatusIcon className="me-1 h-3 w-3" />
                  {statusConfig[milestone.status as keyof typeof statusConfig]?.label}
                </Badge>

                {milestone.dueDate && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                  </div>
                )}

                {milestone.assignee && (
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={milestone.assignee.avatar || undefined} />
                      <AvatarFallback className="text-[10px]">
                        {milestone.assignee.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground text-xs">
                      {milestone.assignee.name}
                    </span>
                  </div>
                )}

                {(milestone._count?.links || 0) > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    {milestone._count?.links} linked
                  </div>
                )}
              </div>

              {milestone.progress > 0 && milestone.status !== 'complete' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function MilestonesList({
  planId,
  milestones: initialMilestones,
  enableReordering = true,
}: MilestonesListProps) {
  const router = useRouter()
  const [milestones, setMilestones] = useState(initialMilestones)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = milestones.findIndex((m) => m.id === active.id)
    const newIndex = milestones.findIndex((m) => m.id === over.id)

    const newMilestones = arrayMove(milestones, oldIndex, newIndex)
    setMilestones(newMilestones)

    const result = await reorderMilestones(
      planId,
      newMilestones.map((m) => m.id)
    )

    if (result.error) {
      toast.error(result.error)
      setMilestones(initialMilestones)
    } else {
      toast.success('Milestones reordered')
      router.refresh()
    }
  }

  const handleDelete = async (milestone: Milestone) => {
    if (!confirm(`Are you sure you want to delete "${milestone.title}"?`)) {
      return
    }

    const result = await deleteMilestone(milestone.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Milestone deleted')
      router.refresh()
    }
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Circle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No milestones yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add milestones to track progress toward your plan goals
          </p>
          <CreateMilestoneDialog planId={planId} />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={milestones.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {milestones.map((milestone) => (
            <SortableMilestone
              key={milestone.id}
              milestone={milestone}
              planId={planId}
              onEdit={() => setEditingMilestone(milestone)}
              onDelete={() => handleDelete(milestone)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {editingMilestone && (
        <CreateMilestoneDialog
          planId={planId}
          milestone={editingMilestone}
          trigger={<div />}
          onSuccess={() => setEditingMilestone(null)}
        />
      )}
    </>
  )
}
