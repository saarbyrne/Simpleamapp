'use client'

import { useState, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Check, X, Clock, UserX, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateAttendance } from '@/app/actions/events'
import { toast } from 'sonner'

interface Attendee {
  id: string
  status: string
  notes: string | null
  personOrg: {
    id: string
    person: {
      id: string
      firstName: string
      lastName: string
      photo: string | null
    }
    role: string
    position: string | null
    jerseyNumber: number | null
  }
}

interface AttendanceManagerProps {
  eventId: string
  attendees: Attendee[]
  onUpdate?: () => void
}

const statusConfig = {
  invited: {
    label: 'Invited',
    color: 'bg-muted',
    icon: Clock,
    textColor: 'text-foreground'
  },
  attending: {
    label: 'Attending',
    color: 'bg-chart-2/20 border border-chart-2',
    icon: Check,
    textColor: 'text-foreground'
  },
  absent: {
    label: 'Absent',
    color: 'bg-destructive/20 border border-destructive',
    icon: X,
    textColor: 'text-foreground'
  },
  excused: {
    label: 'Excused',
    color: 'bg-chart-3/20 border border-chart-3',
    icon: UserX,
    textColor: 'text-foreground'
  }
}

export function AttendanceManager({
  eventId,
  attendees,
  onUpdate
}: AttendanceManagerProps) {
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEditClick = (attendee: Attendee) => {
    setEditingAttendee(attendee)
    setNewStatus(attendee.status)
    setNotes(attendee.notes || '')
  }

  const handleSave = async () => {
    if (!editingAttendee) return

    setIsUpdating(true)
    try {
      const result = await updateAttendance(
        eventId,
        editingAttendee.personOrg.id,
        newStatus as any,
        notes || undefined
      )

      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success('Attendance updated')
        setEditingAttendee(null)
        onUpdate?.()
      }
    } catch (error) {
      toast.error('Failed to update attendance')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const summary = useMemo(() => ({
    total: attendees.length,
    attending: attendees.filter(a => a.status === 'attending').length,
    absent: attendees.filter(a => a.status === 'absent').length,
    excused: attendees.filter(a => a.status === 'excused').length,
    invited: attendees.filter(a => a.status === 'invited').length,
  }), [attendees])

  if (attendees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">No Attendees</p>
        <p className="text-xs text-muted-foreground">
          Add attendees when creating or editing the event
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-2xl font-bold">{summary.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="rounded-lg border border-chart-2 bg-chart-2/20 p-3">
          <div className="text-2xl font-bold text-foreground">
            {summary.attending}
          </div>
          <div className="text-xs text-foreground/70">Attending</div>
        </div>
        <div className="rounded-lg border border-destructive bg-destructive/20 p-3">
          <div className="text-2xl font-bold text-foreground">
            {summary.absent}
          </div>
          <div className="text-xs text-foreground/70">Absent</div>
        </div>
        <div className="rounded-lg border bg-muted p-3">
          <div className="text-2xl font-bold text-foreground">
            {summary.invited}
          </div>
          <div className="text-xs text-foreground/70">Pending</div>
        </div>
      </div>

      {/* Attendee List */}
      <div className="space-y-2">
        {attendees.map((attendee) => {
          const person = attendee.personOrg.person
          const config = statusConfig[attendee.status as keyof typeof statusConfig] || statusConfig.invited
          const StatusIcon = config.icon

          return (
            <div
              key={attendee.id}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={person.photo || undefined} />
                  <AvatarFallback>
                    {person.firstName[0]}
                    {person.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {person.firstName} {person.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {attendee.personOrg.position && (
                      <>
                        {attendee.personOrg.position}
                        {attendee.personOrg.jerseyNumber && ` • #${attendee.personOrg.jerseyNumber}`}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <StatusIcon className={cn('h-4 w-4', config.textColor)} />
                  <span className={cn('text-sm font-medium', config.textColor)}>
                    {config.label}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(attendee)}
                >
                  Edit
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAttendee} onOpenChange={(open) => !open && setEditingAttendee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Attendance</DialogTitle>
            <DialogDescription>
              {editingAttendee && (
                <>
                  Update status for {editingAttendee.personOrg.person.firstName}{' '}
                  {editingAttendee.personOrg.person.lastName}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="attending">Attending</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this attendance..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingAttendee(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
