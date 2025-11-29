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
    FileSpreadsheet,
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    Clock,
    Sparkles,
    Database,
    Table,
} from 'lucide-react'
import { TemplateGallery } from '@/components/spreadsheets/template-gallery'
import { createSpreadsheet, deleteSpreadsheet } from '@/app/actions/spreadsheets'
import { SpreadsheetData, SpreadsheetTemplate, ColumnDefinition } from '@/lib/types/spreadsheet'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { PageCard } from '@/components/ui/page-card'

type DataManagementClientProps = {
    initialSpreadsheets: SpreadsheetData[]
    initialTemplates: SpreadsheetTemplate[]
    templateParam?: string
}

export function DataManagementClient({
    initialSpreadsheets,
    initialTemplates,
    templateParam
}: DataManagementClientProps) {
    const router = useRouter()
    const t = useTranslations('spreadsheets')
    const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>(initialSpreadsheets)
    const [templates, setTemplates] = useState<SpreadsheetTemplate[]>(initialTemplates)
    const [showTemplateDialog, setShowTemplateDialog] = useState(!!templateParam)

    const handleCreateBlank = async () => {
        try {
            const result = await createSpreadsheet({
                name: t('untitledSpreadsheet'),
                description: '',
                schema: [
                    { id: 'col1', name: t('column1'), type: 'text' },
                    { id: 'col2', name: t('column2'), type: 'text' },
                ],
                data: [],
            })

            if (result.success && result.spreadsheet) {
                toast.success(t('spreadsheetCreated'))
                router.push(`/dashboard/data-management/${result.spreadsheet.id}`)
            } else {
                toast.error(result.error || t('failedToCreateSpreadsheet'))
            }
        } catch (error) {
            console.error('Error creating spreadsheet:', error)
            toast.error(t('failedToCreateSpreadsheet'))
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
                toast.success(t('spreadsheetCreatedFromTemplate'))
                router.push(`/dashboard/data-management/${result.spreadsheet.id}`)
            } else {
                toast.error(result.error || t('failedToCreateSpreadsheet'))
            }
        } catch (error) {
            console.error('Error creating from template:', error)
            toast.error(t('failedToCreateSpreadsheet'))
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(t('deleteConfirmation'))) return

        try {
            const result = await deleteSpreadsheet(id)

            if (result.success) {
                toast.success(t('spreadsheetDeleted'))
                setSpreadsheets(prev => prev.filter(s => s.id !== id))
            } else {
                toast.error(result.error || t('failedToDeleteSpreadsheet'))
            }
        } catch (error) {
            console.error('Error deleting spreadsheet:', error)
            toast.error(t('failedToDeleteSpreadsheet'))
        }
    }

    return (
        <div className="container mx-auto py-8">
            <PageCard
                title="Data Management"
                description="Manage your organization's data tables, schema, and historical records. Use spreadsheets as an interface to your database."
                headerActions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
                            <Sparkles className="h-4 w-4 me-2" />
                            {t('useTemplate')}
                        </Button>
                        <Button onClick={handleCreateBlank}>
                            <Plus className="h-4 w-4 me-2" />
                            New Data Table
                        </Button>
                    </div>
                }
            >
                {spreadsheets.length === 0 ? (
                    <div className="text-center py-12">
                        <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Data Tables Found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Create your first data table to start tracking custom data. You can use templates or start from scratch.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
                                <Sparkles className="h-4 w-4 me-2" />
                                {t('browseTemplates')}
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
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/dashboard/data-management/${sheet.id}`)
                                                }}>
                                                    <Edit className="h-4 w-4 me-2" />
                                                    {t('edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation()
                                                    // TODO: Implement duplicate
                                                }}>
                                                    <Copy className="h-4 w-4 me-2" />
                                                    {t('duplicate')}
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
                                                    {t('delete')}
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
                                        <span>{sheet.schema?.length || 0} {t('columns')}</span>
                                        <span>{sheet.data?.length || 0} {t('rows')}</span>
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
                        <DialogTitle>{t('templates.title')}</DialogTitle>
                        <DialogDescription>
                            {t('templates.description')}
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
