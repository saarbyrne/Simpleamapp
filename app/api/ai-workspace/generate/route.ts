import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { streamChatCompletion } from '@/lib/ai/service'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { addAIWorkspaceMessage, updateAIWorkspace, getAIWorkspace } from '@/app/actions/ai-workspace'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)
    const { workspaceId, message } = await req.json()

    // Get workspace to determine artifact type and context
    const workspaceResult = await getAIWorkspace(workspaceId)
    if (!workspaceResult.success || !workspaceResult.workspace) {
      return new Response('Workspace not found', { status: 404 })
    }

    const workspace = workspaceResult.workspace

    // Update workspace status to generating
    await updateAIWorkspace(workspaceId, { status: 'updating' })

    // Build conversation history from workspace messages
    const conversationHistory = workspace.messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }))

    // Add the new user message
    conversationHistory.push({
      role: 'user',
      content: message,
    })

    // Create system prompt based on artifact type
    const systemPrompt = getWorkspaceSystemPrompt(workspace)

    // Create a readable stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ''

          // Stream the AI response
          for await (const chunk of streamChatCompletion(
            conversationHistory,
            dbUser.organizationId,
            dbUser.id,
            systemPrompt
          )) {
            if (chunk.type === 'content_delta' && chunk.content) {
              fullResponse += chunk.content
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: chunk.content })}\n\n`)
              )
            } else if (chunk.type === 'tool_use') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({
                  type: 'tool_use',
                  toolName: chunk.toolName,
                  toolInput: chunk.toolInput
                })}\n\n`)
              )
            } else if (chunk.type === 'message_stop') {
              // Save the assistant's response
              await addAIWorkspaceMessage(workspaceId, 'assistant', fullResponse)

              // Extract artifact data from response
              const artifactData = extractArtifactData(fullResponse, workspace.artifactType)

              // Update workspace with artifact data
              await updateAIWorkspace(workspaceId, {
                status: 'ready',
                artifactData,
                generatedContent: { response: fullResponse, timestamp: new Date().toISOString() }
              })

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'done', content: fullResponse, artifactData })}\n\n`)
              )
            }
          }

          controller.close()
        } catch (error) {
          console.error('Error streaming AI response:', error)

          // Update workspace to error state
          await updateAIWorkspace(workspaceId, { status: 'draft' })

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'error',
              message: 'Failed to generate response'
            })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in AI workspace generation:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

function getWorkspaceSystemPrompt(workspace: any): string {
  const basePrompt = `You are an AI assistant helping create a ${workspace.artifactType} artifact in SimpleAM, a sports team management platform.

Initial request: "${workspace.initialPrompt}"

Current artifact type: ${workspace.artifactType}
Status: ${workspace.status}

IMPORTANT: You must end your response with a JSON artifact configuration wrapped in \`\`\`json tags.
`

  const typeSpecificPrompts = {
    reports: `
You are creating a DATA REPORT/DASHBOARD.

First, discuss the requirements and make recommendations in natural language.

Then, at the END of your response, provide a JSON configuration like this:

\`\`\`json
{
  "reportConfig": {
    "title": "Report Title",
    "timePeriod": "last7Days",
    "players": ["all"],
    "metrics": ["wellness", "trainingLoad", "fatigue"],
    "visualizationType": "line",
    "charts": [
      {
        "type": "line",
        "title": "Chart Title",
        "xAxis": "date",
        "yAxis": "value",
        "series": ["metric1", "metric2"]
      }
    ],
    "kpis": [
      {
        "label": "Average Wellness",
        "value": "N/A (connect to data)",
        "format": "number"
      }
    ]
  }
}
\`\`\``,

    whiteboards: `
You are creating a TACTICAL WHITEBOARD.

First, discuss the tactical scenario and formations.

Then, at the END of your response, provide a JSON configuration like this:

\`\`\`json
{
  "whiteboardConfig": {
    "sportType": "soccer",
    "formation": "4-3-3",
    "title": "Tactical Plan Title",
    "elements": [
      {
        "type": "player",
        "position": { "x": 50, "y": 80 },
        "label": "GK",
        "number": 1
      },
      {
        "type": "arrow",
        "from": { "x": 30, "y": 50 },
        "to": { "x": 70, "y": 30 },
        "label": "Run"
      }
    ],
    "annotations": [
      {
        "type": "zone",
        "area": { "x": 20, "y": 20, "width": 60, "height": 40 },
        "label": "Pressing Zone"
      }
    ]
  }
}
\`\`\``,

    uiPages: `
You are creating a CUSTOM UI PAGE.

First, discuss the page requirements and layout.

Then, at the END of your response, provide a JSON configuration like this:

\`\`\`json
{
  "uiPageConfig": {
    "title": "Page Title",
    "layout": "grid",
    "components": [
      {
        "type": "table",
        "title": "Component Title",
        "dataSource": "players",
        "columns": ["name", "status", "lastWellness"]
      },
      {
        "type": "chart",
        "chartType": "bar",
        "dataSource": "forms",
        "metric": "wellness"
      }
    ]
  }
}
\`\`\``,

    plans: `
You are creating a PLAN/TIMELINE.

First, discuss the goals and timeline.

Then, at the END of your response, provide a JSON configuration like this:

\`\`\`json
{
  "planConfig": {
    "title": "Plan Title",
    "timeHorizon": "3months",
    "viewMode": "timeline",
    "milestones": [
      {
        "id": "1",
        "title": "Milestone Title",
        "description": "Description",
        "date": "2025-01-01",
        "status": "pending",
        "dependencies": []
      }
    ],
    "associations": {
      "players": [],
      "events": [],
      "teams": []
    }
  }
}
\`\`\``,
  }

  return basePrompt + (typeSpecificPrompts[workspace.artifactType as keyof typeof typeSpecificPrompts] || '')
}

function extractArtifactData(response: string, artifactType: string): any {
  // Try to extract JSON from code blocks
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/)

  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch (e) {
      console.error('Failed to parse artifact JSON:', e)
    }
  }

  // Return default structure based on artifact type
  const defaults: any = {
    reports: {
      reportConfig: {
        title: "Generated Report",
        timePeriod: "last7Days",
        players: ["all"],
        metrics: ["wellness"],
        visualizationType: "line",
        charts: [],
        kpis: []
      }
    },
    whiteboards: {
      whiteboardConfig: {
        title: "Tactical Plan",
        sportType: "soccer",
        elements: [],
        annotations: []
      }
    },
    uiPages: {
      uiPageConfig: {
        title: "Custom Page",
        layout: "grid",
        components: []
      }
    },
    plans: {
      planConfig: {
        title: "Plan",
        timeHorizon: "3months",
        milestones: []
      }
    }
  }

  return defaults[artifactType] || {}
}
