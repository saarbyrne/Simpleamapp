'use client'

import { useState, useEffect, useCallback } from 'react'
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
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'rating', label: 'Rating' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
] as const

const CATEGORIES = [
  'Health & Recovery',
  'Coaching',
  'Medical',
  'Education',
  'Performance',
  'General',
] as const

export function FormBuilderDialog({ open, onOpenChange, onSuccess, formId }: FormBuilderDialogProps) {
  const router = useRouter()
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
        toast.error(result.error || 'Failed to load form')
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
      toast.error('Failed to load form')
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }, [formId, onOpenChange])

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
      toast.error('Form name is required')
      return
    }

    if (fields.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    // Validate all fields have labels
    const invalidFields = fields.filter(f => !f.label.trim())
    if (invalidFields.length > 0) {
      toast.error('All fields must have a label')
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
          toast.success('Form updated successfully')
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
          toast.success('Form created successfully')
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
      toast.error(`Failed to ${formId ? 'update' : 'create'} form`)
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
          <DialogTitle>{formId ? 'Edit Form' : 'Create New Form'}</DialogTitle>
          <DialogDescription>
            {formId
              ? 'Update your form fields and settings.'
              : "Build a custom form by adding fields. Configure each field's type, label, and options."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading form...</div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Form Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="formName">Form Name *</Label>
                <Input
                  id="formName"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Wellness Check Survey"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formDescription">Description</Label>
                <Textarea
                  id="formDescription"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Optional description of what this form is for..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Fields</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>

              {fields.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No fields added yet. Click &quot;Add Field&quot; to get started.
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
                            Field {index + 1}
                            {field.label && `: ${field.label}`}
                          </CardTitle>
                          {field.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}
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
                          <Label>Field Type</Label>
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
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Label *</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                            placeholder="Field label"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                          placeholder="Optional placeholder text"
                        />
                      </div>

                      {/* Options for select/checkbox */}
                      {['select', 'checkbox'].includes(field.type) && (
                        <div className="space-y-2">
                          <Label>Options (one per line)</Label>
                          <Textarea
                            value={field.options?.join('\n') || ''}
                            onChange={(e) => {
                              const options = e.target.value
                                .split('\n')
                                .map(o => o.trim())
                                .filter(Boolean)
                              handleUpdateField(index, { options: options.length > 0 ? options : undefined })
                            }}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            rows={3}
                          />
                        </div>
                      )}

                      {/* Min/Max for number/rating */}
                      {['number', 'rating'].includes(field.type) && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Min</Label>
                            <Input
                              type="number"
                              value={field.min ?? ''}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  min: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                              placeholder="Minimum"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max</Label>
                            <Input
                              type="number"
                              value={field.max ?? ''}
                              onChange={(e) =>
                                handleUpdateField(index, {
                                  max: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                              placeholder="Maximum"
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
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`required-${index}`} className="text-sm font-normal cursor-pointer">
                          Required field
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
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? (formId ? 'Updating...' : 'Creating...') : formId ? 'Update Form' : 'Create Form'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

