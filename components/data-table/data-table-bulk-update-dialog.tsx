'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export type BulkUpdateField = 'position' | 'status' | 'nationality'

interface BulkUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  field: BulkUpdateField | null
  onFieldChange: (field: BulkUpdateField | null) => void
  onConfirm: (field: BulkUpdateField, value: string | null) => Promise<void>
  // Options for select fields
  positionOptions?: string[]
  statusOptions?: Array<{ value: string; label: string }>
  isLoading?: boolean
}

export function BulkUpdateDialog({
  open,
  onOpenChange,
  selectedCount,
  field,
  onFieldChange,
  onConfirm,
  positionOptions = [],
  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'injured', label: 'Injured' },
    { value: 'inactive', label: 'Inactive' },
  ],
  isLoading = false,
}: BulkUpdateDialogProps) {
  const [value, setValue] = useState<string>('')

  // Reset value when dialog opens or field changes
  useEffect(() => {
    if (open) {
      setValue('')
    }
  }, [open, field])

  const handleConfirm = async () => {
    if (!field) return
    
    let updateValue: string | null = value.trim() || null
    
    // For select fields, use the selected value
    if (field === 'status' || field === 'position') {
      updateValue = value || null
    }
    
    await onConfirm(field, updateValue)
    setValue('')
    onFieldChange(null)
  }

  const handleFieldSelect = (selectedField: BulkUpdateField) => {
    onFieldChange(selectedField)
    setValue('')
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      setValue('')
      onFieldChange(null)
    }
  }

  const getFieldLabel = () => {
    switch (field) {
      case 'position':
        return 'Position'
      case 'status':
        return 'Status'
      case 'nationality':
        return 'Nationality'
      default:
        return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Update Players</DialogTitle>
          <DialogDescription>
            Update {selectedCount} {selectedCount === 1 ? 'player' : 'players'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="field">Field to Update</Label>
            <Select
              value={field || ''}
              onValueChange={(val) => handleFieldSelect(val as BulkUpdateField)}
            >
              <SelectTrigger id="field">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="nationality">Nationality</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {field && (
            <div className="space-y-2">
              <Label htmlFor="value">New {getFieldLabel()}</Label>
              {field === 'status' ? (
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger id="value">
                    <SelectValue placeholder={`Select ${getFieldLabel().toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Clear</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field === 'position' && positionOptions.length > 0 ? (
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger id="value">
                    <SelectValue placeholder={`Select ${getFieldLabel().toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Clear</SelectItem>
                    {positionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`Enter ${getFieldLabel().toLowerCase()}`}
                />
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!field || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

