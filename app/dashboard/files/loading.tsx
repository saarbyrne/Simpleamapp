import { TablePageSkeleton } from '@/components/ui/skeleton-wrappers'

/**
 * Files page loading skeleton
 *
 * Matches the files page layout which uses a PageCard with a DataTable internally.
 */
export default function FilesLoading() {
  return <TablePageSkeleton rows={20} />
}

