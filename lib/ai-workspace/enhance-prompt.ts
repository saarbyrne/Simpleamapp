import type { ReportInputs } from '@/components/ai-workspace/inputs/report-inputs'
import type { WhiteboardInputs } from '@/components/ai-workspace/inputs/whiteboard-inputs'
import type { PlanInputs } from '@/components/ai-workspace/inputs/plan-inputs'
import type { UIPageInputs } from '@/components/ai-workspace/inputs/uipage-inputs'
import type { Criterion } from '@/components/ai-workspace/inputs/criteria-builder'

export interface EnhancedPromptData {
  freeText: string
  criteria: Criterion[]
  artifactInputs: ReportInputs | WhiteboardInputs | PlanInputs | UIPageInputs | null
  artifactType: string
  currentArtifactData?: any
  playerNames?: Record<string, string> // id -> name mapping
  eventNames?: Record<string, string> // id -> name mapping
}

export function enhancePrompt(data: EnhancedPromptData): string {
  const {
    freeText,
    criteria,
    artifactInputs,
    artifactType,
    currentArtifactData,
    playerNames = {},
    eventNames = {},
  } = data

  let enhancedPrompt = freeText

  // Add structured context based on artifact type
  if (artifactInputs) {
    enhancedPrompt += '\n\n## Structured Requirements:\n'

    switch (artifactType) {
      case 'reports':
        enhancedPrompt += formatReportInputs(artifactInputs as ReportInputs, playerNames)
        break
      case 'whiteboards':
        enhancedPrompt += formatWhiteboardInputs(artifactInputs as WhiteboardInputs)
        break
      case 'plans':
        enhancedPrompt += formatPlanInputs(artifactInputs as PlanInputs, playerNames, eventNames)
        break
      case 'uiPages':
        enhancedPrompt += formatUIPageInputs(artifactInputs as UIPageInputs)
        break
    }
  }

  // Add custom criteria
  if (criteria.length > 0) {
    enhancedPrompt += '\n\n## Additional Criteria:\n'
    criteria.forEach((criterion, index) => {
      if (criterion.label && criterion.value) {
        enhancedPrompt += `${index + 1}. ${criterion.label}: ${criterion.value}\n`
      }
    })
  }

  // Add current state context for refinements
  if (currentArtifactData) {
    enhancedPrompt += '\n\n## Current Artifact State:\n'
    enhancedPrompt += '```json\n'
    enhancedPrompt += JSON.stringify(currentArtifactData, null, 2)
    enhancedPrompt += '\n```\n'
    enhancedPrompt += '\nPlease apply the requested changes to the current configuration above.\n'
  }

  return enhancedPrompt
}

function formatReportInputs(inputs: ReportInputs, playerNames: Record<string, string>): string {
  let formatted = ''

  // Time Period
  const timePeriodMap: Record<string, string> = {
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    custom: 'Custom date range',
  }
  formatted += `- **Time Period**: ${timePeriodMap[inputs.timePeriod] || inputs.timePeriod}\n`

  // Players
  if (inputs.playerIds.length > 0) {
    const names = inputs.playerIds.map((id) => playerNames[id] || id).join(', ')
    formatted += `- **Players**: ${names}\n`
  } else {
    formatted += `- **Players**: All players\n`
  }

  // Metrics
  if (inputs.metrics.length > 0) {
    formatted += `- **Metrics**: ${inputs.metrics.join(', ')}\n`
  }

  // Visualization
  formatted += `- **Visualization Type**: ${inputs.visualizationType}\n`

  return formatted
}

function formatWhiteboardInputs(inputs: WhiteboardInputs): string {
  let formatted = ''

  formatted += `- **Sport**: ${inputs.sportType}\n`
  if (inputs.formation) {
    formatted += `- **Formation**: ${inputs.formation}\n`
  }
  formatted += `- **Tactical Scenario**: ${inputs.scenario}\n`

  return formatted
}

function formatPlanInputs(
  inputs: PlanInputs,
  playerNames: Record<string, string>,
  eventNames: Record<string, string>
): string {
  let formatted = ''

  const timeHorizonMap: Record<string, string> = {
    '1month': '1 Month',
    '3months': '3 Months',
    '6months': '6 Months',
    '1year': '1 Year',
    custom: 'Custom',
  }
  formatted += `- **Time Horizon**: ${timeHorizonMap[inputs.timeHorizon] || inputs.timeHorizon}\n`
  formatted += `- **View Mode**: ${inputs.viewMode}\n`

  if (inputs.playerIds.length > 0) {
    const names = inputs.playerIds.map((id) => playerNames[id] || id).join(', ')
    formatted += `- **Associated Players**: ${names}\n`
  }

  if (inputs.eventIds.length > 0) {
    const names = inputs.eventIds.map((id) => eventNames[id] || id).join(', ')
    formatted += `- **Associated Events**: ${names}\n`
  }

  return formatted
}

function formatUIPageInputs(inputs: UIPageInputs): string {
  let formatted = ''

  formatted += `- **Layout**: ${inputs.layout}\n`

  if (inputs.componentTypes.length > 0) {
    formatted += `- **Component Types**: ${inputs.componentTypes.join(', ')}\n`
  }

  if (inputs.dataSources.length > 0) {
    formatted += `- **Data Sources**: ${inputs.dataSources.join(', ')}\n`
  }

  return formatted
}
