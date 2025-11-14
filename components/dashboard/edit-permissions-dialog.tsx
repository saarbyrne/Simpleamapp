'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PERMISSIONS, PERMISSION_METADATA, ALL_PERMISSIONS } from '@/lib/permissions'
import type { StaffRow } from './staff-table'

type EditPermissionsDialogProps = {
  staff: StaffRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staffId: string, permissions: string[]) => Promise<void>
}

export function EditPermissionsDialog({
  staff,
  open,
  onOpenChange,
  onSave,
}: EditPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<string[]>(staff.permissions)
  const [isSaving, setIsSaving] = useState(false)

  const handleTogglePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission))
    } else {
      setPermissions([...permissions, permission])
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(staff.id, permissions)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit System Permissions for {staff.name}</DialogTitle>
          <DialogDescription>
            Control what this person can access and manage in the system. Admin permission grants
            full access to all features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {ALL_PERMISSIONS.map((permission) => {
            const metadata = PERMISSION_METADATA[permission]
            const isChecked = permissions.includes(permission)

            return (
              <div
                key={permission}
                className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={permission}
                  checked={isChecked}
                  onCheckedChange={() => handleTogglePermission(permission)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={permission}
                    className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                  >
                    {metadata.icon && <span className="text-lg">{metadata.icon}</span>}
                    {metadata.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {metadata.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
