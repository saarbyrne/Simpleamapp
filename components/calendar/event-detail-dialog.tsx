'use client'

import { useState, useMemo } from 'react'
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
import { EventWithDetails } from '@/app/actions/events'
import { cn } from '@/lib/utils'
import { AttendanceManager } from './attendance-manager'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate, formatTime } from '@/lib/date-utils'

interface EventDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventWithDetails | null
  onEdit?: () => void
  onDelete?: () => void
  onUpdate?: () => void
}

const eventTypeConfig = {
  training: { label: 'Training', color: 'bg-primary/20 text-foreground border border-primary' },
  match: { label: 'Match', color: 'bg-chart-2/20 text-foreground border border-chart-2' },
  medical: { label: 'Medical', color: 'bg-destructive/20 text-foreground border border-destructive' },
  meeting: { label: 'Meeting', color: 'bg-accent text-accent-foreground border border-accent-foreground' },
  other: { label: 'Other', color: 'bg-muted text-foreground border border-border' },
}

const attendanceStatusConfig = {
  invited: { label: 'Invited', color: 'bg-muted text-foreground border border-border' },
  attending: { label: 'Attending', color: 'bg-chart-2/20 text-foreground border border-chart-2' },
  absent: { label: 'Absent', color: 'bg-destructive/20 text-foreground border border-destructive' },
  excused: { label: 'Excused', color: 'bg-chart-3/20 text-foreground border border-chart-3' },
}

export function EventDetailDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
  onUpdate,
}: EventDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { preferences } = useUserPreferences()

  const typeConfig = useMemo(() => {
    if (!event) return eventTypeConfig.other
    return eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig.other
  }, [event])

  const attendanceSummary = useMemo(() => {
    if (!event) return { total: 0, attending: 0, absent: 0, invited: 0 }
    return {
      total: event.attendance.length,
      attending: event.attendance.filter(a => a.status === 'attending').length,
      absent: event.attendance.filter(a => a.status === 'absent').length,
      invited: event.attendance.filter(a => a.status === 'invited').length,
    }
  }, [event])

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={cn('text-white', typeConfig.color)}>
                  {typeConfig.label}
                </Badge>
                {event.isRecurring && (
                  <Badge variant="outline">Recurring</Badge>
                )}
              </div>
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
              <Calendar className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="spreadsheets">
              <Table className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="drawings">
              <PenTool className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Canvas</span>
            </TabsTrigger>
            <TabsTrigger value="forms">
              <ClipboardList className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Forms</span>
            </TabsTrigger>
            <TabsTrigger value="files">
              <FolderOpen className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Users className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Event Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatDate(event.startTime, preferences || undefined)}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formatTime(event.startTime, preferences || undefined)} -{' '}
                  {formatTime(event.endTime, preferences || undefined)}
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
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Link spreadsheet modules to track performance data, stats, and metrics for this event.
                Data will sync automatically when spreadsheets are created.
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">Integration Ready</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete the Spreadsheets module to enable this feature
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Notes</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Link note modules for coach observations, medical notes, and other documentation.
                Notes will appear here when the Notes module is implemented.
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">Integration Ready</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete the Notes module to enable this feature
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drawings" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PenTool className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Canvas</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Link canvas modules for formations, tactics, and session plans.
                Canvas content will appear here when the Canvas module is implemented.
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">Integration Ready</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete the Canvas module to enable this feature
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Forms</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Link form modules to distribute wellness checks, post-event surveys, and assessments.
                Forms linked to this event will appear here automatically.
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">Integration Ready</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The Forms module exists - integration can be enabled when needed
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Event Files</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Link file modules for scouting reports, videos, and other documents.
                Files will appear here when the Files module is implemented.
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">Integration Ready</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete the Files module to enable this feature
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <AttendanceManager
              eventId={event.id}
              attendees={event.attendance as any}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
