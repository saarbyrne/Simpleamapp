'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Users,
  FileText,
  Table,
  PenTool,
  ClipboardList,
  FolderOpen,
} from 'lucide-react'
import { format } from 'date-fns'
import { EventWithDetails } from '@/app/actions/events'
import { cn } from '@/lib/utils'

interface EventDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventWithDetails | null
  onEdit?: () => void
  onDelete?: () => void
}

const eventTypeConfig = {
  training: { label: 'Training', color: 'bg-blue-500' },
  match: { label: 'Match', color: 'bg-green-500' },
  medical: { label: 'Medical', color: 'bg-red-500' },
  meeting: { label: 'Meeting', color: 'bg-purple-500' },
  other: { label: 'Other', color: 'bg-gray-500' },
}

const attendanceStatusConfig = {
  invited: { label: 'Invited', color: 'bg-gray-500' },
  attending: { label: 'Attending', color: 'bg-green-500' },
  absent: { label: 'Absent', color: 'bg-red-500' },
  excused: { label: 'Excused', color: 'bg-yellow-500' },
}

export function EventDetailDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
}: EventDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!event) return null

  const typeConfig = eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig.other

  const attendanceSummary = {
    total: event.attendance.length,
    attending: event.attendance.filter(a => a.status === 'attending').length,
    absent: event.attendance.filter(a => a.status === 'absent').length,
    invited: event.attendance.filter(a => a.status === 'invited').length,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={cn('text-white', typeConfig.color)}>
                  {typeConfig.label}
                </Badge>
                {event.isRecurring && (
                  <Badge variant="outline">Recurring</Badge>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="spreadsheets">
              <Table className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="drawings">
              <PenTool className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Drawings</span>
            </TabsTrigger>
            <TabsTrigger value="forms">
              <ClipboardList className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Forms</span>
            </TabsTrigger>
            <TabsTrigger value="files">
              <FolderOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Event Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(event.startTime), 'HH:mm')} -{' '}
                  {format(new Date(event.endTime), 'HH:mm')}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Attendance Summary */}
            <div>
              <h3 className="mb-3 font-semibold">Attendance Summary</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold">{attendanceSummary.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold text-green-600">{attendanceSummary.attending}</div>
                  <div className="text-xs text-muted-foreground">Attending</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold text-gray-600">{attendanceSummary.invited}</div>
                  <div className="text-xs text-muted-foreground">Invited</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spreadsheets" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Table className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Spreadsheets</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Track performance data, stats, and metrics for this event
              </p>
              <Button variant="outline" disabled>
                Add Spreadsheet
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (Integration coming in Phase 4)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Notes</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Add coach observations, medical notes, and other documentation
              </p>
              <Button variant="outline" disabled>
                Create Note
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (Integration coming in Phase 4)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="drawings" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PenTool className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Drawings</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create formations, tactics, and session plans
              </p>
              <Button variant="outline" disabled>
                Create Drawing
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (Integration coming in Phase 4)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Forms</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Distribute wellness checks, post-event surveys, and assessments
              </p>
              <Button variant="outline" disabled>
                Link Form
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (Integration coming in Phase 4)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Files</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Upload scouting reports, videos, and other documents
              </p>
              <Button variant="outline" disabled>
                Upload File
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (Integration coming in Phase 4)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Attendees ({event.attendance.length})</h3>
                <Button variant="outline" size="sm" disabled>
                  Update Attendance
                </Button>
              </div>

              {event.attendance.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No attendees have been added to this event yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {event.attendance.map((attendance) => {
                    const statusConfig = attendanceStatusConfig[attendance.status as keyof typeof attendanceStatusConfig] || attendanceStatusConfig.invited
                    const person = attendance.personOrg.person

                    return (
                      <div
                        key={attendance.id}
                        className="flex items-center justify-between rounded-lg border p-3"
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
                              {attendance.personOrg.position && (
                                <>
                                  {attendance.personOrg.position}
                                  {attendance.personOrg.jerseyNumber && ` • #${attendance.personOrg.jerseyNumber}`}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn('text-white', statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}

              {event.attendance.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  (Attendance management coming in Phase 3)
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
