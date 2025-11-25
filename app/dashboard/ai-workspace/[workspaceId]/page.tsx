import { getAIWorkspace } from '@/app/actions/ai-workspace'
import { WorkspaceCanvas } from '@/components/ai-workspace/workspace-canvas'
import { redirect } from 'next/navigation'

interface WorkspacePageProps {
  params: {
    workspaceId: string
  }
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = params

  const result = await getAIWorkspace(workspaceId)

  if (!result.success || !result.workspace) {
    redirect('/dashboard/ai-workspace')
  }

  return <WorkspaceCanvas workspace={result.workspace} />
}
