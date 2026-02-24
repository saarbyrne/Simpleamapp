'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Sparkles, FileSpreadsheet, Upload } from 'lucide-react'
import { TemplateGallery } from '@/components/spreadsheets/template-gallery'
import { FolderSidebar } from '@/components/spreadsheets/folder-sidebar'
import { SpreadsheetFilters, ViewMode, SortOption } from '@/components/spreadsheets/spreadsheet-filters'
import { SpreadsheetCard } from '@/components/spreadsheets/spreadsheet-card'
import {
  createSpreadsheet,
  deleteSpreadsheet,
  toggleSpreadsheetStar,
} from '@/app/actions/spreadsheets'
import { getSpreadsheetFolders } from '@/app/actions/spreadsheet-folders'
import { moveSpreadsheetToFolder } from '@/app/actions/spreadsheet-folders'
import { SpreadsheetData, SpreadsheetTemplate, ColumnDefinition, SpreadsheetFolder } from '@/lib/types/spreadsheet'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useConfirmDialog } from '@/components/ui/confirm-dialog'
import { PageCard } from '@/components/ui/page-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SpreadsheetsClientProps = {
  initialSpreadsheets: SpreadsheetData[]
  initialFolders: (SpreadsheetFolder & { _count?: { spreadsheets: number } })[]
  initialTemplates: SpreadsheetTemplate[]
  templateParam?: string
}

export function SpreadsheetsClientNew({
  initialSpreadsheets,
  initialFolders,
  initialTemplates,
  templateParam
}: SpreadsheetsClientProps) {
  const router = useRouter()
  const t = useTranslations('spreadsheets')

  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>(initialSpreadsheets)
  const [folders, setFolders] = useState<(SpreadsheetFolder & { _count?: { spreadsheets: number } })[]>(initialFolders)
  const [templates, setTemplates] = useState<SpreadsheetTemplate[]>(initialTemplates)

  const [showTemplateDialog, setShowTemplateDialog] = useState(!!templateParam)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [movingSpreadsheetId, setMovingSpreadsheetId] = useState<string | null>(null)

  // Filters
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [ConfirmDialogEl, confirmAction] = useConfirmDialog()
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showStarred, setShowStarred] = useState(false)

  // Get all unique tags from spreadsheets
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    spreadsheets.forEach(s => s.tags?.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  }, [spreadsheets])

  // Filter and sort spreadsheets
  const filteredSpreadsheets = useMemo(() => {
    let filtered = spreadsheets

    // Filter by folder
    if (selectedFolderId) {
      filtered = filtered.filter(s => s.folderId === selectedFolderId)
    }

    // Filter by starred
    if (showStarred) {
      filtered = filtered.filter(s => s.starred)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(s =>
        s.tags?.some(tag => selectedTags.includes(tag))
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'recent':
        default:
          return new Date(b.lastOpenedAt || b.updatedAt).getTime() - new Date(a.lastOpenedAt || a.updatedAt).getTime()
      }
    })

    return sorted
  }, [spreadsheets, selectedFolderId, searchQuery, sortBy, selectedTags, showStarred])

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
        router.push(`/dashboard/spreadsheets/${result.spreadsheet.id}`)
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
        router.push(`/dashboard/spreadsheets/${result.spreadsheet.id}`)
      } else {
        toast.error(result.error || t('failedToCreateSpreadsheet'))
      }
    } catch (error) {
      console.error('Error creating from template:', error)
      toast.error(t('failedToCreateSpreadsheet'))
    }
  }

  const handleDelete = async (id: string) => {
    const ok = await confirmAction({
      title: t('deleteConfirmation'),
      description: t('failedToDeleteSpreadsheet'),
      confirmLabel: t('delete', { defaultValue: 'Delete' }),
    })
    if (!ok) return

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

  const handleToggleStar = async (id: string, starred: boolean) => {
    try {
      const result = await toggleSpreadsheetStar(id, starred)

      if (result.success) {
        setSpreadsheets(prev =>
          prev.map(s => s.id === id ? { ...s, starred } : s)
        )
      } else {
        toast.error(result.error || 'Failed to update')
      }
    } catch (error) {
      console.error('Error toggling star:', error)
      toast.error('An error occurred')
    }
  }

  const handleMove = (id: string) => {
    setMovingSpreadsheetId(id)
    setShowMoveDialog(true)
  }

  const handleMoveConfirm = async (targetFolderId: string | null) => {
    if (!movingSpreadsheetId) return

    try {
      const result = await moveSpreadsheetToFolder(movingSpreadsheetId, targetFolderId)

      if (result.success) {
        toast.success('Spreadsheet moved successfully')
        // Refresh the page to update folder counts
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to move spreadsheet')
      }
    } catch (error) {
      console.error('Error moving spreadsheet:', error)
      toast.error('An error occurred')
    } finally {
      setShowMoveDialog(false)
      setMovingSpreadsheetId(null)
    }
  }

  const refreshFolders = async () => {
    const result = await getSpreadsheetFolders()
    if (result.success && result.folders) {
      const mappedFolders = result.folders.map(folder => ({
        id: folder.id,
        name: folder.name,
        description: folder.description || undefined,
        icon: folder.icon || undefined,
        color: folder.color || undefined,
        parentId: folder.parentId || undefined,
        organizationId: folder.organizationId,
        sortOrder: folder.sortOrder,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        spreadsheetCount: folder.spreadsheetCount,
        _count: folder._count,
      }))
      setFolders(mappedFolders)
    }
  }

  return (
    <div className="flex h-full gap-4">
      {ConfirmDialogEl}
      {/* Folder Sidebar */}
      <FolderSidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onFoldersChange={() => router.refresh()}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8">
          <PageCard
            variant="table"
            title={t('title')}
            description={t('description')}
            headerActions={
              <div className="flex gap-2">
                <Button onClick={handleCreateBlank}>
                  <Plus className="h-4 w-4 me-2" />
                  {t('newSpreadsheet')}
                </Button>
              </div>
            }
          >
            {/* Filters */}
            <div className="mb-6">
              <SpreadsheetFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedTags={selectedTags}
                availableTags={availableTags}
                onTagsChange={setSelectedTags}
                showStarred={showStarred}
                onShowStarredChange={setShowStarred}
              />
            </div>

            {/* Spreadsheets Grid/List */}
            {filteredSpreadsheets.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery || selectedTags.length > 0 || showStarred
                    ? 'No spreadsheets found'
                    : t('noSpreadsheets')}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || selectedTags.length > 0 || showStarred
                    ? 'Try adjusting your filters'
                    : t('noSpreadsheetsDescription')}
                </p>
                {!searchQuery && selectedTags.length === 0 && !showStarred && (
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleCreateBlank}>
                      <Plus className="h-4 w-4 me-2" />
                      {t('createBlank')}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-3'}>
                {filteredSpreadsheets.map((sheet) => (
                  <SpreadsheetCard
                    key={sheet.id}
                    spreadsheet={sheet}
                    onEdit={(id) => router.push(`/dashboard/spreadsheets/${id}`)}
                    onDelete={handleDelete}
                    onToggleStar={handleToggleStar}
                    onMove={handleMove}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </PageCard>
        </div>
      </div>

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

      {/* Move to Folder Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
            <DialogDescription>
              Select a folder to move this spreadsheet to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={(value) => handleMoveConfirm(value === 'none' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.icon} {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
