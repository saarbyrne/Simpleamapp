'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PERMISSION_METADATA } from '@/lib/permissions'
import type { StaffRow } from './staff-table'
import type { OrganizationRoleSummary } from '@/app/actions/staff'

type EditRolesDialogProps = {
  staff: StaffRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staffId: string, roles: string[]) => Promise<void>
  availableRoles: OrganizationRoleSummary[]
}

export function EditRolesDialog({
  staff,
  open,
  onOpenChange,
  onSave,
  availableRoles,
}: EditRolesDialogProps) {
  const availableRoleNames = useMemo(
    () => availableRoles.map((role) => role.name),
    [availableRoles]
  )
  const availableRoleSet = useMemo(
    () => new Set(availableRoleNames),
    [availableRoleNames]
  )
  const [roles, setRoles] = useState<string[]>(() =>
    staff.roleNames.filter((role) => availableRoleSet.has(role))
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setRoles(staff.roleNames.filter((role) => availableRoleSet.has(role)))
  }, [staff.id, staff.roleNames, availableRoleSet])

  const missingRoles = staff.roleNames.filter(
    (role) => !availableRoleSet.has(role)
  )

  const handleToggleRole = (roleName: string) => {
    setRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((role) => role !== roleName)
        : [...prev, roleName]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const normalizedRoles = roles.filter((role) => availableRoleSet.has(role))
      await onSave(staff.id, normalizedRoles)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Roles for {staff.name}</DialogTitle>
          <DialogDescription>
            Assign roles that are defined for your organization. Roles control default
            permissions and how this person appears across the workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Select Roles</Label>
            {availableRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No organization roles are defined yet. Create roles in system settings to assign
                them here.
              </p>
            ) : (
              <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                {availableRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
                  >
                    <Checkbox
                      checked={roles.includes(role.name)}
                      onCheckedChange={() => handleToggleRole(role.name)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{role.name}</p>
                      {role.permissions.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Permissions:{' '}
                          {role.permissions
                            .map((permission) =>
                              PERMISSION_METADATA[permission as keyof typeof PERMISSION_METADATA]?.label || permission
                            )
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {missingRoles.length > 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-50 p-3 text-xs text-amber-900">
              The following roles are no longer defined in your organization and will be removed
              when you save: {missingRoles.join(', ')}
            </div>
          )}
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
