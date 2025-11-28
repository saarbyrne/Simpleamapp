import { InitialPromptScreen } from '@/components/ai-workspace/initial-prompt-screen'
import { getAIWorkspaces } from '@/app/actions/ai-workspace'

export default async function AIWorkspacePage() {
  const result = await getAIWorkspaces()
  const workspaces = result.success ? result.workspaces : []

  return <InitialPromptScreen workspaces={workspaces} />
}
