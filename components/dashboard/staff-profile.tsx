'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PERMISSION_METADATA } from '@/lib/permissions'
import { formatDate } from '@/lib/date-utils'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { Mail, Phone, Calendar, Activity as ActivityIcon } from 'lucide-react'
import { EditRolesDialog } from './edit-roles-dialog'
import { updateStaffRoles } from '@/app/actions/staff'
import { toast } from 'sonner'
import type { StaffRow } from './staff-table'
import { useBreadcrumb } from '@/lib/breadcrumb-context'
import type { OrganizationRoleSummary } from '@/app/actions/staff'

type StaffProfileProps = {
  staff: any // Full staff member with relations
  stats: {
    notesCreated: number
    formsCreated: number
    eventsCreated: number
  } | null
  organizationRoles: OrganizationRoleSummary[]
}

export function StaffProfile({ staff, stats, organizationRoles }: StaffProfileProps) {
  const router = useRouter()
  const { preferences } = useUserPreferences()
  const [editRolesOpen, setEditRolesOpen] = useState(false)
  const { setCustomLabel } = useBreadcrumb()

  const staffRow: StaffRow = {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    avatar: staff.avatar,
    phone: staff.phone,
    roleNames: staff.roleNames,
    permissions: staff.permissions,
    lastLoginAt: staff.lastLoginAt,
    createdAt: staff.createdAt,
  }

  const handleSaveRoles = async (staffId: string, roles: string[]) => {
    const result = await updateStaffRoles(staffId, roles)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Roles updated successfully')
      router.refresh()
      setEditRolesOpen(false)
    }
  }


  useEffect(() => {
    if (staff?.id) {
      setCustomLabel(staff.id, staff.name || 'Staff Member')
      return () => setCustomLabel(staff.id, null)
    }
  }, [staff?.id, staff?.name, setCustomLabel])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-6">
        <Avatar className="h-20 w-20">
          {staff.avatar ? (
            <AvatarImage src={staff.avatar} alt={staff.name} />
          ) : (
            <AvatarFallback className="text-2xl">{staff.name?.charAt(0)}</AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{staff.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {staff.roleNames.map((role: string) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditRolesOpen(true)}>
            Edit Roles
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${staff.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {staff.email}
                    </a>
                  </div>
                </div>

                {staff.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone</p>
                      <a
                        href={`tel:${staff.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {staff.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                      {formatDate(staff.createdAt, preferences || undefined)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Last Active</p>
                    <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                      {staff.lastLoginAt
                        ? formatDate(staff.lastLoginAt, preferences || undefined)
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Activity Statistics</CardTitle>
                  <CardDescription>Contributions to the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Notes Created</span>
                    <span className="text-2xl font-bold">{stats.notesCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Forms Created</span>
                    <span className="text-2xl font-bold">{stats.formsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Events Created</span>
                    <span className="text-2xl font-bold">{stats.eventsCreated}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Roles (Job Functions)</CardTitle>
              <CardDescription>
                Descriptive labels for what this person does
              </CardDescription>
            </CardHeader>
            <CardContent>
              {staff.roleNames.length === 0 ? (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {staff.roleNames.map((role: string) => (
                    <Badge key={role} variant="secondary" className="text-sm">
                      {role}
                    </Badge>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setEditRolesOpen(true)}
              >
                Edit Roles
              </Button>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
              <CardDescription>What this person can access and manage</CardDescription>
            </CardHeader>
            <CardContent>
              {staff.permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No permissions assigned</p>
              ) : (
                <div className="grid gap-3">
                  {staff.permissions.map((perm: string) => {
                    const metadata = PERMISSION_METADATA[perm as keyof typeof PERMISSION_METADATA]
                    return (
                      <div
                        key={perm}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        {metadata?.icon && (
                          <span className="text-lg">{metadata.icon}</span>
                        )}
                        <div>
                          <p className="font-medium text-sm">{metadata?.label || perm}</p>
                          <p className="text-xs text-muted-foreground">
                            {metadata?.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent actions by this staff member</CardDescription>
            </CardHeader>
            <CardContent>
              {staff.activities && staff.activities.length > 0 ? (
                <div className="space-y-3">
                  {staff.activities.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{activity.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                          {formatDate(activity.createdAt, preferences || undefined)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes Created</CardTitle>
              <CardDescription>Notes authored by this staff member</CardDescription>
            </CardHeader>
            <CardContent>
              {staff.notes && staff.notes.length > 0 ? (
                <div className="space-y-3">
                  {staff.notes.map((note: any) => (
                    <div key={note.id} className="rounded-lg border p-3">
                      <p className="font-medium text-sm">{note.title || 'Untitled Note'}</p>
                      {note.linkedPerson && (
                        <p className="text-xs text-muted-foreground">
                          About: {note.linkedPerson.firstName} {note.linkedPerson.lastName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {formatDate(note.createdAt, preferences || undefined)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes created yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {editRolesOpen && (
        <EditRolesDialog
          staff={staffRow}
          open={editRolesOpen}
          onOpenChange={setEditRolesOpen}
          onSave={handleSaveRoles}
          availableRoles={organizationRoles}
        />
      )}

    </div>
  )
}
