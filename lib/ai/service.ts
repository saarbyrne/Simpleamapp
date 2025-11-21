import Anthropic from '@anthropic-ai/sdk'
import { AI_TOOLS, executeToolCall } from './tools'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamChunk {
  type: 'content_delta' | 'tool_use' | 'message_stop'
  content?: string
  toolName?: string
  toolInput?: any
  toolResult?: any
}

export async function* streamChatCompletion(
  messages: Message[],
  orgId: string,
  userId: string,
  systemPrompt?: string
): AsyncGenerator<StreamChunk> {
  const claudeMessages = messages.map(m => ({
    role: m.role,
    content: m.content
  }))

  const defaultSystemPrompt = `You are an AI assistant for SimpleAM, a sports team management platform. You help coaches and staff manage their teams by:

1. Answering questions about players, wellness data, training load, and performance
2. Creating reports and insights from data
3. Scheduling events and distributing forms
4. Analyzing trends and identifying risks

Be helpful, concise, and proactive. When you identify issues (like low wellness or high injury risk), suggest actionable next steps.

Current context:
- Organization ID: ${orgId}
- User ID: ${userId}

Available data includes:
- Player information (names, positions, statuses, tags)
- Form responses (wellness, medical, performance)
- Spreadsheet data (training load, GPS data, match stats)
- Notes and medical records
- Calendar events and attendance
- Injury history and recovery plans`

  try {
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt || defaultSystemPrompt,
      messages: claudeMessages as any,
      tools: AI_TOOLS as any,
      stream: true
    })

    let currentToolUse: any = null
    let currentToolInput = ''

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_start') {
        const block = (chunk as any).content_block
        if (block.type === 'tool_use') {
          currentToolUse = block
          currentToolInput = ''
        }
      } else if (chunk.type === 'content_block_delta') {
        const delta = (chunk as any).delta
        if (delta.type === 'text_delta') {
          yield {
            type: 'content_delta',
            content: delta.text
          }
        } else if (delta.type === 'input_json_delta') {
          currentToolInput += delta.partial_json
        }
      } else if (chunk.type === 'content_block_stop') {
        if (currentToolUse) {
          // Execute the tool
          try {
            const toolInput = JSON.parse(currentToolInput)
            yield {
              type: 'tool_use',
              toolName: currentToolUse.name,
              toolInput
            }

            const result = await executeToolCall(
              currentToolUse.name,
              toolInput,
              orgId,
              userId
            )

            yield {
              type: 'tool_use',
              toolName: currentToolUse.name,
              toolInput,
              toolResult: result
            }

            currentToolUse = null
            currentToolInput = ''
          } catch (error) {
            console.error('Error executing tool:', error)
            yield {
              type: 'tool_use',
              toolName: currentToolUse.name,
              toolInput: currentToolInput,
              toolResult: { error: 'Failed to execute tool' }
            }
          }
        }
      } else if (chunk.type === 'message_stop') {
        yield {
          type: 'message_stop'
        }
      }
    }
  } catch (error) {
    console.error('Error in AI stream:', error)
    throw error
  }
}

export async function generateChatTitle(messages: Message[]): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: `Generate a short (3-5 word) title for this conversation: ${messages[0].content}`
        }
      ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      return content.text.replace(/['"]/g, '').trim()
    }
    return 'AI Conversation'
  } catch (error) {
    console.error('Error generating title:', error)
    return 'AI Conversation'
  }
}

export function calculateCost(inputTokens: number, outputTokens: number): number {
  // Claude Sonnet 4 pricing
  const INPUT_COST_PER_MILLION = 3.0
  const OUTPUT_COST_PER_MILLION = 15.0

  const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_MILLION
  const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION

  return inputCost + outputCost
}

export async function checkRateLimit(
  orgId: string,
  userId: string
): Promise<{ allowed: boolean; tokensRemaining: number; reason?: string }> {
  // This would check against AI settings and cost tracking
  // For now, return allowed
  return {
    allowed: true,
    tokensRemaining: 1_000_000
  }
}
