import { notFound } from 'next/navigation'
import { PlanDetail } from '@/components/planner/plan-detail'
import { getPlan } from '@/app/actions/plans'

type PlanPageProps = {
  params: {
    id: string
  }
}

export default async function PlanPage({ params }: PlanPageProps) {
  const result = await getPlan(params.id)

  if (result.error || !result.plan) {
    notFound()
  }

  return <PlanDetail plan={result.plan} />
}
