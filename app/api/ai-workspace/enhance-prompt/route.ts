import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { knowledgeBase } from '@/lib/ai-workspace/knowledge-base'

export async function POST(req: NextRequest) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await ensureUserWithOrganization(user)
    if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    try {
        const { prompt } = await req.json()
        console.log('[EnhancePrompt] Received prompt:', prompt)

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Load knowledge base
        console.log('[EnhancePrompt] Loading knowledge base...')
        const { glossary, catalog, examples } = knowledgeBase
        console.log('[EnhancePrompt] Knowledge base loaded')

        // 1. Get Org Context
        console.log('[EnhancePrompt] Fetching Org Context...')
        const { getOrgContext } = await import('@/lib/ai-workspace/context')
        const context = await getOrgContext(dbUser.organizationId, user.id)
        console.log('[EnhancePrompt] Org Context fetched:', {
            colleaguesCount: context.colleagues.length,
            dataSourcesCount: context.dataSources.length,
            playersCount: context.players.length
        })

        // 2. Classify Intent
        console.log('[EnhancePrompt] Classifying Intent...')
        const { classifyIntent } = await import('@/lib/ai-workspace/agents/intent-classifier')
        let intentExamples = examples.intent_classification
        if (!intentExamples) {
            console.warn('[EnhancePrompt] No intent_classification examples found, using empty array')
            intentExamples = []
        }
        const classification = await classifyIntent(prompt, intentExamples)
        console.log('[EnhancePrompt] Intent Classified:', classification)

        // 3. Extract Entities
        console.log('[EnhancePrompt] Extracting Entities...')
        const { extractEntities } = await import('@/lib/ai-workspace/agents/entity-extractor')
        const entities = await extractEntities(prompt, context, glossary, catalog)
        console.log('[EnhancePrompt] Entities Extracted:', entities)

        // 4. Enhance Prompt
        console.log('[EnhancePrompt] Enhancing Prompt...')
        const { enhancePrompt } = await import('@/lib/ai-workspace/agents/prompt-enhancer')
        const result = await enhancePrompt(prompt, classification.artifactType, entities, catalog)
        console.log('[EnhancePrompt] Prompt Enhanced:', result)

        return NextResponse.json({
            ...result,
            artifactType: classification.artifactType,
            confidence: classification.confidence
        })

    } catch (error) {
        console.error('[EnhancePrompt] Error enhancing prompt:', error)
        if (error instanceof Error) {
            console.error('[EnhancePrompt] Error message:', error.message)
            console.error('[EnhancePrompt] Stack:', error.stack)
        }
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
