'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  FileSpreadsheet,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react'
import { TemplateGallery } from '@/components/spreadsheets/template-gallery'
import { getSpreadsheets, getSpreadsheetTemplates, createSpreadsheet, deleteSpreadsheet } from '@/app/actions/spreadsheets'
import { SpreadsheetData, SpreadsheetTemplate, ColumnDefinition } from '@/lib/types/spreadsheet'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function SpreadsheetsPage() {
  const router = useRouter()
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>([])
  const [templates, setTemplates] = useState<SpreadsheetTemplate[]>([])
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load spreadsheets and templates
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [sheetsResult, templatesResult] = await Promise.all([
        getSpreadsheets(),
        getSpreadsheetTemplates(),
      ])

      if (sheetsResult.success && sheetsResult.spreadsheets) {
        setSpreadsheets(sheetsResult.spreadsheets as any)
      }

      if (templatesResult.success && templatesResult.templates) {
        setTemplates(templatesResult.templates as any)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load spreadsheets')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBlank = async () => {
    try {
      const result = await createSpreadsheet({
        name: 'Untitled Spreadsheet',
        description: '',
        schema: [
          { id: 'col1', name: 'Column 1', type: 'text' },
          { id: 'col2', name: 'Column 2', type: 'text' },
        ],
        data: [],
      })

      if (result.success && result.spreadsheet) {
        toast.success('Spreadsheet created')
        router.push(`/dashboard/spreadsheets/${result.spreadsheet.id}`)
      } else {
        toast.error(result.error || 'Failed to create spreadsheet')
      }
    } catch (error) {
      console.error('Error creating spreadsheet:', error)
      toast.error('Failed to create spreadsheet')
    }
  }

  const handleSelectTemplate = async (template: SpreadsheetTemplate) => {
    try {
      const result = await createSpreadsheet({
        name: template.name,
        description: template.description,
        schema: template.schema as ColumnDefinition[],
        data: (template.sampleData || []) as any,
        templateId: template.id,
      })

      if (result.success && result.spreadsheet) {
        toast.success('Spreadsheet created from template')
        router.push(`/dashboard/spreadsheets/${result.spreadsheet.id}`)
      } else {
        toast.error(result.error || 'Failed to create spreadsheet')
      }
    } catch (error) {
      console.error('Error creating from template:', error)
      toast.error('Failed to create spreadsheet')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spreadsheet?')) return

    try {
      const result = await deleteSpreadsheet(id)

      if (result.success) {
        toast.success('Spreadsheet deleted')
        loadData()
      } else {
        toast.error(result.error || 'Failed to delete spreadsheet')
      }
    } catch (error) {
      console.error('Error deleting spreadsheet:', error)
      toast.error('Failed to delete spreadsheet')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading spreadsheets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spreadsheets</h1>
          <p className="text-muted-foreground">
            Track custom data tables with templates, player links, and AI assistance
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
            <Sparkles className="h-4 w-4 me-2" />
            Use Template
          </Button>
          <Button onClick={handleCreateBlank}>
            <Plus className="h-4 w-4 me-2" />
            New Spreadsheet
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {spreadsheets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No spreadsheets yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Create your first spreadsheet to start tracking custom data. Use a template or start from scratch.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
                <Sparkles className="h-4 w-4 me-2" />
                Browse Templates
              </Button>
              <Button onClick={handleCreateBlank}>
                <Plus className="h-4 w-4 me-2" />
                Create Blank
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spreadsheet Grid */}
      {spreadsheets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {spreadsheets.map((sheet) => (
            <Card
              key={sheet.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
              onClick={() => router.push(`/dashboard/spreadsheets/${sheet.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/spreadsheets/${sheet.id}`)
                      }}>
                        <Edit className="h-4 w-4 me-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Implement duplicate
                      }}>
                        <Copy className="h-4 w-4 me-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(sheet.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 me-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg mt-2">{sheet.name}</CardTitle>
                {sheet.description && (
                  <CardDescription className="line-clamp-2">
                    {sheet.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                  <span>{sheet.schema?.length || 0} columns</span>
                  <span>{sheet.data?.length || 0} rows</span>
                  {sheet.version > 1 && (
                    <Badge variant="outline" className="text-xs">
                      v{sheet.version}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 me-1" />
                  {format(new Date(sheet.updatedAt), 'MMM d, yyyy')}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Spreadsheet Templates</DialogTitle>
            <DialogDescription>
              Choose from pre-built templates or start with a blank spreadsheet
            </DialogDescription>
          </DialogHeader>
          <TemplateGallery
            templates={templates}
            onSelectTemplate={(template) => {
              setShowTemplateDialog(false)
              handleSelectTemplate(template)
            }}
            onCreateBlank={() => {
              setShowTemplateDialog(false)
              handleCreateBlank()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
