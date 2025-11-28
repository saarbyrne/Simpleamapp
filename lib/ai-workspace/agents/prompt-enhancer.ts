import Anthropic from '@anthropic-ai/sdk'
import { ExtractedEntity } from './entity-extractor'
import { ArtifactType } from '@/lib/ai-workspace/types'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface EnhancedPromptResult {
    template: string
    variables: Array<{
        id: string
        label: string
        type: 'text' | 'number' | 'date' | 'select' | 'multi-select'
        value: any
        options?: string[]
    }>
}

export async function enhancePrompt(
    originalPrompt: string,
    artifactType: ArtifactType,
    entities: ExtractedEntity[],
    catalog: any
): Promise<EnhancedPromptResult> {
    // Map plural artifact types to singular template keys
    const templateKeyMap: Record<ArtifactType, string> = {
        'reports': 'report',
        'whiteboards': 'whiteboard',
        'plans': 'plan',
        'uiPages': 'uipage'
    }
    const templateKey = templateKeyMap[artifactType]
    const template = catalog.artifact_templates?.[templateKey]

    const systemPrompt = `You are a prompt engineer assistant.
Your goal is to take a vague user request and turn it into a structured, templated prompt with interactive variables.
The user wants to create a "${artifactType}".

Use the extracted entities to pre-fill variables.
Define variables for any missing but necessary information (e.g., time range, chart type).

IMPORTANT: Output ONLY valid JSON. No explanatory text, markdown formatting, or code blocks.
Return a JSON object with:
- 'template' (string using {variableId} syntax)
- 'variables' (array of objects, each MUST have: id, label, type, value, and optionally options for select/multi-select types)

Each variable object MUST include:
- id (string): unique identifier used in template
- label (string): human-readable label
- type (string): one of 'text', 'number', 'date', 'select', 'multi-select'
- value (any): the default/current value
- options (string[]): required for 'select' and 'multi-select' types`

    const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
            {
                role: 'user',
                content: `Original: "${originalPrompt}"
        Entities: ${JSON.stringify(entities)}
        Catalog: ${JSON.stringify(template || {})}

        Enhance this prompt.`
            }
        ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
        try {
            return JSON.parse(content.text) as EnhancedPromptResult
        } catch (e) {
            console.error('Failed to parse enhanced prompt', e)
            throw e
        }
    }

    throw new Error('Unexpected response format')
}
