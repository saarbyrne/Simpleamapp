import Anthropic from '@anthropic-ai/sdk'
import { OrgContext } from '@/lib/ai-workspace/context'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export interface ExtractedEntity {
    key: string
    originalText: string
    resolvedValue: any
}

export async function extractEntities(
    prompt: string,
    context: OrgContext,
    glossary: any,
    catalog: any
): Promise<ExtractedEntity[]> {
    const systemPrompt = `You are an entity extractor for a sports data platform.
Identify key entities in the user's prompt and map them to system values using the provided context and glossary.

Context:
- Players: ${JSON.stringify(context.players.slice(0, 20))}... (truncated)
- Metrics: ${JSON.stringify(catalog.metrics)}
- Glossary: ${JSON.stringify(glossary)}

IMPORTANT: Output ONLY a valid JSON array. Do not include any explanatory text, markdown formatting, or code blocks.
Return an array of entities with 'key', 'originalText', and 'resolvedValue' fields.`

    const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
            {
                role: 'user',
                content: `Extract entities from: "${prompt}"`
            }
        ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
        try {
            return JSON.parse(content.text) as ExtractedEntity[]
        } catch (e) {
            console.error('Failed to parse entities', e)
            return []
        }
    }

    return []
}
