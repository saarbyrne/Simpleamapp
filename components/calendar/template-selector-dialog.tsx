'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calendar,
  Stethoscope,
  Users,
  Trophy,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { getEventTemplates } from '@/app/actions/event-templates'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EventTemplate {
  id: string
  name: string
  description: string | null
  type: string
  defaultDuration: number
  isGlobal: boolean
  sections: any
  sectionConfigs: any
}

interface TemplateSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (template: EventTemplate) => void
}

const eventTypeConfig = {
  training: { label: 'Training', color: 'bg-blue-500', icon: Users },
  match: { label: 'Match', color: 'bg-green-500', icon: Trophy },
  medical: { label: 'Medical', color: 'bg-red-500', icon: Stethoscope },
  meeting: { label: 'Meeting', color: 'bg-purple-500', icon: Calendar },
  other: { label: 'Other', color: 'bg-gray-500', icon: Calendar },
}

export function TemplateSelectorDialog({
  open,
  onOpenChange,
  onSelect,
}: TemplateSelectorDialogProps) {
  const [templates, setTemplates] = useState<EventTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null)

  useEffect(() => {
    if (open) {
      loadTemplates()
      setSelectedTemplate(null)
    }
  }, [open])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const result = await getEventTemplates()
      if ('error' in result) {
        toast.error(result.error)
      } else {
        setTemplates(result.templates as EventTemplate[])
      }
    } catch (error) {
      toast.error('Failed to load templates')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate)
      onOpenChange(false)
    }
  }

  const getSectionCount = (template: EventTemplate) => {
    const sections = template.sections || {}
    return Object.values(sections).filter(Boolean).length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Choose Event Template
          </DialogTitle>
          <DialogDescription>
            Select a pre-configured template to quickly create your event with all necessary sections.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Templates Available</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first template or use the default templates.
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Create Without Template
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="grid gap-3">
                {templates.map((template) => {
                  const typeConfig = eventTypeConfig[template.type as keyof typeof eventTypeConfig] || eventTypeConfig.other
                  const Icon = typeConfig.icon
                  const isSelected = selectedTemplate?.id === template.id
                  const sectionCount = getSectionCount(template)

                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        'group relative flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card'
                      )}
                    >
                      {/* Icon */}
                      <div className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white',
                        typeConfig.color
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{template.name}</h3>
                            {template.description && (
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {template.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={cn('text-white', typeConfig.color)}>
                            {typeConfig.label}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {template.defaultDuration} min
                          </Badge>
                          {sectionCount > 0 && (
                            <Badge variant="outline">
                              {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
                            </Badge>
                          )}
                          {template.isGlobal && (
                            <Badge variant="secondary">
                              <Sparkles className="mr-1 h-3 w-3" />
                              Global
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedTemplate(null)
                  onSelect(null as any) // Create without template
                  onOpenChange(false)
                }}
              >
                Skip & Create Blank Event
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSelect}
                  disabled={!selectedTemplate}
                >
                  Use Template
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
