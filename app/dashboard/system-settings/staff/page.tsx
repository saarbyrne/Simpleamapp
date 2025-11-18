import { Suspense } from 'react'
import { getStaff } from '@/app/actions/staff'
import { StaffTable } from '@/components/dashboard/staff-table'
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

async function StaffData() {
  const result = await getStaff()

  if (result.error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          {result.error}
        </p>
      </div>
    )
  }

  if (!result.staff || !Array.isArray(result.staff)) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load staff
        </p>
      </div>
    )
  }

  return <StaffTable staff={result.staff} total={result.staff.length} />
}

export default async function StaffPage() {
  return (
    <Suspense fallback={<StaffLoading />}>
      <StaffData />
    </Suspense>
  )
}
