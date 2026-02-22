'use client'

import { useState, useEffect } from 'react'
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
  PanelLeftClose,
  PanelLeftOpen,
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

const FOLDER_SIDEBAR_STORAGE_KEY = 'spreadsheet-folder-sidebar-collapsed'

export function FolderSidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onFoldersChange,
}: FolderSidebarProps) {
  // Initialize with false to avoid hydration mismatch, then load from localStorage
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  
  // Load collapsed state from localStorage after mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(FOLDER_SIDEBAR_STORAGE_KEY)
    if (stored === 'true') {
      setIsCollapsed(true)
    }
  }, [])
  
  // Persist collapsed state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FOLDER_SIDEBAR_STORAGE_KEY, String(isCollapsed))
    }
  }, [isCollapsed])
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
            'group relative flex items-center py-1.5 rounded-md cursor-pointer hover:bg-accent',
            isSelected && 'bg-accent'
          )}
        >
          {hasSubfolders && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
              className="absolute start-0 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent-foreground/10 rounded z-10"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
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
      <div className={cn(
        "border-r bg-background overflow-hidden -mt-4 -mb-4 -ms-4 transition-all duration-200 flex relative",
        isCollapsed ? "w-8" : "w-64",
        "h-[calc(100%+2rem)]"
      )}>
        {!isCollapsed ? (
          <div className="h-full overflow-y-auto w-full">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Folders</h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openCreateDialog()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => setIsCollapsed(true)}
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-0.5 flex-1 overflow-y-auto">
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
        ) : (
          <div className="h-full w-full flex items-start justify-center pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setIsCollapsed(false)}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}
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
