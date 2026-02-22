'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
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
import { formatDate, formatTime } from '@/lib/date'

interface EventDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventWithDetails | null
  onEdit?: () => void
  onDelete?: () => void
  onUpdate?: () => void
}

const eventTypeConfig = {
  training: { labelKey: 'calendar.types.training', color: 'bg-primary/20 text-foreground border border-primary' },
  match: { labelKey: 'calendar.types.match', color: 'bg-chart-2/20 text-foreground border border-chart-2' },
  medical: { labelKey: 'calendar.types.medical', color: 'bg-destructive/20 text-foreground border border-destructive' },
  meeting: { labelKey: 'calendar.types.meeting', color: 'bg-accent text-accent-foreground border border-accent-foreground' },
  other: { labelKey: 'calendar.types.other', color: 'bg-muted text-foreground border border-border' },
}

const attendanceStatusConfig = {
  invited: { labelKey: 'calendar.attendance.invited', color: 'bg-muted text-foreground border border-border' },
  attending: { labelKey: 'calendar.attendance.attending', color: 'bg-chart-2/20 text-foreground border border-chart-2' },
  absent: { labelKey: 'calendar.attendance.absent', color: 'bg-destructive/20 text-foreground border border-destructive' },
  excused: { labelKey: 'calendar.attendance.excused', color: 'bg-chart-3/20 text-foreground border border-chart-3' },
}

export function EventDetailDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
  onUpdate,
}: EventDetailDialogProps) {
  const t = useTranslations()
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
                  {t(typeConfig.labelKey)}
                </Badge>
                {event.isRecurring && (
                  <Badge variant="outline">{t('calendar.recurring')}</Badge>
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
              <span className="hidden sm:inline">{t('calendar.tabs.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="spreadsheets">
              <Table className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('calendar.tabs.data')}</span>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('calendar.tabs.notes')}</span>
            </TabsTrigger>
            <TabsTrigger value="drawings">
              <PenTool className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('calendar.tabs.canvas')}</span>
            </TabsTrigger>
            <TabsTrigger value="forms">
              <ClipboardList className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('calendar.tabs.forms')}</span>
            </TabsTrigger>
            <TabsTrigger value="files">
              <FolderOpen className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('calendar.tabs.files')}</span>
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Users className="me-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('calendar.tabs.attendance')}</span>
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
                  <h3 className="mb-2 font-semibold">{t('calendar.descriptionLabel')}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Attendance Summary */}
            <div>
              <h3 className="mb-3 font-semibold">{t('calendar.attendanceSummary')}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold">{attendanceSummary.total}</div>
                  <div className="text-xs text-muted-foreground">{t('calendar.attendance.total')}</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold text-emerald-600">{attendanceSummary.attending}</div>
                  <div className="text-xs text-muted-foreground">{t('calendar.attendance.attending')}</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold text-destructive">{attendanceSummary.absent}</div>
                  <div className="text-xs text-muted-foreground">{t('calendar.attendance.absent')}</div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-2xl font-bold text-muted-foreground">{attendanceSummary.invited}</div>
                  <div className="text-xs text-muted-foreground">{t('calendar.attendance.invited')}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spreadsheets" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Table className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('calendar.tabs.eventSpreadsheets')}</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                {t('calendar.tabs.spreadsheetsDescription')}
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">{t('calendar.integrationReady')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('calendar.completeSpreadsheetsModule')}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('calendar.tabs.eventNotes')}</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                {t('calendar.tabs.notesDescription')}
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">{t('calendar.integrationReady')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('calendar.completeNotesModule')}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drawings" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PenTool className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('calendar.tabs.eventCanvas')}</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                {t('calendar.tabs.canvasDescription')}
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">{t('calendar.integrationReady')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('calendar.completeCanvasModule')}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('calendar.tabs.eventForms')}</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                {t('calendar.tabs.formsDescription')}
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">{t('calendar.integrationReady')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('calendar.formsModuleExists')}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('calendar.tabs.eventFiles')}</h3>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                {t('calendar.tabs.filesDescription')}
              </p>
              <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-6">
                <p className="text-sm font-medium">{t('calendar.integrationReady')}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('calendar.completeFilesModule')}
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
