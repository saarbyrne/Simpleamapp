'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateForm } from '@/app/actions/forms'
import { getOrganizationPlayers } from '@/app/actions/events'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FormDistributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formId: string
  formName: string
  onSuccess?: () => void
}

interface PlayerOption {
  id: string
  personOrgId: string
  name: string
  photo: string | null
}

export function FormDistributionDialog({
  open,
  onOpenChange,
  formId,
  formName,
  onSuccess,
}: FormDistributionDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false)
  const [players, setPlayers] = useState<PlayerOption[]>([])
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all')
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])
  const [scheduleType, setScheduleType] = useState<'one_time' | 'daily' | 'weekly' | 'monthly'>('one_time')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
  const [scheduledTime, setScheduledTime] = useState<string>('')

  // Load players when dialog opens
  useEffect(() => {
    if (open) {
      loadPlayers()
    } else {
      // Reset form when closed
      setTargetType('all')
      setSelectedPlayerIds([])
      setScheduleType('one_time')
      setScheduledDate(undefined)
      setScheduledTime('')
    }
  }, [open])

  const loadPlayers = async () => {
    setIsLoadingPlayers(true)
    try {
      const result = await getOrganizationPlayers()
      if (result.error) {
        toast.error(result.error)
      } else if (result.success && result.players) {
        const playerOptions: PlayerOption[] = result.players.map((p: any) => ({
          id: p.person.id,
          personOrgId: p.id,
          name: `${p.person.firstName} ${p.person.lastName}`,
          photo: p.person.photo,
        }))
        setPlayers(playerOptions)
      }
    } catch (error) {
      console.error('Error loading players:', error)
      toast.error('Failed to load players')
    } finally {
      setIsLoadingPlayers(false)
    }
  }

  const handleTogglePlayer = (personOrgId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(personOrgId)
        ? prev.filter((id) => id !== personOrgId)
        : [...prev, personOrgId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPlayerIds.length === players.length) {
      setSelectedPlayerIds([])
    } else {
      setSelectedPlayerIds(players.map((p) => p.personOrgId))
    }
  }

  const handleSubmit = async () => {
    if (targetType === 'specific' && selectedPlayerIds.length === 0) {
      toast.error('Please select at least one player')
      return
    }

    if (scheduleType !== 'one_time' && !scheduledDate) {
      toast.error('Please select a date for scheduled distribution')
      return
    }

    setIsSubmitting(true)
    try {
      // Combine date and time if both are provided
      let scheduledAt: string | undefined
      if (scheduledDate) {
        if (scheduledTime) {
          const [hours, minutes] = scheduledTime.split(':')
          const dateTime = new Date(scheduledDate)
          dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
          scheduledAt = dateTime.toISOString()
        } else {
          scheduledAt = scheduledDate.toISOString()
        }
      }

      const result = await updateForm(formId, {
        targetType: targetType === 'all' ? 'all' : 'specific',
        targetIds: targetType === 'all' ? [] : selectedPlayerIds,
        scheduleType,
        scheduledAt,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Form distribution updated successfully')
        onOpenChange(false)
        router.refresh()
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error updating form distribution:', error)
      toast.error('Failed to update form distribution')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Distribute Form: {formName}</DialogTitle>
          <DialogDescription>
            Choose who should receive this form and when to send it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Send To</Label>
              <Select value={targetType} onValueChange={(value: 'all' | 'specific') => setTargetType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Players</SelectItem>
                  <SelectItem value="specific">Specific Players</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {targetType === 'specific' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Players</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedPlayerIds.length === players.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  {isLoadingPlayers ? (
                    <div className="text-center text-muted-foreground py-4">Loading players...</div>
                  ) : players.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">No players found</div>
                  ) : (
                    <div className="space-y-2">
                      {players.map((player) => (
                        <div
                          key={player.personOrgId}
                          className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => handleTogglePlayer(player.personOrgId)}
                        >
                          <Checkbox
                            checked={selectedPlayerIds.includes(player.personOrgId)}
                            onCheckedChange={() => handleTogglePlayer(player.personOrgId)}
                          />
                          <Avatar className="h-8 w-8">
                            {player.photo ? (
                              <AvatarImage src={player.photo} alt={player.name} />
                            ) : (
                              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span className="flex-1 text-sm">{player.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {selectedPlayerIds.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPlayerIds.length} player{selectedPlayerIds.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Schedule Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Select
                value={scheduleType}
                onValueChange={(value: 'one_time' | 'daily' | 'weekly' | 'monthly') => setScheduleType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">Send Now (One-time)</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scheduleType !== 'one_time' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <DatePicker
                    date={scheduledDate}
                    onSelect={setScheduledDate}
                    placeholder="Pick a date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <TimePicker
                    time={scheduledTime}
                    onSelect={setScheduledTime}
                    placeholder="Select time"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Distribution'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

