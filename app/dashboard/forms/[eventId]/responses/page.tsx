import { getForm, getFormResponses } from '@/app/actions/forms'
import { notFound } from 'next/navigation'
import { FormResponsesTable } from '@/components/dashboard/form-responses-table'

type FormResponsesPageProps = {
  params: {
    eventId: string // Route param name from folder structure
  }
  searchParams: {
    page?: string
    pageSize?: string
  }
}

export default async function FormResponsesPage({ params, searchParams }: FormResponsesPageProps) {
  const formId = params.eventId // Using eventId from route structure (folder name)
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 0
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : 20

  const [formResult, responsesResult] = await Promise.all([
    getForm(formId),
    getFormResponses(formId, page, pageSize),
  ])

  if (formResult.error || !formResult.success) {
    notFound()
  }

  if (responsesResult.error || !responsesResult.success) {
    return (
      <div className="p-6">
        <p className="text-destructive">Failed to load responses: {responsesResult.error}</p>
      </div>
    )
  }

  const { form } = formResult
  const { responses, total } = responsesResult

  return (
    <FormResponsesTable
      form={form}
      responses={responses}
      total={total}
      page={page}
      pageSize={pageSize}
    />
  )
}

