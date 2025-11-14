'use client'

import { useMemo, useState } from 'react'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { updateStaffRoles, updateStaffPermissions } from '@/app/actions/staff'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { PERMISSION_METADATA } from '@/lib/permissions'
import { formatDate } from '@/lib/date-utils'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { toast } from 'sonner'
import { EditRolesDialog } from './edit-roles-dialog'
import { EditPermissionsDialog } from './edit-permissions-dialog'

export type StaffRow = {
  id: string
  name: string
  email: string
  avatar: string | null
  phone: string | null
  roleNames: string[]
  permissions: string[]
  lastLoginAt: Date | null
  createdAt: Date
}

type StaffTableProps = {
  staff: StaffRow[]
  total?: number
}

const titleCase = (value: string | null | undefined) => {
  if (!value) return ''
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

const createColumns = (
  staff: StaffRow[],
  t: ReturnType<typeof useTranslations>,
  onNavigateToProfile: (staffId: string) => void,
  onEditRoles: (staff: StaffRow) => void,
  onEditPermissions: (staff: StaffRow) => void,
  preferences?: { timezone: string | null; dateFormat: string | null; timeFormat: string | null } | null
): ColumnDef<StaffRow>[] => {
  const columns: ColumnDef<StaffRow>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 280,
      cell: ({ row }) => {
        const staff = row.original
        const rowIndex = row.index
        const shouldPriorityLoad = rowIndex < 10
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {staff.avatar ? (
                <AvatarImage
                  src={staff.avatar}
                  alt={staff.name}
                  loading={shouldPriorityLoad ? 'eager' : 'lazy'}
                />
              ) : (
                <AvatarFallback>{staff.name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigateToProfile(staff.id)
                }}
                className="font-medium text-foreground hover:text-primary hover:underline text-start"
              >
                {staff.name}
              </button>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'roleNames',
      header: 'Roles',
      enableHiding: true,
      enableSorting: false,
      size: 200,
      cell: ({ getValue }) => {
        const roles = getValue() as string[]
        if (!roles?.length) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.slice(0, 3).map((role) => (
              <Badge key={role} variant="secondary" className="text-xs">
                {titleCase(role)}
              </Badge>
            ))}
            {roles.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{roles.length - 3}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      enableHiding: true,
      enableSorting: false,
      size: 250,
      cell: ({ getValue }) => {
        const permissions = getValue() as string[]
        if (!permissions?.length) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 3).map((perm) => {
              const metadata = PERMISSION_METADATA[perm as keyof typeof PERMISSION_METADATA]
              return (
                <Badge key={perm} variant="outline" className="text-xs">
                  {metadata?.label || titleCase(perm)}
                </Badge>
              )
            })}
            {permissions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{permissions.length - 3}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableHiding: true,
      cell: ({ getValue }) => {
        const email = getValue() as string | null
        if (!email) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <a
            href={`mailto:${email}`}
            className="text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {email}
          </a>
        )
      },
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Last Active',
      enableHiding: true,
      cell: ({ getValue }) => {
        const lastLogin = getValue() as Date | null
        if (!lastLogin) return <span className="text-sm text-muted-foreground">Never</span>
        return (
          <span className="text-sm" suppressHydrationWarning>
            {formatDate(lastLogin, preferences || undefined)}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const staff = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigateToProfile(staff.id)}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditRoles(staff)}>
                  Edit Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditPermissions(staff)}>
                  Edit Permissions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return columns
}

export function StaffTable({ staff, total: serverTotal }: StaffTableProps) {
  const router = useRouter()
  const t = useTranslations()
  const { preferences } = useUserPreferences()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [editRolesStaff, setEditRolesStaff] = useState<StaffRow | null>(null)
  const [editPermissionsStaff, setEditPermissionsStaff] = useState<StaffRow | null>(null)

  const onNavigateToProfile = (staffId: string) => {
    router.push(`/dashboard/system-settings/staff/${staffId}`)
  }

  const onEditRoles = (staff: StaffRow) => {
    setEditRolesStaff(staff)
  }

  const onEditPermissions = (staff: StaffRow) => {
    setEditPermissionsStaff(staff)
  }

  const handleSaveRoles = async (staffId: string, roles: string[]) => {
    const result = await updateStaffRoles(staffId, roles)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Roles updated successfully')
      router.refresh()
      setEditRolesStaff(null)
    }
  }

  const handleSavePermissions = async (staffId: string, permissions: string[]) => {
    const result = await updateStaffPermissions(staffId, permissions)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Permissions updated successfully')
      router.refresh()
      setEditPermissionsStaff(null)
    }
  }

  const columns = useMemo(
    () => createColumns(staff, t, onNavigateToProfile, onEditRoles, onEditPermissions, preferences),
    [staff, t, preferences]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={staff}
        sorting={sorting}
        onSortingChange={setSorting}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        enableRowSelection={false}
        enableColumnReordering={false}
        enableColumnResizing={false}
        enableGrouping={false}
      />

      {editRolesStaff && (
        <EditRolesDialog
          staff={editRolesStaff}
          open={!!editRolesStaff}
          onOpenChange={(open) => !open && setEditRolesStaff(null)}
          onSave={handleSaveRoles}
        />
      )}

      {editPermissionsStaff && (
        <EditPermissionsDialog
          staff={editPermissionsStaff}
          open={!!editPermissionsStaff}
          onOpenChange={(open) => !open && setEditPermissionsStaff(null)}
          onSave={handleSavePermissions}
        />
      )}
    </>
  )
}
