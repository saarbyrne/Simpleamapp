import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth/cached-user'
import { FilesTable } from '@/components/files/files-table'
import { TablePageSkeleton } from '@/components/ui/skeleton-wrappers'

export default async function FilesPage() {
  const user = await requireUser()

  // Fetch files for the organization
  const files = await prisma.file.findMany({
    where: {
      organizationId: user.organizationId,
    },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      links: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100, // Limit initial load
  })

  const total = await prisma.file.count({
    where: {
      organizationId: user.organizationId,
    },
  })

  return (
    <Suspense fallback={<TablePageSkeleton rows={20} />}>
      <FilesTable files={files} total={total} />
    </Suspense>
  )
}
