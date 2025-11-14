import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getStaffMember, getStaffStats } from '@/app/actions/staff'
import { StaffProfile } from '@/components/dashboard/staff-profile'
import { Skeleton } from '@/components/ui/skeleton'

function StaffProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}

async function StaffProfileData({ id }: { id: string }) {
  const [memberResult, statsResult] = await Promise.all([
    getStaffMember(id),
    getStaffStats(id),
  ])

  if (memberResult.error || !memberResult.staffMember) {
    notFound()
  }

  return (
    <StaffProfile
      staff={memberResult.staffMember}
      stats={statsResult.stats || null}
    />
  )
}

export default async function StaffMemberPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<StaffProfileLoading />}>
      <StaffProfileData id={params.id} />
    </Suspense>
  )
}
