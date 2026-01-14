import { Suspense } from 'react'
import { getStaff, getOrganizationRoles } from '@/app/actions/staff'
import { getOrganization } from '@/app/actions/organization'
import { StaffTable } from '@/components/dashboard/staff-table'
import { SystemSettingsTabs } from '@/components/dashboard/system-settings-tabs'
import { Skeleton } from '@/components/ui/skeleton'

function StaffLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}

async function StaffContent() {
  const [staffResult, rolesResult] = await Promise.all([
    getStaff(),
    getOrganizationRoles(),
  ])

  if (staffResult.error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{staffResult.error}</p>
      </div>
    )
  }

  const organizationRoles = Array.isArray(rolesResult.roles) ? rolesResult.roles : []

  return (
    <div className="space-y-4">
      {rolesResult.error && (
        <div className="rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {rolesResult.error}
        </div>
      )}
      <StaffTable
        staff={staffResult.staff || []}
        total={staffResult.staff?.length || 0}
        organizationRoles={organizationRoles}
      />
    </div>
  )
}

export default async function SystemSettingsPage() {
  const orgResult = await getOrganization()

  return (
    <SystemSettingsTabs
      organization={orgResult.data}
      staffContent={
        <Suspense fallback={<StaffLoading />}>
          <StaffContent />
        </Suspense>
      }
    />
  )
}
