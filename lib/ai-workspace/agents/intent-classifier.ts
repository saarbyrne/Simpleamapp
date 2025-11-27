import Anthropic from '@anthropic-ai/sdk'
import { ArtifactType } from '@/lib/ai-workspace/types'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface IntentClassification {
    artifactType: ArtifactType
    confidence: number
    reasoning: string
}

export async function classifyIntent(prompt: string, examples: any[]): Promise<IntentClassification> {
    const systemPrompt = `You are an intent classifier for a sports team management platform.
Your job is to categorize user prompts into one of the following artifact types:
- 'reports': Data visualizations, charts, tables, analysis.
- 'whiteboards': Tactical drawings, formations, pitch diagrams.
- 'plans': Schedules, rehab plans, periodization.
- 'uiPages': Interface screens, forms, data entry views.

Output JSON only.`

    const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
            {
                role: 'user',
                content: `Examples: ${JSON.stringify(examples)}
        
        Classify this prompt: "${prompt}"`
            }
        ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
        try {
            return JSON.parse(content.text) as IntentClassification
        } catch (e) {
            console.error('Failed to parse intent classification', e)
            return { artifactType: 'reports', confidence: 0, reasoning: 'Failed to parse' }
        }
    }

    throw new Error('Unexpected response format')
}
