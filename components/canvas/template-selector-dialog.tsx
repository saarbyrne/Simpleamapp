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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { getDrawingTemplates } from '@/app/actions/drawing-templates'
import { createDrawing } from '@/app/actions/drawings'
import { useRouter } from 'next/navigation'
import { createFootballPitchElement, createPlayerElement } from '@/lib/canvas/sport-elements'

interface TemplateSelectorDialogProps {
  open: boolean
  onClose: () => void
}

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  sport: string
  data: any
  thumbnailUrl: string | null
  downloads: number
  isGlobal: boolean
}

export function TemplateSelectorDialog({
  open,
  onClose,
}: TemplateSelectorDialogProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [drawingName, setDrawingName] = useState('')
  const [drawingDescription, setDrawingDescription] = useState('')
  const [drawingType, setDrawingType] = useState<string>('')
  const [category, setCategory] = useState<string>('all')

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open, category])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const result = await getDrawingTemplates(
        category !== 'all' ? { category } : undefined
      )
      if (result.success && result.templates) {
        setTemplates(result.templates)
      } else {
        toast.error(result.error || 'Failed to load templates')
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!drawingName.trim()) {
      toast.error('Please enter a drawing name')
      return
    }

    setCreating(true)
    try {
      let initialData: any = {
        elements: [],
        appState: {
          viewBackgroundColor: '#2f9e44',
          gridSize: null,
        },
        files: {},
      }

      // If a template is selected, use its data
      if (selectedTemplate) {
        const template = templates.find((t) => t.id === selectedTemplate)
        if (template) {
          initialData = template.data
        }
      }

      const result = await createDrawing({
        name: drawingName,
        description: drawingDescription || undefined,
        type: drawingType || undefined,
        data: initialData,
        templateId: selectedTemplate || undefined,
      })

      if (result.success && result.drawing) {
        toast.success('Drawing created successfully')
        router.push(`/dashboard/canvas/${result.drawing.id}`)
        onClose()
      } else {
        toast.error(result.error || 'Failed to create drawing')
      }
    } catch (error) {
      console.error('Error creating drawing:', error)
      toast.error('Failed to create drawing')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Drawing</DialogTitle>
          <DialogDescription>
            Start from a template or create a blank canvas
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Drawing details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Drawing Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., 4-3-3 High Press"
                  value={drawingName}
                  onChange={(e) => setDrawingName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={drawingType} onValueChange={setDrawingType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="drill">Drill</SelectItem>
                    <SelectItem value="tactics">Tactics</SelectItem>
                    <SelectItem value="set_piece">Set Piece</SelectItem>
                    <SelectItem value="session_plan">Session Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your tactical setup..."
                value={drawingDescription}
                onChange={(e) => setDrawingDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Template selection */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={category} onValueChange={setCategory} className="flex-1 flex flex-col overflow-hidden">
              <TabsList>
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="formation">Formations</TabsTrigger>
                <TabsTrigger value="drill">Drills</TabsTrigger>
                <TabsTrigger value="set_piece">Set Pieces</TabsTrigger>
              </TabsList>

              <TabsContent value={category} className="flex-1 overflow-auto mt-4">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {/* Blank canvas option */}
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedTemplate === null
                          ? 'ring-2 ring-primary'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTemplate(null)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center mb-3">
                          <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-sm">Blank Canvas</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Start from scratch
                        </p>
                      </CardContent>
                    </Card>

                    {/* Template options */}
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'ring-2 ring-primary'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                            {template.thumbnailUrl ? (
                              <img
                                src={template.thumbnailUrl}
                                alt={template.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                              {template.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {template.description}
                                </p>
                              )}
                            </div>
                            {template.isGlobal && (
                              <Badge variant="secondary" className="text-xs">
                                Global
                              </Badge>
                            )}
                          </div>
                          {template.downloads > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Download className="h-3 w-3" />
                              {template.downloads} uses
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Drawing'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
