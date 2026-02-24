'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Save, Share, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { updateAIWorkspace } from '@/app/actions/ai-workspace'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WorkspaceTopBarProps {
  workspace: any
}

export function WorkspaceTopBar({ workspace }: WorkspaceTopBarProps) {
  const t = useTranslations('aiWorkspace.canvas.topBar')
  const tStates = useTranslations('aiWorkspace.states')
  const router = useRouter()
  const [name, setName] = useState(workspace.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveName = async () => {
    if (name.trim() === workspace.name) {
      setIsEditingName(false)
      return
    }

    setIsSaving(true)
    const result = await updateAIWorkspace(workspace.id, { name: name.trim() })

    if (result.success) {
      toast.success(t('saved'))
      setIsEditingName(false)
    } else {
      toast.error('Failed to update name')
    }
    setIsSaving(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'draft':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'updating':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'ready':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      case 'published':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'syncing':
        return 'bg-primary/10 text-primary border-primary/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/ai-workspace')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t('backToWorkspaces')}</span>
        </Button>

        <div className="h-6 w-px bg-border" />

        {/* Workspace Name */}
        {isEditingName ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveName()
              if (e.key === 'Escape') {
                setName(workspace.name)
                setIsEditingName(false)
              }
            }}
            className="h-8 w-64"
            autoFocus
            disabled={isSaving}
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="rounded px-2 py-1 text-sm font-medium hover:bg-muted"
          >
            {workspace.name}
          </button>
        )}

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn('text-xs', getStatusColor(workspace.status))}
        >
          {tStates(workspace.status)}
        </Badge>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Save Draft Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isSaving ? t('saving') : t('saveDraft')}
          </span>
        </Button>

        {/* Publish Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2">
              {t('publish')}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              {t('addToNavigation')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('addToEvent')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('addToProfile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {t('saveToLibrary')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Share Button */}
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>

        {/* Settings Button */}
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
