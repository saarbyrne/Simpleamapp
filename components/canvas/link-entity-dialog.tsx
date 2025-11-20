'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Link } from 'lucide-react'
import { toast } from 'sonner'
import { updateDrawing } from '@/app/actions/drawings'

interface LinkEntityDialogProps {
  drawingId: string
  currentLinkedType?: string
  currentLinkedId?: string
  open: boolean
  onClose: () => void
  onLinked?: () => void
}

export function LinkEntityDialog({
  drawingId,
  currentLinkedType,
  currentLinkedId,
  open,
  onClose,
  onLinked,
}: LinkEntityDialogProps) {
  const [entityType, setEntityType] = useState<string>(currentLinkedType || '')
  const [entityId, setEntityId] = useState<string>(currentLinkedId || '')
  const [isLinking, setIsLinking] = useState(false)

  const handleLink = async () => {
    if (!entityType) {
      toast.error('Please select an entity type')
      return
    }

    setIsLinking(true)
    try {
      const result = await updateDrawing(drawingId, {
        linkedToType: entityType || undefined,
        linkedToId: entityId || undefined,
      })

      if (result.success) {
        toast.success('Drawing linked successfully')
        onLinked?.()
        onClose()
      } else {
        toast.error(result.error || 'Failed to link drawing')
      }
    } catch (error) {
      console.error('Error linking drawing:', error)
      toast.error('Failed to link drawing')
    } finally {
      setIsLinking(false)
    }
  }

  const handleUnlink = async () => {
    setIsLinking(true)
    try {
      const result = await updateDrawing(drawingId, {
        linkedToType: undefined,
        linkedToId: undefined,
      })

      if (result.success) {
        toast.success('Drawing unlinked successfully')
        onLinked?.()
        onClose()
      } else {
        toast.error(result.error || 'Failed to unlink drawing')
      }
    } catch (error) {
      console.error('Error unlinking drawing:', error)
      toast.error('Failed to unlink drawing')
    } finally {
      setIsLinking(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link to Entity</DialogTitle>
          <DialogDescription>
            Link this drawing to an event, plan, or note
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="entity-type">Entity Type</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger id="entity-type">
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (standalone)</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {entityType && (
            <div className="space-y-2">
              <Label htmlFor="entity-id">Entity ID</Label>
              <Select value={entityId} onValueChange={setEntityId}>
                <SelectTrigger id="entity-id">
                  <SelectValue placeholder={`Select ${entityType}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select {entityType}...</SelectItem>
                  {/* TODO: Load actual entities based on type */}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Entity linking will be fully implemented in a future update
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {currentLinkedType && (
            <Button
              variant="outline"
              onClick={handleUnlink}
              disabled={isLinking}
            >
              Unlink
            </Button>
          )}
          <div className="flex gap-2 ms-auto">
            <Button variant="outline" onClick={onClose} disabled={isLinking}>
              Cancel
            </Button>
            <Button onClick={handleLink} disabled={isLinking}>
              {isLinking ? (
                <>
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                  Linking...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 me-2" />
                  Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
