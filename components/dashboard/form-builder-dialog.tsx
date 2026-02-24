'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react'
import { createForm, updateForm, getForm, type FormField } from '@/app/actions/forms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FormBuilderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  formId?: string | null // If provided, edit mode
}

const FIELD_TYPES = [
  { value: 'text', labelKey: 'forms.fieldTypes.text' },
  { value: 'textarea', labelKey: 'forms.fieldTypes.textarea' },
  { value: 'number', labelKey: 'forms.fieldTypes.number' },
  { value: 'rating', labelKey: 'forms.fieldTypes.rating' },
  { value: 'select', labelKey: 'forms.fieldTypes.select' },
  { value: 'checkbox', labelKey: 'forms.fieldTypes.checkbox' },
  { value: 'date', labelKey: 'forms.fieldTypes.date' },
  { value: 'time', labelKey: 'forms.fieldTypes.time' },
] as const

const CATEGORIES = [
  { value: 'Health & Recovery', key: 'forms.categories.healthRecovery' },
  { value: 'Coaching', key: 'forms.categories.coaching' },
  { value: 'Medical', key: 'forms.categories.medical' },
  { value: 'Education', key: 'forms.categories.education' },
  { value: 'Performance', key: 'forms.categories.performance' },
  { value: 'General', key: 'forms.categories.general' },
] as const

export function FormBuilderDialog({ open, onOpenChange, onSuccess, formId }: FormBuilderDialogProps) {
  const router = useRouter()
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [category, setCategory] = useState<string>('General')
  const [fields, setFields] = useState<FormField[]>([])
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null)

  // Load form data when editing
  const loadForm = useCallback(async () => {
    if (!formId) return
    setIsLoading(true)
    try {
      const result = await getForm(formId)
      if (result.error || !result.success) {
        toast.error(result.error || t('forms.builder.failedToLoad'))
        onOpenChange(false)
      } else {
        const form = result.form
        setFormName(form.name)
        setFormDescription(form.description || '')
        const schema = form.schema as any
        setCategory(schema?.category || 'General')
        setFields(schema?.fields || [])
      }
    } catch (error) {
      console.error('Error loading form:', error)
      toast.error(t('forms.builder.failedToLoad'))
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }, [formId, onOpenChange, t])

  useEffect(() => {
    if (open && formId) {
      loadForm()
    } else if (open && !formId) {
      // Reset form for new form
      setFormName('')
      setFormDescription('')
      setCategory('General')
      setFields([])
      setEditingFieldIndex(null)
    }
  }, [open, formId, loadForm])

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
    }
    setFields([...fields, newField])
    setEditingFieldIndex(fields.length)
  }

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...fields]
    updatedFields[index] = { ...updatedFields[index], ...updates }
    setFields(updatedFields)
  }

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
    if (editingFieldIndex === index) {
      setEditingFieldIndex(null)
    } else if (editingFieldIndex !== null && editingFieldIndex > index) {
      setEditingFieldIndex(editingFieldIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error(t('forms.builder.formNameRequiredError'))
      return
    }

    if (fields.length === 0) {
      toast.error(t('forms.builder.addAtLeastOneField'))
      return
    }

    // Validate all fields have labels
    const invalidFields = fields.filter(f => !f.label.trim())
    if (invalidFields.length > 0) {
      toast.error(t('forms.builder.allFieldsMustHaveLabel'))
      return
    }

    setIsSubmitting(true)
    try {
      if (formId) {
        // Update existing form
        const schema = {
          fields,
          category,
        }
        const result = await updateForm(formId, {
          name: formName,
          description: formDescription || undefined,
          schema: schema as any,
        })

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(t('forms.builder.formSaved'))
          onOpenChange(false)
          router.refresh()
          onSuccess?.()
        }
      } else {
        // Create new form
        const result = await createForm({
          name: formName,
          description: formDescription || undefined,
          category,
          schema: fields,
        })

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(t('forms.builder.formSaved'))
          // Reset form
          setFormName('')
          setFormDescription('')
          setCategory('General')
          setFields([])
          setEditingFieldIndex(null)
          onOpenChange(false)
          router.refresh()
          onSuccess?.()
        }
      }
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error(t('forms.builder.failedToSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormName('')
      setFormDescription('')
      setCategory('General')
      setFields([])
      setEditingFieldIndex(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formId ? t('forms.builder.editForm') : t('forms.builder.createNewForm')}</DialogTitle>
          <DialogDescription>
            {formId
              ? t('forms.builder.updateDescription')
              : t('forms.builder.buildDescription')}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">{t('forms.builder.loadingForm')}</div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Form Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="formName">{t('forms.builder.formNameRequired')}</Label>
                <Input
                  id="formName"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('forms.builder.formNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formDescription">{t('forms.builder.description')}</Label>
                <Textarea
                  id="formDescription"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={t('forms.builder.descriptionPlaceholder')}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('forms.category')}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('forms.builder.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {t(cat.key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('forms.builder.fields')}</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
                  <Plus className="me-2 h-4 w-4" />
                  {t('forms.builder.addField')}
                </Button>
              </div>

              {fields.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    {t('forms.builder.noFieldsAdded')}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm">
                            {t('forms.builder.field')} {index + 1}
                            {field.label && `: ${field.label}`}
                          </CardTitle>
                          {field.required && (
                            <Badge variant="secondary" className="text-xs">
                              {t('forms.builder.required')}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {FIELD_TYPES.find(type => type.value === field.type) ? t(FIELD_TYPES.find(type => type.value === field.type)!.labelKey) : field.type}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>{t('forms.builder.fieldType')}</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) =>
                              handleUpdateField(index, {
                                type: value as FormField['type'],
                                // Clear options if switching away from select/checkbox
                                options: ['select', 'checkbox'].includes(value) ? field.options : undefined,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {t(type.labelKey)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('forms.builder.labelRequired')}</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                            placeholder={t('forms.builder.labelPlaceholder')}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('forms.builder.placeholder')}</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                          placeholder={t('forms.builder.placeholderPlaceholder')}
                        />
                      </div>

                      {/* Options for select/checkbox */}
                      {['select', 'checkbox'].includes(field.type) && (
                        <div className="space-y-2">
                          <Label>{t('forms.builder.options')}</Label>
                          <Textarea
                            value={field.options?.join('\n') || ''}
                            onChange={(e) => {
                              const options = e.target.value
                                .split('\n')
                                .map(o => o.trim())
                                .filter(Boolean)
                              handleUpdateField(index, { options: options.length > 0 ? options : undefined })
                            }}
                            placeholder={t('forms.builder.optionsPlaceholder')}
                            rows={3}
                          />
                        </div>
                      )}

                      {/* Min/Max for number/rating */}
                      {['number', 'rating'].includes(field.type) && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>{t('forms.builder.min')}</Label>
                            <Input
                              type="number"
                              value={field.min ?? ''}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  min: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                              placeholder={t('forms.builder.min')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t('forms.builder.max')}</Label>
                            <Input
                              type="number"
                              value={field.max ?? ''}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  max: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                              placeholder={t('forms.builder.max')}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={field.required || false}
                          onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label htmlFor={`required-${index}`} className="text-sm font-normal cursor-pointer">
                          {t('forms.builder.required')}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

      <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('forms.builder.cancel')}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? (formId ? t('forms.builder.updating') : t('forms.builder.creating')) : formId ? t('forms.builder.updateForm') : t('forms.builder.createForm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

