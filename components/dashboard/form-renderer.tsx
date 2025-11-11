'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { type FormField as FormFieldType } from '@/app/actions/forms'
import { useMemo } from 'react'

interface FormRendererProps {
  fields: FormFieldType[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  defaultValues?: Record<string, any>
  isLoading?: boolean
  submitLabel?: string
}

export function FormRenderer({
  fields,
  onSubmit,
  defaultValues = {},
  isLoading = false,
  submitLabel = 'Submit',
}: FormRendererProps) {
  const t = useTranslations()
  const defaultSubmitLabel = submitLabel || t('common.submit')
  // Build Zod schema from fields
  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {}
    
    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny
      
      switch (field.type) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string()
          break
        case 'number':
        case 'rating':
          let numberSchema = z.number()
          if (field.min !== undefined) {
            numberSchema = numberSchema.min(field.min)
          }
          if (field.max !== undefined) {
            numberSchema = numberSchema.max(field.max)
          }
          fieldSchema = numberSchema
          break
        case 'select':
          fieldSchema = z.string()
          if (field.options && field.options.length > 0) {
            fieldSchema = z.enum(field.options as [string, ...string[]])
          }
          break
        case 'checkbox':
          fieldSchema = z.array(z.string())
          break
        case 'date':
          fieldSchema = z.date()
          break
        case 'time':
          fieldSchema = z.string()
          break
        default:
          fieldSchema = z.string()
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional()
      } else {
        if (field.type === 'text' || field.type === 'textarea') {
          // TypeScript needs explicit narrowing for string schema
          const stringSchema = fieldSchema as z.ZodString
          fieldSchema = stringSchema.min(1, `${field.label} is required`)
        }
      }
      
      shape[field.id] = fieldSchema
    })
    
    return z.object(shape)
  }, [fields])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleSubmit = async (data: Record<string, any>) => {
    await onSubmit(data)
  }

  // Helper function to render field control - ensures FormControl receives exactly one child
  const renderFieldControl = (field: FormFieldType, formField: any) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            {...formField}
            placeholder={field.placeholder}
            type="text"
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            {...formField}
            placeholder={field.placeholder}
            rows={4}
          />
        )
      
      case 'number':
        return (
          <Input
            {...formField}
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            onChange={(e) => formField.onChange(e.target.value ? Number(e.target.value) : undefined)}
          />
        )
      
      case 'rating':
        return (
          <div className="space-y-2">
            <Slider
              value={[formField.value || field.min || 0]}
              onValueChange={(value) => formField.onChange(value[0])}
              min={field.min || 0}
              max={field.max || 10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{field.min || 0}</span>
              <span className="font-medium">{formField.value || field.min || 0}</span>
              <span>{field.max || 10}</span>
            </div>
          </div>
        )
      
      case 'select':
        if (!field.options) {
          return (
            <Input
              {...formField}
              placeholder={field.placeholder || 'Select field - no options configured'}
              type="text"
              disabled
            />
          )
        }
        return (
          <Select
            value={formField.value}
            onValueChange={formField.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'checkbox':
        if (!field.options) {
          return (
            <div className="text-sm text-muted-foreground">
              Checkbox field - no options configured
            </div>
          )
        }
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={(formField.value as string[] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = (formField.value as string[] || [])
                    if (checked) {
                      formField.onChange([...current, option])
                    } else {
                      formField.onChange(current.filter(v => v !== option))
                    }
                  }}
                />
                <Label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )
      
      case 'date':
        return (
          <DatePicker
            date={formField.value}
            onSelect={formField.onChange}
            placeholder={field.placeholder || 'Pick a date'}
          />
        )
      
      case 'time':
        return (
          <TimePicker
            time={formField.value}
            onSelect={formField.onChange}
            placeholder={field.placeholder || 'Select time'}
          />
        )
      
      default:
        return (
          <Input
            {...formField}
            placeholder={field.placeholder}
            type="text"
          />
        )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-destructive ms-1">*</span>}
                </FormLabel>
                <FormControl>
                  {renderFieldControl(field, formField)}
                </FormControl>
                {field.placeholder && (
                  <FormDescription>{field.placeholder}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? t('common.submitting') : defaultSubmitLabel}
        </Button>
      </form>
    </Form>
  )
}

