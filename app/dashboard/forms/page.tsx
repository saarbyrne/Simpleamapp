import { FormsTable, type FormRow } from '@/components/dashboard/forms-table'
import { getForms } from '@/app/actions/forms'

type FormsPageProps = {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

// ISR: Regenerate page every 10 minutes for forms data
export const revalidate = 600

export default async function FormsPage({ searchParams }: FormsPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 0
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : 20

  const result = await getForms(page, pageSize)

  // Handle errors
  if (result.error) {
    console.error('Error fetching forms:', result.error)
  }

  const { forms = [], total = 0 } = result

  // Map database forms to FormRow format
  const formRows: FormRow[] = forms.map((form) => {
    // Determine status based on isActive
    const status = form.isActive ? 'Active' : 'Draft'

    // Get owner name from organization or use "System"
    const owner = form.organization?.name || 'System'

    // Extract category from schema metadata or template or use default
    const schema = form.schema as any
    const category = schema?.category || form.template?.category || 'General'

    return {
      id: form.id,
      title: form.name,
      category,
      status,
      responses: form._count?.responses || 0,
      updated: form.updatedAt,
      owner,
    }
  })

  return <FormsTable forms={formRows} total={total} />
}
