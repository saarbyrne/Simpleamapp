'use client'

import { useState } from 'react'
import { TemplatesTable, type TemplateRow } from './templates-table'
import { SubmitTemplateDialog } from './submit-template-dialog'

type TemplatesHubWrapperProps = {
  templates: TemplateRow[]
  total?: number
}

export function TemplatesHubWrapper({ templates, total }: TemplatesHubWrapperProps) {
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

  return (
    <>
      <TemplatesTable
        templates={templates}
        total={total}
        onOpenSubmitDialog={() => setSubmitDialogOpen(true)}
      />
      <SubmitTemplateDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
      />
    </>
  )
}
