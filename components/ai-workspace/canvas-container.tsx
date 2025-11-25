'use client'

import { useTranslations } from 'next-intl'
import { Loader2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ReportRenderer } from './renderers/report-renderer'
import { WhiteboardRenderer } from './renderers/whiteboard-renderer'
import { PlanRenderer } from './renderers/plan-renderer'
import { UIPageRenderer } from './renderers/uipage-renderer'

interface CanvasContainerProps {
  workspace: any
}

export function CanvasContainer({ workspace }: CanvasContainerProps) {
  const t = useTranslations('aiWorkspace.canvas.canvas')
  const tStates = useTranslations('aiWorkspace.states')

  const isGenerating = workspace.status === 'generating' || workspace.status === 'updating'
  const hasContent = workspace.generatedContent

  const getStatusDisplay = () => {
    switch (workspace.status) {
      case 'generating':
        return {
          icon: <Loader2 className="h-8 w-8 animate-spin text-primary" />,
          title: tStates('generating'),
          description: 'Creating your artifact...',
        }
      case 'updating':
        return {
          icon: <Loader2 className="h-8 w-8 animate-spin text-primary" />,
          title: tStates('updating'),
          description: 'Applying your changes...',
        }
      case 'draft':
      case 'ready':
        return hasContent
          ? null
          : {
              icon: <Sparkles className="h-8 w-8 text-muted-foreground" />,
              title: t('noPreview'),
              description: t('generateFirst'),
            }
      default:
        return null
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="flex h-full flex-col">
      {/* Status Badge */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {workspace.artifactType === 'reports' && 'Report Preview'}
            {workspace.artifactType === 'whiteboards' && 'Whiteboard Preview'}
            {workspace.artifactType === 'uiPages' && 'UI Page Preview'}
            {workspace.artifactType === 'plans' && 'Plan Preview'}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              isGenerating && 'border-primary/50 bg-primary/10 text-primary'
            )}
          >
            {isGenerating && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            {t(workspace.status)}
          </Badge>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-auto">
        {statusDisplay ? (
          // Empty/Loading State
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center">
              {statusDisplay.icon}
              <h3 className="mt-4 text-lg font-semibold">
                {statusDisplay.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {statusDisplay.description}
              </p>
            </div>
          </div>
        ) : (
          // Artifact Preview
          <>
            {workspace.artifactType === 'reports' && (
              <ReportRenderer workspace={workspace} />
            )}
            {workspace.artifactType === 'whiteboards' && (
              <WhiteboardRenderer workspace={workspace} />
            )}
            {workspace.artifactType === 'uiPages' && (
              <UIPageRenderer workspace={workspace} />
            )}
            {workspace.artifactType === 'plans' && (
              <PlanRenderer workspace={workspace} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
