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
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { COMMON_ROLES } from '@/lib/permissions'
import type { StaffRow } from './staff-table'

type EditRolesDialogProps = {
  staff: StaffRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staffId: string, roles: string[]) => Promise<void>
}

export function EditRolesDialog({
  staff,
  open,
  onOpenChange,
  onSave,
}: EditRolesDialogProps) {
  const [roles, setRoles] = useState<string[]>(staff.roleNames)
  const [newRole, setNewRole] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleAddRole = () => {
    const trimmed = newRole.trim()
    if (trimmed && !roles.includes(trimmed)) {
      setRoles([...roles, trimmed])
      setNewRole('')
    }
  }

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(roles.filter(r => r !== roleToRemove))
  }

  const handleAddCommonRole = (role: string) => {
    if (!roles.includes(role)) {
      setRoles([...roles, role])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRole()
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(staff.id, roles)
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
            Roles are flexible labels describing job functions. You can create custom roles or
            use common suggestions below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Roles */}
          <div className="space-y-2">
            <Label>Current Roles</Label>
            {roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <Badge key={role} variant="secondary" className="gap-1">
                    {role}
                    <button
                      onClick={() => handleRemoveRole(role)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Add New Role */}
          <div className="space-y-2">
            <Label htmlFor="new-role">Add Role</Label>
            <div className="flex gap-2">
              <Input
                id="new-role"
                placeholder="e.g., Head Coach, Physiotherapist"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={handleAddRole}>
                Add
              </Button>
            </div>
          </div>

          {/* Common Role Suggestions */}
          <div className="space-y-2">
            <Label>Common Roles (click to add)</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ROLES.filter(r => !roles.includes(r)).map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleAddCommonRole(role)}
                >
                  + {role}
                </Badge>
              ))}
            </div>
          </div>
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
