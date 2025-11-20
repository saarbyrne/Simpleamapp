import { Suspense } from 'react'
import { getTemplateById } from '@/app/actions/templates'
import { TemplateDetailView } from '@/components/templates/template-detail-view'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type TemplateDetailPageProps = {
  params: {
    id: string
  }
}

async function TemplateDetailData({ id }: { id: string }) {
  const [session, result] = await Promise.all([
    getServerSession(authOptions),
    getTemplateById(id),
  ])

  if (result.error || !result.template) {
    notFound()
  }

  return (
    <TemplateDetailView template={result.template} currentUserId={session?.user?.id} />
  )
}

function TemplateDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full mt-2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  return (
    <Suspense fallback={<TemplateDetailLoading />}>
      <TemplateDetailData id={params.id} />
    </Suspense>
  )
}
