'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEvent, deleteEvent, deleteEventSeries, type EventWithDetails } from '@/app/actions/events'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatDate, formatTime } from '@/lib/date'
import { useBreadcrumb } from '@/lib/breadcrumb-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AttendanceManager } from '@/components/calendar/attendance-manager'
import { EventFormDialog } from '@/components/calendar/event-form-dialog'
import { NotesList } from '@/components/notes/notes-list'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Users,
  Table,
  FileText,
  PenTool,
  ClipboardList,
  FolderOpen,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const eventTypeColors: Record<string, string> = {
  training: 'bg-primary/20 text-foreground border-primary',
  match: 'bg-chart-2/20 text-foreground border-chart-2',
  medical: 'bg-destructive/20 text-foreground border-destructive',
  meeting: 'bg-accent text-accent-foreground border-accent-foreground',
  other: 'bg-muted text-foreground border-border',
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const { preferences } = useUserPreferences()
  const { setCustomLabel } = useBreadcrumb()
  const t = useTranslations()

  const [event, setEvent] = useState<EventWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRecurringActionDialog, setShowRecurringActionDialog] = useState(false)
  const [recurringAction, setRecurringAction] = useState<'edit' | 'delete' | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()

  const loadEvent = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getEvent(eventId)
      if ('error' in result) {
        toast.error(result.error)
        router.push('/dashboard/calendar')
      } else {
        setEvent(result.event)
        // Set the event title in breadcrumb context
        setCustomLabel(eventId, result.event.title)
      }
    } catch (error) {
      toast.error(t('calendar.failedToLoadEvent'))
      router.push('/dashboard/calendar')
    } finally {
      setIsLoading(false)
    }
  }, [eventId, setCustomLabel, router, t])

  useEffect(() => {
    loadEvent()

    // Cleanup: remove custom label when component unmounts or eventId changes
    return () => {
      setCustomLabel(eventId, null)
    }
  }, [eventId, setCustomLabel, loadEvent])

  useEffect(() => {
    async function loadCurrentUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    loadCurrentUser()
  }, [])

  const handleEdit = () => {
    if (event?.isRecurring) {
      setRecurringAction('edit')
      setShowRecurringActionDialog(true)
    } else {
      setShowEditDialog(true)
    }
  }

  const handleDelete = () => {
    if (event?.isRecurring) {
      setRecurringAction('delete')
      setShowRecurringActionDialog(true)
    } else {
      setShowDeleteDialog(true)
    }
  }

  const handleRecurringThisOnly = () => {
    setShowRecurringActionDialog(false)
    if (recurringAction === 'edit') {
      setShowEditDialog(true)
    } else if (recurringAction === 'delete') {
      setShowDeleteDialog(true)
    }
  }

  const handleRecurringAllInstances = async () => {
    setShowRecurringActionDialog(false)
    if (!event) return

    if (recurringAction === 'delete') {
      try {
        const result = await deleteEventSeries(event.id)
        if ('error' in result) {
          toast.error(result.error)
        } else {
          toast.success(t('calendar.allEventInstancesDeleted'))
          router.push('/dashboard/calendar')
        }
      } catch (error) {
        toast.error(t('calendar.failedToDeleteEventSeries'))
      }
    }
  }

  const confirmDelete = async () => {
    if (!event) return

    try {
      const result = await deleteEvent(event.id)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success(t('calendar.eventDeleted'))
        router.push('/dashboard/calendar')
      }
    } catch (error) {
      toast.error(t('calendar.failedToDeleteEvent'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">{t('calendar.loadingEvent')}</div>
      </div>
    )
  }

  if (!event) {
    return null
  }

  const attendingCount = event.attendance?.filter(a => a.status === 'attending').length || 0
  const totalCount = event.attendance?.length || 0

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={eventTypeColors[event.type] || eventTypeColors.other}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {event.isRecurring && (
              <Badge variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                {t('calendar.recurringEvent')}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startTime, preferences || undefined)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(event.startTime, preferences || undefined)} - {formatTime(event.endTime, preferences || undefined)}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
            {totalCount > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('calendar.attendingCount', { attending: attendingCount, total: totalCount })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="me-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="me-2 h-4 w-4" />
            {t('common.delete')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="overview">
            {t('calendar.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Users className="me-2 h-4 w-4" />
            {t('calendar.tabs.attendance')}
          </TabsTrigger>
          <TabsTrigger value="spreadsheets">
            <Table className="me-2 h-4 w-4" />
            {t('calendar.tabs.spreadsheets')}
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="me-2 h-4 w-4" />
            {t('calendar.tabs.notes')}
          </TabsTrigger>
          <TabsTrigger value="drawings">
            <PenTool className="me-2 h-4 w-4" />
            {t('calendar.tabs.canvas')}
          </TabsTrigger>
          <TabsTrigger value="forms">
            <ClipboardList className="me-2 h-4 w-4" />
            {t('calendar.tabs.forms')}
          </TabsTrigger>
          <TabsTrigger value="files">
            <FolderOpen className="me-2 h-4 w-4" />
            {t('calendar.tabs.files')}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto py-6">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                {event.description && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">{t('calendar.descriptionLabel')}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}

                {!event.description && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">{t('calendar.noDescription')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('calendar.addDescriptionHint')}
                    </p>
                    <Button variant="outline" className="mt-4" onClick={handleEdit}>
                      <Edit className="me-2 h-4 w-4" />
                      {t('calendar.addDescription')}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <AttendanceManager
                eventId={event.id}
                attendees={event.attendance as any}
                onUpdate={loadEvent}
              />
            </TabsContent>

            <TabsContent value="spreadsheets" className="mt-0">
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

            <TabsContent value="notes" className="mt-0">
              <NotesList
                linkedEventId={eventId}
                currentUserId={currentUserId}
                showFilters={true}
                showCreateButton={true}
              />
            </TabsContent>

            <TabsContent value="drawings" className="mt-0">
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

            <TabsContent value="forms" className="mt-0">
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

            <TabsContent value="files" className="mt-0">
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
          </div>
        </Tabs>

      {/* Edit Dialog */}
      <EventFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          loadEvent()
          setShowEditDialog(false)
        }}
        defaultValues={
          event
            ? {
                id: event.id,
                title: event.title,
                description: event.description ?? undefined,
                type: event.type as 'training' | 'match' | 'medical' | 'meeting' | 'other',
                startTime: new Date(event.startTime),
                endTime: new Date(event.endTime),
                location: event.location ?? undefined,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('calendar.deleteEvent')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('calendar.deleteEventConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recurring Event Action Dialog */}
      <AlertDialog open={showRecurringActionDialog} onOpenChange={setShowRecurringActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {recurringAction === 'edit' ? t('calendar.editRecurringEvent') : t('calendar.deleteRecurringEvent')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('calendar.recurringEventActionPrompt', { action: recurringAction || 'edit' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
            <AlertDialogCancel onClick={() => setShowRecurringActionDialog(false)}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRecurringThisOnly}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              {t('calendar.thisEventOnly')}
            </AlertDialogAction>
            <AlertDialogAction onClick={handleRecurringAllInstances}>
              {t('calendar.allEventsInSeries')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
