'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Mail, X } from 'lucide-react'
import { createReportSchedule, updateReportSchedule, deleteReportSchedule } from '@/app/actions/reports'
import { toast } from 'sonner'

interface ReportSchedule {
  id: string
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  dayOfWeek?: number | null
  dayOfMonth?: number | null
  recipients: string[]
  format: 'pdf' | 'link'
  nextSend: Date
  isActive: boolean
}

interface ScheduleReportDialogProps {
  reportId: string
  reportName: string
  existingSchedule?: ReportSchedule | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onScheduleCreated?: () => void
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export function ScheduleReportDialog({
  reportId,
  reportName,
  existingSchedule,
  open,
  onOpenChange,
  onScheduleCreated,
}: ScheduleReportDialogProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    existingSchedule?.frequency || 'weekly'
  )
  const [time, setTime] = useState(existingSchedule?.time || '09:00')
  const [dayOfWeek, setDayOfWeek] = useState(existingSchedule?.dayOfWeek?.toString() || '1')
  const [dayOfMonth, setDayOfMonth] = useState(existingSchedule?.dayOfMonth?.toString() || '1')
  const [recipientInput, setRecipientInput] = useState('')
  const [recipients, setRecipients] = useState<string[]>(existingSchedule?.recipients || [])
  const [format, setFormat] = useState<'pdf' | 'link'>(existingSchedule?.format || 'pdf')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddRecipient = () => {
    const email = recipientInput.trim()
    if (!email) return

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (recipients.includes(email)) {
      toast.error('Email already added')
      return
    }

    setRecipients([...recipients, email])
    setRecipientInput('')
  }

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email))
  }

  const handleSubmit = async () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient')
      return
    }

    setIsSubmitting(true)
    try {
      const scheduleData = {
        frequency,
        time,
        dayOfWeek: frequency === 'weekly' ? parseInt(dayOfWeek) : undefined,
        dayOfMonth: frequency === 'monthly' ? parseInt(dayOfMonth) : undefined,
        recipients,
        format,
      }

      let result
      if (existingSchedule) {
        result = await updateReportSchedule(existingSchedule.id, scheduleData)
      } else {
        result = await createReportSchedule(reportId, scheduleData)
      }

      if (result.success) {
        toast.success(existingSchedule ? 'Schedule updated successfully' : 'Schedule created successfully')
        onScheduleCreated?.()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to save schedule')
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast.error('Failed to save schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!existingSchedule) return

    if (!confirm('Are you sure you want to delete this schedule?')) return

    setIsSubmitting(true)
    try {
      const result = await deleteReportSchedule(existingSchedule.id)
      if (result.success) {
        toast.success('Schedule deleted successfully')
        onScheduleCreated?.()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to delete schedule')
      }
    } catch (error) {
      console.error('Error deleting schedule:', error)
      toast.error('Failed to delete schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingSchedule ? 'Edit' : 'Schedule'} Report Delivery
          </DialogTitle>
          <DialogDescription>
            Automatically send "{reportName}" to recipients on a recurring schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Frequency Selection */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection for Weekly */}
          {frequency === 'weekly' && (
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Day Selection for Monthly */}
          {frequency === 'monthly' && (
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Delivery Format</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Attachment</SelectItem>
                <SelectItem value="link">Link to Report</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {format === 'pdf'
                ? 'Report will be exported as PDF and attached to email'
                : 'Email will contain a secure link to view the report online'}
            </p>
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddRecipient()
                  }
                }}
              />
              <Button type="button" onClick={handleAddRecipient} variant="outline">
                Add
              </Button>
            </div>

            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="pe-1">
                    <Mail className="h-3 w-3 me-1" />
                    {email}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ms-1 hover:bg-destructive/20"
                      onClick={() => handleRemoveRecipient(email)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Schedule Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {frequency === 'daily' && 'Every day'}
                  {frequency === 'weekly' && `Every ${DAYS_OF_WEEK.find(d => d.value === parseInt(dayOfWeek))?.label}`}
                  {frequency === 'monthly' && `Every month on day ${dayOfMonth}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>At {time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>
                  {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {existingSchedule && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete Schedule
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || recipients.length === 0}>
              {isSubmitting ? 'Saving...' : existingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
