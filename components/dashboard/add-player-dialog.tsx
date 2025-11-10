'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { NationalitySelect } from '@/components/ui/nationality-select'
import { createPlayer } from '@/app/actions/players'
import { toast } from 'sonner'

interface AddPlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Optional callback called after successfully adding a player
   */
  onSuccess?: () => void
}

/**
 * AddPlayerDialog
 *
 * A reusable dialog component for adding new players.
 * Can be triggered from anywhere in the application.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 * <AddPlayerDialog open={open} onOpenChange={setOpen} />
 * ```
 */
export function AddPlayerDialog({ open, onOpenChange, onSuccess }: AddPlayerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    firstName: '',
    lastName: '',
    position: '',
    jerseyNumber: '',
    dateOfBirth: undefined as Date | undefined,
    nationality: '',
    email: '',
    phone: '',
  })

  const handleSubmit = async () => {
    if (!newPlayer.firstName || !newPlayer.lastName) {
      toast.error('First name and last name are required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPlayer({
        firstName: newPlayer.firstName,
        lastName: newPlayer.lastName,
        email: newPlayer.email || undefined,
        phone: newPlayer.phone || undefined,
        position: newPlayer.position || undefined,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : undefined,
        dateOfBirth: newPlayer.dateOfBirth?.toISOString().split('T')[0] || undefined,
        nationality: newPlayer.nationality || undefined,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        // Reset form
        setNewPlayer({
          firstName: '',
          lastName: '',
          position: '',
          jerseyNumber: '',
          dateOfBirth: undefined,
          nationality: '',
          email: '',
          phone: '',
        })
        toast.success('Player added successfully')
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error creating player:', error)
      toast.error('Failed to create player')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>
            Enter the player details below to add them to your roster.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={newPlayer.firstName}
                onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                placeholder="Enter first name"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={newPlayer.lastName}
                onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                placeholder="Enter last name"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newPlayer.email}
              onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
              placeholder="player@example.com"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={newPlayer.phone}
              onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={newPlayer.position}
              onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
              placeholder="e.g. Forward"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jerseyNumber">Jersey Number</Label>
              <Input
                id="jerseyNumber"
                type="number"
                value={newPlayer.jerseyNumber}
                onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                placeholder="e.g. 10"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <DatePicker
                date={newPlayer.dateOfBirth}
                onSelect={(date) => setNewPlayer({ ...newPlayer, dateOfBirth: date })}
                placeholder="Pick a date"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <NationalitySelect
              value={newPlayer.nationality || undefined}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, nationality: value })}
              placeholder="Select nationality"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Player'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
