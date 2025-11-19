import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageFrame } from '@/components/dashboard/page-frame'
import { PlansTable } from '@/components/planner/plans-table'
import { CreatePlanDialog } from '@/components/planner/create-plan-dialog'
import { getPlans } from '@/app/actions/plans'

type TemplatesPageProps = {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

async function TemplatesData({ page, pageSize }: { page: number; pageSize: number }) {
  const result = await getPlans(page, pageSize)

  if (result.error) {
    console.error('Error fetching templates:', result.error)
  }

  const { plans = [], total = 0 } = result

  // Filter for templates only
  const templates = plans.filter(plan => plan.isTemplate)

  return <PlansTable plans={templates} total={templates.length} />
}

function TemplatesLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading templates...</div>
      </CardContent>
    </Card>
  )
}

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 0
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : 20

  return (
    <PageFrame>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan Templates</h1>
          <p className="text-muted-foreground">
            Reusable plan templates to quickly start new plans with predefined milestones.
          </p>
        </div>
        <CreatePlanDialog
          defaultValues={{ isTemplate: true }}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          }
        />
      </div>

      <Suspense fallback={<TemplatesLoading />}>
        <TemplatesData page={page} pageSize={pageSize} />
      </Suspense>
    </PageFrame>
  )
}
