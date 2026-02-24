'use client'

import { useState } from 'react'
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
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Clock,
  Sparkles,
  Table,
  ArrowLeft,
} from 'lucide-react'
import { TemplateGallery } from '@/components/spreadsheets/template-gallery'
import { createSpreadsheet, deleteSpreadsheet } from '@/app/actions/spreadsheets'
import { SpreadsheetData, SpreadsheetTemplate, ColumnDefinition } from '@/lib/types/spreadsheet'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useConfirmDialog } from '@/components/ui/confirm-dialog'
import { PageCard } from '@/components/ui/page-card'

type CustomTablesClientProps = {
  initialSpreadsheets: SpreadsheetData[]
  initialTemplates: SpreadsheetTemplate[]
  templateParam?: string
}

export function CustomTablesClient({
  initialSpreadsheets,
  initialTemplates,
  templateParam,
}: CustomTablesClientProps) {
  const router = useRouter()
  const t = useTranslations('spreadsheets')
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>(initialSpreadsheets)
  const [templates, setTemplates] = useState<SpreadsheetTemplate[]>(initialTemplates)
  const [showTemplateDialog, setShowTemplateDialog] = useState(!!templateParam)
  const [ConfirmDialogEl, confirmAction] = useConfirmDialog()

  const handleCreateBlank = async () => {
    try {
      const result = await createSpreadsheet({
        name: 'Untitled Custom Table',
        description: '',
        schema: [
          { id: 'col1', name: 'Column 1', type: 'text' },
          { id: 'col2', name: 'Column 2', type: 'text' },
        ],
        data: [],
      })

      if (result.success && result.spreadsheet) {
        toast.success('Custom table created')
        router.push(`/dashboard/data-management/${result.spreadsheet.id}`)
      } else {
        toast.error(result.error || 'Failed to create custom table')
      }
    } catch (error) {
      console.error('Error creating custom table:', error)
      toast.error('Failed to create custom table')
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
        toast.success('Custom table created from template')
        router.push(`/dashboard/data-management/${result.spreadsheet.id}`)
      } else {
        toast.error(result.error || 'Failed to create custom table')
      }
    } catch (error) {
      console.error('Error creating from template:', error)
      toast.error('Failed to create custom table')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirmAction({
      title: `Move "${name}" to trash?`,
      description: 'You can restore it within 30 days.',
      confirmLabel: 'Move to trash',
    })
    if (!ok) return

    try {
      const result = await deleteSpreadsheet(id)

      if (result.success) {
        toast.success('Moved to trash')
        setSpreadsheets((prev) => prev.filter((s) => s.id !== id))
      } else {
        toast.error(result.error || 'Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="container mx-auto py-8">
      {ConfirmDialogEl}
      <PageCard
        variant="table"
        title="Custom Data Tables"
        description="Create flexible spreadsheets for any data that doesn't fit into standard categories. All changes are tracked and reversible."
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/data-management')}
            >
              <ArrowLeft className="h-4 w-4 me-2" />
              Back
            </Button>
            <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
              <Sparkles className="h-4 w-4 me-2" />
              Use Template
            </Button>
            <Button onClick={handleCreateBlank}>
              <Plus className="h-4 w-4 me-2" />
              New Custom Table
            </Button>
          </div>
        }
      >
        {spreadsheets.length === 0 ? (
          <div className="text-center py-12">
            <Table className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Custom Tables Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create custom spreadsheets for tracking weekly loads, nutrition data, custom metrics,
              or any other data your organization needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
                <Sparkles className="h-4 w-4 me-2" />
                Browse Templates
              </Button>
              <Button onClick={handleCreateBlank}>
                <Plus className="h-4 w-4 me-2" />
                Create Blank Table
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {spreadsheets.map((sheet) => (
              <Card
                key={sheet.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                onClick={() => router.push(`/dashboard/data-management/${sheet.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Table className="h-8 w-8 text-muted-foreground" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/data-management/${sheet.id}`)
                          }}
                        >
                          <Edit className="h-4 w-4 me-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Implement duplicate
                          }}
                        >
                          <Copy className="h-4 w-4 me-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(sheet.id, sheet.name)
                          }}
                        >
                          <Trash2 className="h-4 w-4 me-2" />
                          Move to Trash
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
      </PageCard>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Custom Table Templates</DialogTitle>
            <DialogDescription>
              Choose a template to get started quickly with common data structures
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
