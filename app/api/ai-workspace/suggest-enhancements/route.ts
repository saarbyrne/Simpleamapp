import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 30

interface SuggestionTag {
  type: string
  label: string
  value: any
  category: 'population' | 'outcome' | 'comparison' | 'time' | 'visualization' | 'other'
}

export async function POST(req: NextRequest) {
  const user = await getCachedUserWithOrganization()
  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const limit = checkRateLimit(`suggest-${user.id}`, RATE_LIMITS.AI_CHAT)
  if (!limit.success) {
    return Response.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 })
  }

  try {
    const { prompt, artifactType } = await req.json()

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const client = new Anthropic({ apiKey: anthropicKey })

    // Build system prompt based on artifact type
    const systemPrompt = buildSystemPrompt(artifactType)

    // Get suggestions from Claude
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022', // Switched to Haiku for cost savings during testing
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `User prompt: "${prompt}"\n\nAnalyze this prompt and suggest specific tags that would improve the request. Return JSON only.`,
        },
      ],
      system: systemPrompt,
    })

    const textContent = response.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response')
    }

    // Extract JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON in response')
    }

    const suggestions = JSON.parse(jsonMatch[0])

    return Response.json({
      success: true,
      tags: suggestions.tags || [],
      message: suggestions.message || 'Good research question. Consider adding these elements for better results:',
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return Response.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

function buildSystemPrompt(artifactType: string): string {
  const basePrompt = `You are a helpful AI assistant that analyzes user prompts and suggests specific, actionable tags to improve them.`

  const artifactPrompts: Record<string, string> = {
    reports: `
${basePrompt}

For REPORTS, focus on suggesting:
1. **Population specificity**: Which players? All players or specific ones?
2. **Time period**: Last 7 days? 30 days? 90 days? Custom range?
3. **Metrics**: Which specific metrics should be tracked? (wellness, trainingLoad, fatigue, performance, etc.)
4. **Visualization**: What chart type would best show this data? (line, bar, area, pie)
5. **Comparison**: Should we compare players, time periods, or teams?

Return JSON in this format:
{
  "message": "Good research question. Consider adding these elements for better results:",
  "tags": [
    {
      "type": "timePeriod",
      "label": "Last 7 days",
      "value": "last7Days",
      "category": "time"
    },
    {
      "type": "metrics",
      "label": "Wellness Score",
      "value": "wellness",
      "category": "outcome"
    },
    {
      "type": "visualizationType",
      "label": "Line Chart",
      "value": "line",
      "category": "visualization"
    }
  ]
}

Only suggest 3-5 most relevant tags. Be specific and actionable.`,

    whiteboards: `
${basePrompt}

For WHITEBOARDS, focus on suggesting:
1. **Sport**: Which sport is this for? (soccer, basketball, football, rugby, etc.)
2. **Formation**: What formation should be shown? (4-4-2, 4-3-3, etc.)
3. **Scenario**: What tactical scenario? (attacking play, defensive setup, set piece, transition, etc.)
4. **Specificity**: Which players should be highlighted?

Return JSON with 3-5 relevant tags in the same format as reports, using categories: population, comparison, other.`,

    plans: `
${basePrompt}

For PLANS/TIMELINES, focus on suggesting:
1. **Time horizon**: 1 month? 3 months? 6 months? 1 year?
2. **View mode**: Calendar, timeline, or list view?
3. **Population**: Which players should this plan involve?
4. **Events**: Should specific events be included?
5. **Focus**: Training plan, recovery plan, competition schedule?

Return JSON with 3-5 relevant tags in the same format as reports.`,

    uiPages: `
${basePrompt}

For UI PAGES, focus on suggesting:
1. **Layout**: Single column, 2-column, 3-column, or grid?
2. **Components**: What types of components? (charts, tables, cards, forms, etc.)
3. **Data sources**: What data should be displayed? (players, events, wellness, performance, etc.)
4. **Purpose**: Dashboard, detail view, form, or report page?

Return JSON with 3-5 relevant tags in the same format as reports.`,
  }

  return artifactPrompts[artifactType] || artifactPrompts.reports
}
