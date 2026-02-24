'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
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
import { toast } from 'sonner'

interface FormPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formId: string | null
}

export function FormPreviewDialog({ open, onOpenChange, formId }: FormPreviewDialogProps) {
  const t = useTranslations()
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
      toast(t('forms.preview.previewMessage'))
    }, 500)
  }

  const schema = form?.schema as any
  const fields = schema?.fields || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('forms.preview.title')}: {form?.name || t('forms.form')}</DialogTitle>
          <DialogDescription>
            {t('forms.preview.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">{t('forms.preview.loadingForm')}</div>
          ) : !form ? (
            <div className="text-center py-8 text-muted-foreground">{t('forms.preview.formNotFound')}</div>
          ) : fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('forms.preview.noFields')}
            </div>
          ) : (
            <FormRenderer
              fields={fields as FormField[]}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitLabel={t('forms.preview.submitPreview')}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('forms.preview.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

