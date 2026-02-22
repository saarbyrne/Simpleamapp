'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { X, FileText, Layout, Calendar, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { deleteAIWorkspace } from '@/app/actions/ai-workspace'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface WorkspaceHistoryPanelProps {
  workspaces: any[]
  onClose: () => void
  onWorkspacesChange?: () => void
}

export function WorkspaceHistoryPanel({
  workspaces,
  onClose,
  onWorkspacesChange,
}: WorkspaceHistoryPanelProps) {
  const t = useTranslations('aiWorkspace')
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const getArtifactIcon = (artifactType: string) => {
    switch (artifactType) {
      case 'reports':
        return <FileText className="h-4 w-4" />
      case 'whiteboards':
        return <Layout className="h-4 w-4" />
      case 'plans':
        return <Calendar className="h-4 w-4" />
      case 'uiPages':
        return <Layout className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'generating':
      case 'updating':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'ready':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'draft':
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const handleDelete = async (workspaceId: string) => {
    setIsDeleting(true)
    try {
      const result = await deleteAIWorkspace(workspaceId)
      if (result.success) {
        toast.success('Workspace deleted')
        onWorkspacesChange?.()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error deleting workspace:', error)
      toast.error('Failed to delete workspace')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/dashboard/ai-workspace/${workspaceId}`)
  }

  return (
    <>
      <div className="flex h-full flex-col border-l bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Workspace History</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Workspace List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {workspaces.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No workspaces yet</p>
              </div>
            ) : (
              workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="group relative rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleWorkspaceClick(workspace.id)}
                >
                  {/* Artifact Type Icon */}
                  <div className="absolute top-3 end-3 text-muted-foreground">
                    {getArtifactIcon(workspace.artifactType)}
                  </div>

                  {/* Workspace Name */}
                  <h3 className="font-medium text-sm pe-8 line-clamp-2 mb-2">
                    {workspace.name}
                  </h3>

                  {/* Preview Text */}
                  {workspace.messages?.[0]?.content && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {workspace.messages[0].content}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getStatusColor(workspace.status))}
                    >
                      {workspace.status}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(workspace.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(workspace.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this workspace and all its messages. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
