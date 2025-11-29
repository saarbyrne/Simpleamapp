import { getStaffData } from '@/app/actions/data-tables'
import { DataTableView } from '@/components/data-management/data-table-view'

export const metadata = {
  title: 'Staff | SAM',
  description: 'Manage staff data',
}

export default async function StaffDataPage() {
  const result = await getStaffData()

  if (result.error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">{result.error}</div>
      </div>
    )
  }

  return (
    <DataTableView
      tableName={result.meta?.tableName || 'Staff'}
      description={result.meta?.description || 'Manage staff data'}
      schema={result.schema || []}
      data={result.data || []}
      dataType="staff"
    />
  )
}
