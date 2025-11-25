import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { addAIWorkspaceMessage, updateAIWorkspace, getAIWorkspace } from '@/app/actions/ai-workspace'
import { ReportAgent } from '@/lib/ai-workspace/agents/report-agent'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for agentic processing

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const dbUser = await ensureUserWithOrganization(user)
    const { workspaceId, message, structuredData } = await req.json()

    // Get workspace to determine artifact type and context
    const workspaceResult = await getAIWorkspace(workspaceId)
    if (!workspaceResult.success || !workspaceResult.workspace) {
      return new Response('Workspace not found', { status: 404 })
    }

    const workspace = workspaceResult.workspace

    // Update workspace status to generating
    await updateAIWorkspace(workspaceId, { status: 'updating' })

    // Get Anthropic API key
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    // Create a readable stream for progress updates
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ''
          let agentResult: any = null

          // Route to appropriate agent based on artifact type
          if (workspace.artifactType === 'reports') {
            const agent = new ReportAgent(anthropicKey)

            // Stream progress updates
            agentResult = await agent.generateReport(
              message,
              structuredData,
              workspace.artifactData,
              {
                onProgress: (progress) => {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'progress',
                        step: progress.step,
                        description: progress.description,
                        complete: progress.complete,
                      })}\n\n`
                    )
                  )
                },
                onThinking: (thinking) => {
                  // Stream thinking content as delta
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'thinking',
                        content: thinking,
                      })}\n\n`
                    )
                  )
                },
                onComplete: (result) => {
                  fullResponse = result.reasoning || 'Report generated successfully'
                },
              }
            )
          } else {
            // For other types, fall back to simple generation for now
            fullResponse = 'Using legacy generation for this artifact type'
            agentResult = {
              success: false,
              config: null,
              errors: ['Agentic generation not yet implemented for this type'],
            }
          }

          if (!agentResult.success) {
            // Validation failed - return error with details
            const errorMessage = `Configuration validation failed:\n${agentResult.errors?.join('\n') || 'Unknown error'}`

            await addAIWorkspaceMessage(workspaceId, 'assistant', errorMessage)
            await updateAIWorkspace(workspaceId, { status: 'draft' })

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'delta',
                  content: errorMessage,
                })}\n\n`
              )
            )

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  message: agentResult.errors?.join(', ') || 'Generation failed',
                })}\n\n`
              )
            )
          } else {
            // Save the assistant's response
            const responseText = `I've generated your ${workspace.artifactType} artifact with the following approach:\n\n${fullResponse.substring(0, 500)}...\n\nThe artifact is now ready for preview.`

            await addAIWorkspaceMessage(workspaceId, 'assistant', responseText)

            // Update workspace with artifact data
            await updateAIWorkspace(workspaceId, {
              status: 'ready',
              artifactData: agentResult.config,
              generatedContent: {
                response: fullResponse,
                timestamp: new Date().toISOString(),
                reasoning: agentResult.reasoning,
              },
            })

            // Stream final content
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'delta',
                  content: responseText,
                })}\n\n`
              )
            )

            // Send completion with artifact data
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'done',
                  content: responseText,
                  artifactData: agentResult.config,
                })}\n\n`
              )
            )
          }

          controller.close()
        } catch (error) {
          console.error('Error in agentic generation:', error)

          // Update workspace to error state
          await updateAIWorkspace(workspaceId, { status: 'draft' })

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                message: error instanceof Error ? error.message : 'Internal error',
              })}\n\n`
            )
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
    console.error('Error in AI workspace agentic generation:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
