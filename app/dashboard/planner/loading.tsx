import { CardListSkeleton } from '@/components/ui/skeleton-wrappers'

export default function PlannerLoading() {
  return <CardListSkeleton count={4} showFilters={true} />
}
