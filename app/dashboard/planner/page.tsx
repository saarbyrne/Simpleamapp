import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { PlansTable } from '@/components/planner/plans-table'
import { CreatePlanDialog } from '@/components/planner/create-plan-dialog'
import { getPlans } from '@/app/actions/plans'

type PlannerPageProps = {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

async function PlansData({ page, pageSize }: { page: number; pageSize: number }) {
  const result = await getPlans(page, pageSize)

  if (result.error) {
    console.error('Error fetching plans:', result.error)
  }

  const { plans = [], total = 0 } = result

  return <PlansTable plans={plans} total={total} />
}

function PlansLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading plans...</div>
      </CardContent>
    </Card>
  )
}

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 0
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : 20

  return (
    <>
      <PageHeader
        title="Plans"
        description="Create and manage plans for seasons, player development, rehabilitation, and more."
        headerActions={
          <CreatePlanDialog
            trigger={
              <Button>
                <Plus className="me-2 h-4 w-4" />
                Create Plan
              </Button>
            }
          />
        }
        className="mb-6"
      />

      <Suspense fallback={<PlansLoading />}>
        <PlansData page={page} pageSize={pageSize} />
      </Suspense>
    </>
  )
}
