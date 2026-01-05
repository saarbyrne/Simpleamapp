import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { FilesTable } from '@/components/files/files-table'
import { redirect } from 'next/navigation'

export default async function FilesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await ensureUserWithOrganization(user)

  // Fetch files for the organization
  const files = await prisma.file.findMany({
    where: {
      organizationId: dbUser.organizationId,
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
      organizationId: dbUser.organizationId,
    },
  })

  return <FilesTable files={files} total={total} />
}
