import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streamChatCompletion, generateChatTitle, calculateCost } from '@/lib/ai/service'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await db.user.findUnique({
      where: { email: user.email! },
      select: { id: true, organizationId: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // SECURITY: Rate limiting for expensive AI operations
    const { checkRateLimit, RATE_LIMITS, createRateLimitResponse } = await import('@/lib/rate-limit')
    const rateLimitResult = checkRateLimit(dbUser.id, RATE_LIMITS.AI_CHAT)

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult)
    }

    const body = await request.json()
    const { messages, conversationId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Create or get conversation
    let conversation
    if (conversationId) {
      conversation = await db.aIConversation.findUnique({
        where: { id: conversationId }
      })
      if (!conversation || conversation.userId !== dbUser.id) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }
    } else {
      // Generate title for new conversation
      const title = await generateChatTitle(messages)
      conversation = await db.aIConversation.create({
        data: {
          orgId: dbUser.organizationId,
          userId: dbUser.id,
          title
        }
      })
    }

    // Save user message
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'user') {
      await db.aIMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: lastMessage.content
        }
      })
    }

    // Stream response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = ''
        let inputTokens = 0
        let outputTokens = 0
        const actions: any[] = []
        const toolCalls: any[] = []

        try {
          for await (const chunk of streamChatCompletion(
            messages,
            dbUser.organizationId,
            dbUser.id
          )) {
            if (chunk.type === 'content_delta' && chunk.content) {
              fullResponse += chunk.content
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'content', content: chunk.content })}\n\n`)
              )
              outputTokens += 1 // Rough estimate
            } else if (chunk.type === 'tool_use') {
              if (chunk.toolResult) {
                toolCalls.push({
                  name: chunk.toolName,
                  input: chunk.toolInput,
                  result: chunk.toolResult
                })
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'tool_call', tool: chunk.toolName, result: chunk.toolResult })}\n\n`)
                )
              }
            } else if (chunk.type === 'message_stop') {
              // Save assistant message
              await db.aIMessage.create({
                data: {
                  conversationId: conversation.id,
                  role: 'assistant',
                  content: fullResponse,
                  actions: actions.length > 0 ? actions : undefined,
                  toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                  inputTokens,
                  outputTokens
                }
              })

              // Track costs
              const cost = calculateCost(inputTokens, outputTokens)
              await db.aICostTracking.create({
                data: {
                  orgId: dbUser.organizationId,
                  userId: dbUser.id,
                  conversationId: conversation.id,
                  inputTokens,
                  outputTokens,
                  totalCost: cost,
                  endpoint: 'chat'
                }
              })

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'done', conversationId: conversation.id })}\n\n`)
              )
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Stream failed' })}\n\n`)
          )
        } finally {
          controller.close()
        }
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
