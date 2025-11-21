'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { RRule, Frequency } from 'rrule'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, RefreshCw } from 'lucide-react'
import { format, addMinutes } from 'date-fns'
import { cn } from '@/lib/utils'
import { createEvent, updateEvent, type CreateEventData } from '@/app/actions/events'
import { getEventTemplates } from '@/app/actions/event-templates'
import { toast } from 'sonner'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { dateToTimeInput } from '@/lib/date'

// Schema will be created inside component to access translations
type EventFormValues = {
  title: string
  description?: string
  type: 'training' | 'match' | 'medical' | 'meeting' | 'other'
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  location?: string
  isRecurring: boolean
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly'
  recurrenceInterval?: number
  recurrenceEndType?: 'never' | 'until' | 'count'
  recurrenceEndDate?: Date
  recurrenceCount?: number
  recurrenceDaysOfWeek?: number[]
}

interface EventTemplate {
  id: string
  name: string
  description: string | null
  type: string
  defaultDuration: number
  isGlobal: boolean
}

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  defaultValues?: {
    id?: string
    title?: string
    description?: string
    type?: 'training' | 'match' | 'medical' | 'meeting' | 'other'
    startTime?: Date
    endTime?: Date
    location?: string
    templateId?: string
  }
}

export function EventFormDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultValues,
}: EventFormDialogProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [templates, setTemplates] = useState<EventTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const isEditing = !!defaultValues?.id
  const { preferences } = useUserPreferences()

  // Create schema with translations
  const eventFormSchema = useMemo(() => z.object({
    title: z.string().min(1, t('calendar.validation.titleRequired')).max(100, t('calendar.validation.titleTooLong')),
    description: z.string().optional(),
    type: z.enum(['training', 'match', 'medical', 'meeting', 'other']),
    startDate: z.date(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('calendar.validation.invalidTimeFormat')),
    endDate: z.date(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('calendar.validation.invalidTimeFormat')),
    location: z.string().optional(),
    isRecurring: z.boolean(),
    recurrenceFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    recurrenceInterval: z.number().min(1).max(99).optional(),
    recurrenceEndType: z.enum(['never', 'until', 'count']).optional(),
    recurrenceEndDate: z.date().optional(),
    recurrenceCount: z.number().min(1).max(365).optional(),
    recurrenceDaysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  }).refine((data) => {
    const start = new Date(data.startDate)
    const [startHour, startMin] = data.startTime.split(':').map(Number)
    start.setHours(startHour, startMin, 0, 0)

    const end = new Date(data.endDate)
    const [endHour, endMin] = data.endTime.split(':').map(Number)
    end.setHours(endHour, endMin, 0, 0)

    return end > start
  }, {
    message: t('calendar.validation.endTimeAfterStart'),
    path: ['endTime'],
  }).refine((data) => {
    if (!data.isRecurring) return true
    if (!data.recurrenceFrequency) return false
    if (!data.recurrenceInterval) return false
    if (!data.recurrenceEndType) return false

    if (data.recurrenceEndType === 'until' && !data.recurrenceEndDate) return false
    if (data.recurrenceEndType === 'count' && !data.recurrenceCount) return false
    // Days of week is optional for weekly - we'll default to start day

    return true
  }, {
    message: t('calendar.validation.completeRecurrenceSettings'),
    path: ['isRecurring'],
  }), [t])

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'training',
      startDate: defaultValues?.startTime || new Date(),
      startTime: defaultValues?.startTime
        ? dateToTimeInput(defaultValues.startTime, preferences || undefined)
        : '09:00',
      endDate: defaultValues?.endTime || new Date(),
      endTime: defaultValues?.endTime
        ? dateToTimeInput(defaultValues.endTime, preferences || undefined)
        : '11:00',
      location: defaultValues?.location || '',
      isRecurring: false,
      recurrenceFrequency: 'weekly',
      recurrenceInterval: 1,
      recurrenceEndType: 'never',
      recurrenceEndDate: undefined,
      recurrenceCount: 10,
      recurrenceDaysOfWeek: [],
    },
  })

  // Load templates when dialog opens
  useEffect(() => {
    if (open && !isEditing) {
      loadTemplates()
    }
  }, [open, isEditing])

  const loadTemplates = async () => {
    try {
      const result = await getEventTemplates()
      if ('error' in result) {
        console.error('Failed to load templates:', result.error)
      } else {
        setTemplates(result.templates as EventTemplate[])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)

    if (templateId === 'blank') {
      // Reset to blank event
      const startDate = defaultValues?.startTime || new Date()
      const endDate = defaultValues?.endTime || addMinutes(startDate, 120)

      form.reset({
        title: '',
        description: '',
        type: 'training',
        startDate,
        startTime: dateToTimeInput(startDate, preferences || undefined),
        endDate,
        endTime: dateToTimeInput(endDate, preferences || undefined),
        location: '',
        isRecurring: false,
        recurrenceFrequency: 'weekly',
        recurrenceInterval: 1,
        recurrenceEndType: 'never',
        recurrenceEndDate: undefined,
        recurrenceCount: 10,
        recurrenceDaysOfWeek: [],
      })
    } else {
      // Apply template
      const template = templates.find(t => t.id === templateId)
      if (template) {
        const startDate = defaultValues?.startTime || new Date()
        const endDate = addMinutes(startDate, template.defaultDuration)

        form.reset({
          title: template.name,
          description: template.description || '',
          type: template.type as any,
          startDate,
          startTime: dateToTimeInput(startDate, preferences || undefined),
          endDate,
          endTime: dateToTimeInput(endDate, preferences || undefined),
          location: '',
          isRecurring: false,
          recurrenceFrequency: 'weekly',
          recurrenceInterval: 1,
          recurrenceEndType: 'never',
          recurrenceEndDate: undefined,
          recurrenceCount: 10,
          recurrenceDaysOfWeek: [],
        })
      }
    }
  }

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedTemplateId('blank')
      form.reset({
        title: defaultValues?.title || '',
        description: defaultValues?.description || '',
        type: defaultValues?.type || 'training',
        startDate: defaultValues?.startTime || new Date(),
        startTime: defaultValues?.startTime
          ? dateToTimeInput(defaultValues.startTime, preferences || undefined)
          : '09:00',
        endDate: defaultValues?.endTime || new Date(),
        endTime: defaultValues?.endTime
          ? dateToTimeInput(defaultValues.endTime, preferences || undefined)
          : '11:00',
        location: defaultValues?.location || '',
        isRecurring: false,
        recurrenceFrequency: 'weekly',
        recurrenceInterval: 1,
        recurrenceEndType: 'never',
        recurrenceEndDate: undefined,
        recurrenceCount: 10,
        recurrenceDaysOfWeek: [],
      })
    }
  }, [open, defaultValues, form, preferences])

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true)

    try {
      // Combine date and time
      const startDateTime = new Date(data.startDate)
      const [startHour, startMin] = data.startTime.split(':').map(Number)
      startDateTime.setHours(startHour, startMin, 0, 0)

      const endDateTime = new Date(data.endDate)
      const [endHour, endMin] = data.endTime.split(':').map(Number)
      endDateTime.setHours(endHour, endMin, 0, 0)

      // Generate rrule if recurring
      let recurrenceRule: string | undefined
      if (data.isRecurring && data.recurrenceFrequency) {
        const frequencyMap: Record<string, Frequency> = {
          daily: RRule.DAILY,
          weekly: RRule.WEEKLY,
          monthly: RRule.MONTHLY,
        }

        const rruleOptions: any = {
          freq: frequencyMap[data.recurrenceFrequency],
          interval: data.recurrenceInterval || 1,
          dtstart: startDateTime,
        }

        // Add end condition
        if (data.recurrenceEndType === 'until' && data.recurrenceEndDate) {
          rruleOptions.until = new Date(data.recurrenceEndDate)
          rruleOptions.until.setHours(23, 59, 59, 999)
        } else if (data.recurrenceEndType === 'count' && data.recurrenceCount) {
          rruleOptions.count = data.recurrenceCount
        }

        // Add days of week for weekly recurrence
        if (data.recurrenceFrequency === 'weekly') {
          if (data.recurrenceDaysOfWeek && data.recurrenceDaysOfWeek.length > 0) {
            rruleOptions.byweekday = data.recurrenceDaysOfWeek
          } else {
            // If no days selected for weekly, default to the start day
            const startDay = startDateTime.getDay()
            rruleOptions.byweekday = [startDay]
          }
        }

        const rule = new RRule(rruleOptions)
        recurrenceRule = rule.toString()
      }

      const eventData: CreateEventData = {
        title: data.title,
        description: data.description,
        type: data.type,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: data.location,
        templateId: selectedTemplateId !== 'blank' ? selectedTemplateId : undefined,
        recurrenceRule: recurrenceRule,
      }

      let result
      if (isEditing && defaultValues?.id) {
        result = await updateEvent(defaultValues.id, eventData)
      } else {
        result = await createEvent(eventData)
      }

      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success(
          isEditing ? t('calendar.eventUpdated') : t('calendar.eventCreated')
        )
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      toast.error(t('common.anUnexpectedError'))
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('calendar.editEvent') : t('calendar.createEvent')}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('calendar.updateEventDescription')
              : t('calendar.createEventDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Template Selector - Only show when creating new events */}
            {!isEditing && templates.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('calendar.template')}</label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calendar.chooseTemplate')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">{t('calendar.blankEvent')}</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplateId && selectedTemplateId !== 'blank' && (
                  <p className="text-xs text-muted-foreground">
                    {templates.find(t => t.id === selectedTemplateId)?.description}
                  </p>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('calendar.eventTitle')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('calendar.titlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('calendar.eventType')} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('calendar.selectEventType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="training">{t('calendar.types.training')}</SelectItem>
                      <SelectItem value="match">{t('calendar.types.match')}</SelectItem>
                      <SelectItem value="medical">{t('calendar.types.medical')}</SelectItem>
                      <SelectItem value="meeting">{t('calendar.types.meeting')}</SelectItem>
                      <SelectItem value="other">{t('calendar.types.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('calendar.startDate')} *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        placeholder={t('calendar.pickDate')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('calendar.startTime')} *</FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        onSelect={field.onChange}
                        placeholder={t('calendar.pickTime')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('calendar.endDate')} *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        placeholder={t('calendar.pickDate')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('calendar.endTime')} *</FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        onSelect={field.onChange}
                        placeholder={t('calendar.pickTime')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('calendar.location')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('calendar.locationPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recurring Events Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        {t('calendar.recurringEvent')}
                      </FormLabel>
                      <FormDescription>
                        {t('calendar.recurringEventDescription')}
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('isRecurring') && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="recurrenceFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('calendar.repeat')} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('calendar.selectFrequency')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">{t('calendar.daily')}</SelectItem>
                              <SelectItem value="weekly">{t('calendar.weekly')}</SelectItem>
                              <SelectItem value="monthly">{t('calendar.monthly')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recurrenceInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('calendar.every')} *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="99"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {form.watch('recurrenceFrequency') === 'daily' && t('calendar.days')}
                            {form.watch('recurrenceFrequency') === 'weekly' && t('calendar.weeks')}
                            {form.watch('recurrenceFrequency') === 'monthly' && t('calendar.months')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Days of Week for Weekly Recurrence */}
                  {form.watch('recurrenceFrequency') === 'weekly' && (
                    <FormField
                      control={form.control}
                      name="recurrenceDaysOfWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('calendar.repeatOn')} *</FormLabel>
                          <div className="flex gap-2">
                            {[t('calendar.daysOfWeek.sun'), t('calendar.daysOfWeek.mon'), t('calendar.daysOfWeek.tue'), t('calendar.daysOfWeek.wed'), t('calendar.daysOfWeek.thu'), t('calendar.daysOfWeek.fri'), t('calendar.daysOfWeek.sat')].map((day, index) => {
                              const isSelected = field.value?.includes(index) || false
                              return (
                                <Button
                                  key={index}
                                  type="button"
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="sm"
                                  className="h-9 w-9 p-0"
                                  onClick={() => {
                                    const current = field.value || []
                                    if (isSelected) {
                                      field.onChange(current.filter((d) => d !== index))
                                    } else {
                                      field.onChange([...current, index].sort())
                                    }
                                  }}
                                >
                                  {day}
                                </Button>
                              )
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* End Condition */}
                  <FormField
                    control={form.control}
                    name="recurrenceEndType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('calendar.ends')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('calendar.selectWhenToEnd')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">{t('calendar.never')}</SelectItem>
                            <SelectItem value="until">{t('calendar.onDate')}</SelectItem>
                            <SelectItem value="count">{t('calendar.afterOccurrences')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('recurrenceEndType') === 'until' && (
                    <FormField
                      control={form.control}
                      name="recurrenceEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('calendar.endDate')} *</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              onSelect={field.onChange}
                              placeholder={t('calendar.pickDate')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch('recurrenceEndType') === 'count' && (
                    <FormField
                      control={form.control}
                      name="recurrenceCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('calendar.numberOfOccurrences')} *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="365"
                              placeholder="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('calendar.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('calendar.descriptionPlaceholder')}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('calendar.updateEvent') : t('calendar.createEvent')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
