'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { createTemplate } from '@/app/actions/templates'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

type SubmitTemplateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TEMPLATE_TYPES = [
  { value: 'form', label: 'Form', icon: '📋' },
  { value: 'report', label: 'Report', icon: '📊' },
  { value: 'drawing', label: 'Drawing', icon: '✏️' },
  { value: 'plan', label: 'Plan', icon: '🎯' },
  { value: 'spreadsheet', label: 'Spreadsheet', icon: '📈' },
]

const CATEGORIES = [
  { value: 'wellness', label: 'Wellness' },
  { value: 'performance', label: 'Performance' },
  { value: 'medical', label: 'Medical' },
  { value: 'tactics', label: 'Tactics' },
  { value: 'training', label: 'Training' },
]

const SPORTS = [
  { value: 'football', label: 'Football' },
  { value: 'rugby', label: 'Rugby' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'multi-sport', label: 'Multi-Sport' },
]

const COMMON_FEATURES = [
  'Pre-filled fields',
  'Conditional logic',
  'Custom validation',
  'Mobile-friendly',
  'Print-ready',
  'Data export',
  'Team collaboration',
  'Analytics',
]

export function SubmitTemplateDialog({ open, onOpenChange }: SubmitTemplateDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [category, setCategory] = useState('')
  const [sport, setSport] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)
  const [allowModifications, setAllowModifications] = useState(true)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleToggleFeature = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature))
    } else {
      setFeatures([...features, feature])
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !type || !category || !sport) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createTemplate({
        type,
        name,
        description,
        longDescription: longDescription || undefined,
        category,
        sport,
        tags,
        features,
        config: {}, // Placeholder - would be populated from actual template data
        isPublic,
        allowModifications,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Template submitted successfully!')
        onOpenChange(false)
        router.push('/dashboard/templates/my-templates')
        router.refresh()
        // Reset form
        resetForm()
      }
    } catch (error) {
      toast.error('Failed to submit template')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setType('')
    setName('')
    setDescription('')
    setLongDescription('')
    setCategory('')
    setSport('')
    setTags([])
    setTagInput('')
    setFeatures([])
    setIsPublic(true)
    setAllowModifications(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share a Template</DialogTitle>
          <DialogDescription>
            Help the community by sharing your best work
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 my-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <span className="text-sm font-medium">Type & Basic Info</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <span className="text-sm font-medium">Details</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              3
            </div>
            <span className="text-sm font-medium">Preview & Publish</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>What type of template would you like to share?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {TEMPLATE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`p-4 border-2 rounded-lg text-center transition-all hover:border-primary ${
                        type === t.value ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="text-3xl mb-2">{t.icon}</div>
                      <div className="font-medium">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {type && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Daily Wellness Check"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A brief overview of what this template does (max 200 characters)"
                      maxLength={200}
                      rows={2}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {description.length}/200 characters
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="longDescription">Detailed Description</Label>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Explain when to use this, what it includes, best practices..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sport *</Label>
                  <Select value={sport} onValueChange={setSport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Add tags to help others find this"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ms-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>What&apos;s included?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={features.includes(feature)}
                        onCheckedChange={() => handleToggleFeature(feature)}
                      />
                      <label
                        htmlFor={feature}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Publish */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xl font-bold">{name}</div>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
                  <Badge variant="outline">{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
                  <Badge variant="outline">{sport.charAt(0).toUpperCase() + sport.slice(1)}</Badge>
                </div>
                {longDescription && (
                  <p className="text-sm text-muted-foreground">{longDescription}</p>
                )}
                {features.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2">What&apos;s Included:</div>
                    <ul className="text-sm space-y-1 ms-4">
                      {features.map((feature) => (
                        <li key={feature} className="list-disc">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={isPublic}
                    onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="isPublic"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Make public
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Anyone can discover and use this template
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="allowModifications"
                    checked={allowModifications}
                    onCheckedChange={(checked) => setAllowModifications(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="allowModifications"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Allow modifications
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Users can customize this template (recommended)
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    ℹ️ Your name and organization will be visible to users. Personal data from your organization will NOT be shared.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!type || !name || !description)) ||
                    (step === 2 && (!category || !sport))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish Template'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
