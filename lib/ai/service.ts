import Anthropic from '@anthropic-ai/sdk'
import { AI_TOOLS, executeToolCall } from './tools'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export interface Message {
  role: 'user' | 'assistant'
  content: string | any[] // Can be string or content blocks
}

export interface StreamChunk {
  type: 'content_delta' | 'tool_use' | 'tool_result' | 'message_stop' | 'thinking'
  content?: string
  toolName?: string
  toolInput?: any
  toolResult?: any
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

export async function* streamChatCompletion(
  messages: Message[],
  orgId: string,
  userId: string,
  systemPrompt?: string
): AsyncGenerator<StreamChunk> {
  const defaultSystemPrompt = `You are an AI assistant for SimpleAM, a sports team management platform. You help coaches and staff manage their teams by:

1. Answering questions about players, wellness data, training load, and performance
2. Creating reports and insights from data
3. Creating and distributing forms
4. Scheduling events and managing calendars
5. Analyzing trends and identifying risks

Be helpful, concise, and proactive. When you use tools to fetch data, ALWAYS provide a summary of the results to the user. When you identify issues (like low wellness or high injury risk), suggest actionable next steps.

Current context:
- Organization ID: ${orgId}
- User ID: ${userId}

Available data includes:
- Player information (names, positions, statuses, tags)
- Form responses (wellness, medical, performance)
- Spreadsheet data (training load, GPS data, match stats)
- Notes and medical records
- Calendar events and attendance
- Injury history and recovery plans

When users ask you to create forms, use the create_form tool with appropriate fields.`

  try {
    // Build initial message history
    const conversationMessages: any[] = messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content
    }))

    // Keep making API calls until we get a final text response
    let continueLoop = true
    let totalInputTokens = 0
    let totalOutputTokens = 0

    while (continueLoop) {
      const stream = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        system: systemPrompt || defaultSystemPrompt,
        messages: conversationMessages,
        tools: AI_TOOLS as any,
        stream: true
      })

      let currentText = ''
      let toolUses: any[] = []
      let currentToolUse: any = null
      let currentToolInput = ''
      let messageUsage: any = null
      let stopReason: string | null = null

      // Process the stream
      for await (const chunk of stream) {
        if (chunk.type === 'message_start') {
          const msg = chunk.message as any
          if (msg.usage) {
            totalInputTokens += msg.usage.input_tokens || 0
          }
        } else if (chunk.type === 'content_block_start') {
          const block = (chunk as any).content_block
          if (block.type === 'tool_use') {
            currentToolUse = {
              id: block.id,
              name: block.name,
              input: ''
            }
          }
        } else if (chunk.type === 'content_block_delta') {
          const delta = (chunk as any).delta
          if (delta.type === 'text_delta') {
            currentText += delta.text
            // Stream text to user in real-time
            yield {
              type: 'content_delta',
              content: delta.text
            }
          } else if (delta.type === 'input_json_delta') {
            if (currentToolUse) {
              currentToolUse.input += delta.partial_json
            }
          }
        } else if (chunk.type === 'content_block_stop') {
          if (currentToolUse) {
            try {
              currentToolUse.input = JSON.parse(currentToolUse.input)
              toolUses.push(currentToolUse)

              // Notify user that tool is being called
              yield {
                type: 'tool_use',
                toolName: currentToolUse.name,
                toolInput: currentToolUse.input
              }
            } catch (e) {
              console.error('Failed to parse tool input:', e)
            }
            currentToolUse = null
          }
        } else if (chunk.type === 'message_delta') {
          const delta = chunk.delta as any
          if (delta.stop_reason) {
            stopReason = delta.stop_reason
          }
          if (chunk.usage) {
            messageUsage = chunk.usage
          }
        } else if (chunk.type === 'message_stop') {
          if (messageUsage) {
            totalOutputTokens += messageUsage.output_tokens || 0
          }
        }
      }

      // If we have tool uses, execute them and continue the loop
      if (toolUses.length > 0 && stopReason === 'tool_use') {
        // Build assistant message with tool use blocks
        const assistantContent: any[] = []

        if (currentText) {
          assistantContent.push({
            type: 'text',
            text: currentText
          })
        }

        // Execute all tools and build tool result blocks
        const toolResults: any[] = []

        for (const toolUse of toolUses) {
          yield {
            type: 'thinking',
            content: `Using ${toolUse.name} tool...`
          }

          try {
            const result = await executeToolCall(
              toolUse.name,
              toolUse.input,
              orgId,
              userId
            )

            assistantContent.push({
              type: 'tool_use',
              id: toolUse.id,
              name: toolUse.name,
              input: toolUse.input
            })

            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result)
            })

            // Show user the tool result
            yield {
              type: 'tool_result',
              toolName: toolUse.name,
              toolInput: toolUse.input,
              toolResult: result
            }
          } catch (error: any) {
            console.error(`Error executing tool ${toolUse.name}:`, error)

            assistantContent.push({
              type: 'tool_use',
              id: toolUse.id,
              name: toolUse.name,
              input: toolUse.input
            })

            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify({
                error: 'Tool execution failed',
                message: error.message
              }),
              is_error: true
            })
          }
        }

        // Add assistant message with tool uses to conversation
        conversationMessages.push({
          role: 'assistant',
          content: assistantContent
        })

        // Add user message with tool results to continue conversation
        conversationMessages.push({
          role: 'user',
          content: toolResults
        })

        // Continue the loop to get AI's response to tool results
        continue
      } else {
        // No more tool uses, we're done
        continueLoop = false

        yield {
          type: 'message_stop',
          usage: {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens
          }
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
      model: 'claude-3-5-haiku-20241022',
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
  // Claude 3.5 Haiku pricing (90% cheaper than Sonnet 4)
  const INPUT_COST_PER_MILLION = 0.25
  const OUTPUT_COST_PER_MILLION = 1.25

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
