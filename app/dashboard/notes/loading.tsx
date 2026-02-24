import { CardListSkeleton } from '@/components/ui/skeleton-wrappers'

export default function NotesLoading() {
  return <CardListSkeleton count={6} showFilters={true} />
}
