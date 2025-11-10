'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormRenderer } from '@/components/dashboard/form-renderer'
import { getForm, type FormField } from '@/app/actions/forms'
import { Button } from '@/components/ui/button'

interface FormPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formId: string | null
}

export function FormPreviewDialog({ open, onOpenChange, formId }: FormPreviewDialogProps) {
  const [form, setForm] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadForm = useCallback(async () => {
    if (!formId) return
    setIsLoading(true)
    try {
      const result = await getForm(formId)
      if (result.error || !result.success) {
        console.error('Error loading form:', result.error)
      } else {
        setForm(result.form)
      }
    } catch (error) {
      console.error('Error loading form:', error)
    } finally {
      setIsLoading(false)
    }
  }, [formId])

  useEffect(() => {
    if (open && formId) {
      loadForm()
    } else {
      setForm(null)
    }
  }, [open, formId, loadForm])

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    // In preview mode, we just log the data
    console.log('Form preview submission:', data)
    setTimeout(() => {
      setIsSubmitting(false)
      alert('This is a preview. Form data would be submitted in the actual form.')
    }, 500)
  }

  const schema = form?.schema as any
  const fields = schema?.fields || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {form?.name || 'Form'}</DialogTitle>
          <DialogDescription>
            This is how the form will appear to users. You can fill it out to test the fields.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading form...</div>
          ) : !form ? (
            <div className="text-center py-8 text-muted-foreground">Form not found</div>
          ) : fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              This form has no fields yet.
            </div>
          ) : (
            <FormRenderer
              fields={fields as FormField[]}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitLabel="Submit (Preview)"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

