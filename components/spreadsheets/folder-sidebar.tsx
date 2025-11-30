'use client'

import { useState } from 'react'
import { SpreadsheetFolder } from '@/lib/types/spreadsheet'
import { Button } from '@/components/ui/button'
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FolderPlus,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  createSpreadsheetFolder,
  updateSpreadsheetFolder,
  deleteSpreadsheetFolder,
} from '@/app/actions/spreadsheet-folders'
import { toast } from 'sonner'

type FolderSidebarProps = {
  folders: (SpreadsheetFolder & { _count?: { spreadsheets: number } })[]
  selectedFolderId?: string | null
  onSelectFolder: (folderId: string | null) => void
  onFoldersChange?: () => void
}

type FolderDialogMode = 'create' | 'edit' | null

export function FolderSidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onFoldersChange,
}: FolderSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [dialogMode, setDialogMode] = useState<FolderDialogMode>(null)
  const [editingFolder, setEditingFolder] = useState<SpreadsheetFolder | null>(null)
  const [parentId, setParentId] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
  })

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const openCreateDialog = (parentFolderId?: string) => {
    setFormData({ name: '', description: '', icon: '📁', color: '' })
    setParentId(parentFolderId)
    setEditingFolder(null)
    setDialogMode('create')
  }

  const openEditDialog = (folder: SpreadsheetFolder) => {
    setFormData({
      name: folder.name,
      description: folder.description || '',
      icon: folder.icon || '📁',
      color: folder.color || '',
    })
    setEditingFolder(folder)
    setDialogMode('edit')
  }

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        const result = await createSpreadsheetFolder({
          ...formData,
          parentId,
        })
        if (result.success) {
          toast.success('Folder created successfully')
          onFoldersChange?.()
        } else {
          toast.error(result.error || 'Failed to create folder')
        }
      } else if (dialogMode === 'edit' && editingFolder) {
        const result = await updateSpreadsheetFolder(editingFolder.id, formData)
        if (result.success) {
          toast.success('Folder updated successfully')
          onFoldersChange?.()
        } else {
          toast.error(result.error || 'Failed to update folder')
        }
      }
      setDialogMode(null)
    } catch (error) {
      console.error('Error with folder:', error)
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (folder: SpreadsheetFolder) => {
    if (!confirm(`Delete folder "${folder.name}"? Spreadsheets will be moved to root.`)) {
      return
    }

    try {
      const result = await deleteSpreadsheetFolder(folder.id)
      if (result.success) {
        toast.success('Folder deleted successfully')
        onFoldersChange?.()
      } else {
        toast.error(result.error || 'Failed to delete folder')
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
      toast.error('An error occurred')
    }
  }

  const renderFolder = (
    folder: SpreadsheetFolder & { _count?: { spreadsheets: number } },
    level = 0
  ) => {
    const isExpanded = expandedFolders.has(folder.id)
    const isSelected = selectedFolderId === folder.id
    const subfolders = folders.filter((f) => f.parentId === folder.id)
    const hasSubfolders = subfolders.length > 0
    const count = folder._count?.spreadsheets ?? folder.spreadsheetCount ?? 0

    return (
      <div key={folder.id}>
        <div
          className={cn(
            'group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent',
            isSelected && 'bg-accent'
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {hasSubfolders ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
              className="p-0.5 hover:bg-accent-foreground/10 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <div
            onClick={() => onSelectFolder(folder.id)}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0" />
            ) : (
              <Folder className="h-4 w-4 shrink-0" />
            )}
            {folder.icon && <span className="shrink-0">{folder.icon}</span>}
            <span className="text-sm truncate flex-1">{folder.name}</span>
            {count > 0 && (
              <span className="text-xs text-muted-foreground shrink-0">{count}</span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openCreateDialog(folder.id)}>
                <FolderPlus className="h-4 w-4 me-2" />
                New Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditDialog(folder)}>
                <Edit className="h-4 w-4 me-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(folder)}
              >
                <Trash2 className="h-4 w-4 me-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isExpanded && hasSubfolders && (
          <div>{subfolders.map((subfolder) => renderFolder(subfolder, level + 1))}</div>
        )}
      </div>
    )
  }

  const rootFolders = folders.filter((f) => !f.parentId)
  const totalSpreadsheets = folders.reduce(
    (sum, f) => sum + (f._count?.spreadsheets ?? f.spreadsheetCount ?? 0),
    0
  )

  return (
    <>
      <div className="w-64 border-r bg-muted/20 h-full overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Folders</h3>
            <Button variant="ghost" size="sm" onClick={() => openCreateDialog()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-0.5">
            {/* Only show user-created folders */}
            {rootFolders.map((folder) => renderFolder(folder))}

            {rootFolders.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No folders yet. Click + to create one.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create Folder' : 'Edit Folder'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create'
                ? 'Create a new folder to organize your spreadsheets'
                : 'Update folder details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Folder name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Folder description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📁"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {dialogMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
