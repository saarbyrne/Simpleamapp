'use client'

import { useState, useEffect } from 'react'
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
import { dateToTimeInput } from '@/lib/date-input-utils'

const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  type: z.enum(['training', 'match', 'medical', 'meeting', 'other']),
  startDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endDate: z.date(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
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
  message: 'End time must be after start time',
  path: ['endTime'],
}).refine((data) => {
  if (!data.isRecurring) return true
  if (!data.recurrenceFrequency) return false
  if (!data.recurrenceInterval) return false
  if (!data.recurrenceEndType) return false

  if (data.recurrenceEndType === 'until' && !data.recurrenceEndDate) return false
  if (data.recurrenceEndType === 'count' && !data.recurrenceCount) return false
  if (data.recurrenceFrequency === 'weekly' && (!data.recurrenceDaysOfWeek || data.recurrenceDaysOfWeek.length === 0)) return false

  return true
}, {
  message: 'Please complete all recurrence settings',
  path: ['isRecurring'],
})

type EventFormValues = z.infer<typeof eventFormSchema>

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
  const [isLoading, setIsLoading] = useState(false)
  const [templates, setTemplates] = useState<EventTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const isEditing = !!defaultValues?.id
  const { preferences } = useUserPreferences()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
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
        if (data.recurrenceFrequency === 'weekly' && data.recurrenceDaysOfWeek && data.recurrenceDaysOfWeek.length > 0) {
          rruleOptions.byweekday = data.recurrenceDaysOfWeek
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
          isEditing ? 'Event updated successfully' : 'Event created successfully'
        )
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Create Event'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the event details below.'
              : 'Fill in the details to create a new event.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Template Selector - Only show when creating new events */}
            {!isEditing && templates.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank Event</SelectItem>
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
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Training Session" {...field} />
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
                  <FormLabel>Event Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="match">Match</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        placeholder="Pick a date"
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
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        onSelect={field.onChange}
                        placeholder="Pick a time"
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
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        placeholder="Pick a date"
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
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        onSelect={field.onChange}
                        placeholder="Pick a time"
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Training Ground" {...field} />
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
                        Recurring Event
                      </FormLabel>
                      <FormDescription>
                        Create multiple instances of this event
                      </FormDescription>
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
                          <FormLabel>Repeat *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
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
                          <FormLabel>Every *</FormLabel>
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
                            {form.watch('recurrenceFrequency') === 'daily' && 'day(s)'}
                            {form.watch('recurrenceFrequency') === 'weekly' && 'week(s)'}
                            {form.watch('recurrenceFrequency') === 'monthly' && 'month(s)'}
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
                          <FormLabel>Repeat On *</FormLabel>
                          <div className="flex gap-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
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
                        <FormLabel>Ends *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select when to end" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="until">On date</SelectItem>
                            <SelectItem value="count">After occurrences</SelectItem>
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
                          <FormLabel>End Date *</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              onSelect={field.onChange}
                              placeholder="Pick a date"
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
                          <FormLabel>Number of Occurrences *</FormLabel>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about this event..."
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
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
