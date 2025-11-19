'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { updateStaffPermissions, updateStaffRoles } from '@/app/actions/staff'
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
import { PageCard } from '@/components/ui/page-card'
import { DataTable, DataTableFilters } from '@/components/data-table'
import { DataTableColumnManager } from '@/components/data-table/data-table-column-manager'
import { DataTableExport } from '@/components/data-table/data-table-export'
import { BulkActionsBar, type BulkField } from '@/components/ui/bulk-actions-bar'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { toast } from 'sonner'
import { EditRolesDialog } from './edit-roles-dialog'
import { EditPermissionsDialog } from './edit-permissions-dialog'
import { MoreHorizontal } from 'lucide-react'
import { exportToCSV } from '@/lib/table-utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PERMISSION_METADATA } from '@/lib/permissions'
import type { OrganizationRoleSummary } from '@/app/actions/staff'

export type StaffRow = {
  id: string
  name: string
  email: string
  avatar: string | null
  phone: string | null
  roleNames: string[]
  permissions: string[]
  lastLoginAt: Date | string | null
  createdAt: Date
}

type StaffTableProps = {
  staff: StaffRow[]
  total?: number
  organizationRoles: OrganizationRoleSummary[]
}

const titleCase = (value: string | null | undefined) => {
  if (!value) return ''
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

const formatDateSafe = (
  date: Date | string | null | undefined,
  preferences?: { timezone: string | null; dateFormat: string | null }
) => {
  if (!date) return 'Never'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return 'Invalid Date'

  const dateFormat = preferences?.dateFormat || 'DD/MM/YYYY'
  const timezone = preferences?.timezone || undefined
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(dateObj)
  const year = parts.find((p) => p.type === 'year')?.value || ''
  const month = parts.find((p) => p.type === 'month')?.value || ''
  const day = parts.find((p) => p.type === 'day')?.value || ''

  switch (dateFormat) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`
  }
}

const STAFF_EXPORT_COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'roleNames', header: 'Roles' },
  { accessorKey: 'permissions', header: 'Permissions' },
  { accessorKey: 'lastLoginAt', header: 'Last Active' },
]

export function StaffTable({ staff, total: serverTotal, organizationRoles }: StaffTableProps) {
  const router = useRouter()
  const t = useTranslations()
  const translate = useCallback(
    (key: string, fallback: string, values?: Record<string, any>) =>
      t(key, { ...values, defaultMessage: fallback }),
    [t]
  )
  const { preferences } = useUserPreferences()
  const [searchFilter, setSearchFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [permissionFilter, setPermissionFilter] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [editRolesStaff, setEditRolesStaff] = useState<StaffRow | null>(null)
  const [editPermissionsStaff, setEditPermissionsStaff] = useState<StaffRow | null>(null)
  const [isBulkSaving, setIsBulkSaving] = useState(false)

  const totalCount = serverTotal ?? staff.length

  const roleOptions = useMemo(
    () =>
      organizationRoles.map((role) => ({
        value: role.name,
        label: titleCase(role.name),
      })),
    [organizationRoles]
  )

  const permissionOptions = useMemo(
    () =>
      Object.entries(PERMISSION_METADATA).map(([value, metadata]) => ({
        value,
        label: metadata.label,
        description: metadata.description,
      })),
    []
  )

  const filteredStaff = useMemo(() => {
    const normalizedSearch = searchFilter.trim().toLowerCase()
    const normalizedRoleFilter = roleFilter.toLowerCase()

    return staff.filter((member) => {
      const searchableSources = [
        member.name || '',
        member.email || '',
        member.phone || '',
        member.roleNames.join(' '),
        member.permissions.join(' '),
      ]

      const matchesSearch = !normalizedSearch
        ? true
        : searchableSources.some((value) =>
            value.toLowerCase().includes(normalizedSearch)
          )

      const matchesRole =
        roleFilter === 'all' ||
        member.roleNames.some(
          (role) => role.toLowerCase() === normalizedRoleFilter
        )

      const matchesPermission =
        permissionFilter === 'all' ||
        member.permissions.includes(permissionFilter)

      return matchesSearch && matchesRole && matchesPermission
    })
  }, [staff, searchFilter, roleFilter, permissionFilter])

  const onNavigateToProfile = useCallback(
    (staffId: string) => {
      router.push(`/dashboard/system-settings/staff/${staffId}`)
    },
    [router]
  )

  const onEditRoles = useCallback((member: StaffRow) => {
    setEditRolesStaff(member)
  }, [])

  const onEditPermissions = useCallback((member: StaffRow) => {
    setEditPermissionsStaff(member)
  }, [])

  const columns = useMemo<ColumnDef<StaffRow>[]>(() => [
    {
      id: 'name',
      accessorKey: 'name',
      header: translate('staff.columns.name', 'Name'),
      size: 280,
      cell: ({ row }) => {
        const member = row.original
        const shouldPriorityLoad = row.index < 8
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              {member.avatar ? (
                <AvatarImage
                  src={member.avatar}
                  alt={member.name}
                  loading={shouldPriorityLoad ? 'eager' : 'lazy'}
                />
              ) : (
                <AvatarFallback>{member.name?.charAt(0) || '?'}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => onNavigateToProfile(member.id)}
                className="text-start font-medium text-foreground hover:text-primary hover:underline"
              >
                {member.name}
              </button>
              <span className="text-sm text-muted-foreground">{member.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      id: 'roleNames',
      accessorKey: 'roleNames',
      enableSorting: false,
      header: translate('staff.columns.roles', 'Roles'),
      cell: ({ row }) => {
        const roles = row.original.roleNames
        if (!roles.length) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.slice(0, 3).map((role) => (
              <Badge key={`${row.original.id}-${role}`} variant="secondary" className="text-xs">
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
      id: 'permissions',
      accessorKey: 'permissions',
      enableSorting: false,
      header: translate('staff.columns.permissions', 'Permissions'),
      cell: ({ row }) => {
        const permissions = row.original.permissions
        if (!permissions.length) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 3).map((perm) => (
              <Badge key={`${row.original.id}-${perm}`} variant="outline" className="text-xs">
                {perm}
              </Badge>
            ))}
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
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.original.email
        if (!email) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <a href={`mailto:${email}`} className="text-sm text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
            {email}
          </a>
        )
      },
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        const phone = row.original.phone
        if (!phone) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <a href={`tel:${phone}`} className="text-sm text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
            {phone}
          </a>
        )
      },
    },
    {
      id: 'lastLoginAt',
      accessorKey: 'lastLoginAt',
      header: translate('staff.columns.lastActive', 'Last Active'),
      cell: ({ row }) => (
        <span className="text-sm" suppressHydrationWarning>
          {formatDateSafe(row.original.lastLoginAt, preferences || undefined)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">{translate('staff.columns.actions', 'Actions')}</span>,
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigateToProfile(member.id)}>
                  {translate('staff.viewProfile', 'View Profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditRoles(member)}>
                  {translate('staff.editRoles', 'Edit Roles')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditPermissions(member)}>
                  {translate('staff.editPermissions', 'Edit Permissions')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ], [translate, onNavigateToProfile, onEditRoles, onEditPermissions, preferences])

  const filterConfig = useMemo(() => {
    const config = [
      {
        key: 'search',
        label: translate('staff.searchLabel', 'Search'),
        type: 'search' as const,
        placeholder: translate('staff.searchPlaceholder', 'Search by name, email, role, or permission'),
      },
    ]

    if (roleOptions.length > 0) {
      config.push({
        key: 'role',
        label: translate('staff.columns.roles', 'Roles'),
        type: 'select' as const,
        options: roleOptions,
        placeholder: translate('staff.allRoles', 'All roles'),
      })
    }

    if (permissionOptions.length > 0) {
      config.push({
        key: 'permission',
        label: translate('staff.columns.permissions', 'Permissions'),
        type: 'select' as const,
        options: permissionOptions.map(({ value, label }) => ({ value, label })),
        placeholder: translate('staff.allPermissions', 'All permissions'),
      })
    }

    return config
  }, [translate, roleOptions, permissionOptions])

  const filterValues = useMemo(() => ({
    search: searchFilter,
    role: roleFilter,
    permission: permissionFilter,
  }), [searchFilter, roleFilter, permissionFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') {
      setSearchFilter(value)
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      return
    }
    if (key === 'role') {
      setRoleFilter(value)
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      return
    }
    if (key === 'permission') {
      setPermissionFilter(value)
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }
  }, [setPagination])

  const tableInstance = useReactTable({
    data: filteredStaff,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnOrder: columnOrder.length ? columnOrder : undefined,
      columnSizing: Object.keys(columnSizing).length ? columnSizing : undefined,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    autoResetPageIndex: false,
  })

  const selectedStaff = tableInstance.getFilteredSelectedRowModel().rows.map((row) => row.original)

  const handleSaveRoles = async (staffId: string, roles: string[]) => {
    const result = await updateStaffRoles(staffId, roles)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(translate('staff.rolesUpdated', 'Roles updated successfully'))
      router.refresh()
      setEditRolesStaff(null)
    }
  }

  const handleSavePermissions = async (staffId: string, permissions: string[]) => {
    const result = await updateStaffPermissions(staffId, permissions)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(translate('staff.permissionsUpdated', 'Permissions updated successfully'))
      router.refresh()
      setEditPermissionsStaff(null)
    }
  }

  const handleBulkSave = async (values: Record<string, string | string[] | null>) => {
    const roleValues = values.roles
    const permissionValues = values.permissions
    const roles = Array.isArray(roleValues)
      ? roleValues
      : roleValues
        ? [roleValues]
        : []
    const permissions = Array.isArray(permissionValues)
      ? permissionValues
      : permissionValues
        ? [permissionValues]
        : []

    if (!roles.length && !permissions.length) {
      toast.error(translate('staff.bulkMissingValues', 'Add at least one value.'))
      return
    }

    if (!selectedStaff.length) {
      toast.error(translate('staff.noSelection', 'Select at least one staff member.'))
      return
    }

    setIsBulkSaving(true)
    try {
      await Promise.all(
        selectedStaff.map(async (member) => {
          if (roles.length) {
            const result = await updateStaffRoles(member.id, roles)
            if (result.error) throw new Error(result.error)
          }
          if (permissions.length) {
            const result = await updateStaffPermissions(member.id, permissions)
            if (result.error) throw new Error(result.error)
          }
        })
      )
      toast.success(translate('staff.bulkUpdated', 'Updated selected staff successfully.'))
      tableInstance.resetRowSelection()
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translate('staff.bulkUpdateFailed', 'Failed to update staff.'))
    } finally {
      setIsBulkSaving(false)
    }
  }

  const handleBulkExportSelected = async (selected: StaffRow[]) => {
    if (!selected.length) return
    try {
      exportToCSV(
        selected.map((member) => ({
          ...member,
          roleNames: member.roleNames.join('; '),
          permissions: member.permissions.join('; '),
        })),
        STAFF_EXPORT_COLUMNS,
        { filename: `staff-selected-${Date.now()}.csv` }
      )
      toast.success(translate('staff.exportComplete', 'Export created for selected staff.'))
    } catch (error) {
      console.error('Failed to export staff selection', error)
      toast.error(translate('staff.exportFailed', 'Failed to export selection.'))
    }
  }

  const bulkFields = useMemo<BulkField[]>(() => {
    const fields: BulkField[] = []

    if (roleOptions.length > 0) {
      fields.push({
        id: 'roles',
        type: 'multi-select',
        placeholder: translate('staff.bulkRolesPlaceholder', 'Assign roles'),
        width: 'w-[220px]',
        options: roleOptions,
      })
    }

    fields.push({
      id: 'permissions',
      type: 'multi-select',
      placeholder: translate('staff.bulkPermissionsPlaceholder', 'Assign permissions'),
      width: 'w-[260px]',
      options: permissionOptions,
    })

    return fields
  }, [roleOptions, permissionOptions, translate])

  const hasBulkFields = bulkFields.length > 0

  const { pageIndex, pageSize } = pagination
  const startRow = filteredStaff.length === 0 ? 0 : pageIndex * pageSize + 1
  const endRow = Math.min(filteredStaff.length, startRow + pageSize - 1)
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize))

  const handlePageSizeChange = (value: string) => {
    const size = Number(value)
    setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
  }

  const pageIndicator = translate('staff.pageIndicator', 'Page {current} of {total}', {
    current: pageIndex + 1,
    total: totalPages,
  })
  const summaryLabel =
    filteredStaff.length === 0
      ? translate('staff.emptyState', 'No staff members found.')
      : `${translate('staff.showingLabel', 'Showing {start}-{end} of {total} team members', {
          start: startRow,
          end: endRow,
          total: filteredStaff.length,
        })} · ${pageIndicator}`

  return (
    <>
      <PageCard
        title={translate('staff.title', 'Staff')}
        description={translate('staff.description', 'Manage team roles, permissions, and contact details.')}
        toolbar={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <DataTableFilters
              filters={filterConfig}
              values={filterValues}
              onFilterChange={handleFilterChange}
            />
            <DataTableColumnManager table={tableInstance} onColumnOrderChange={setColumnOrder} />
            <DataTableExport table={tableInstance} columns={columns} filename="staff" />
          </div>
        }
      >
        <div className="space-y-4">
          {hasBulkFields && selectedStaff.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border/60 bg-card/60">
              <BulkActionsBar
                selectedCount={selectedStaff.length}
                itemLabel={translate('staff.itemLabel', 'staff member')}
                fields={bulkFields}
                onSave={handleBulkSave}
                onClear={() => tableInstance.resetRowSelection()}
                isLoading={isBulkSaving}
                className="border-0 bg-transparent"
              />
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 bg-card/80 px-4 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkExportSelected(selectedStaff)}
                >
                  {translate('staff.exportSelection', 'Export selection')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    const emails = selectedStaff.map((row) => row.email).filter(Boolean)
                    if (!emails.length) {
                      toast.error(translate('staff.noEmailsToCopy', 'None of the selected staff have an email address.'))
                      return
                    }
                    try {
                      await navigator.clipboard.writeText(emails.join(', '))
                      toast.success(translate('staff.emailsCopied', 'Copied emails to clipboard.'))
                    } catch {
                      toast.error(translate('staff.copyFailed', 'Failed to copy emails.'))
                    }
                  }}
                >
                  {translate('staff.copyEmails', 'Copy Emails')}
                </Button>
              </div>
            </div>
          )}

          <DataTable
            data={filteredStaff}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            columnOrder={columnOrder}
            onColumnOrderChange={setColumnOrder}
            columnSizing={columnSizing}
            onColumnSizingChange={setColumnSizing}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            pagination={pagination}
            onPaginationChange={setPagination}
            enableRowSelection
            enableColumnResizing
            enableColumnReordering
            enableColumnVisibility
            enableBulkActions={false}
          />

          <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue placeholder={translate('staff.rowsPerPage', 'Rows per page')} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} {translate('staff.rows', 'rows')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground truncate">{summaryLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))}
                disabled={pageIndex === 0}
              >
                {translate('staff.previous', 'Previous')}
              </Button>
              <span className="text-sm text-muted-foreground">{pageIndicator}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.min(prev.pageIndex + 1, totalPages - 1),
                  }))
                }
                disabled={pageIndex + 1 >= totalPages}
              >
                {translate('staff.next', 'Next')}
              </Button>
            </div>
          </div>
        </div>
      </PageCard>

      {editRolesStaff && (
        <EditRolesDialog
          staff={editRolesStaff}
          open={!!editRolesStaff}
          onOpenChange={(open) => !open && setEditRolesStaff(null)}
          onSave={handleSaveRoles}
          availableRoles={organizationRoles}
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
