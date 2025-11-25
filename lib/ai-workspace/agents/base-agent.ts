import Anthropic from '@anthropic-ai/sdk'

export interface AgentStep {
  name: string
  description: string
  systemPrompt: string
}

export interface AgentProgress {
  step: string
  description: string
  complete: boolean
}

export interface AgentResult {
  success: boolean
  config: any
  reasoning?: string
  errors?: string[]
}

export interface StreamCallback {
  onProgress?: (progress: AgentProgress) => void
  onThinking?: (content: string) => void
  onComplete?: (result: AgentResult) => void
}

/**
 * Base agent class for multi-step artifact generation
 * Uses Claude's extended thinking to reason through each step
 */
export class BaseAgent {
  private client: Anthropic
  private model: string = 'claude-sonnet-4-20250514'

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  /**
   * Execute multi-step generation process
   */
  async execute(
    steps: AgentStep[],
    userPrompt: string,
    structuredInputs: any,
    currentConfig: any | null,
    callbacks?: StreamCallback
  ): Promise<AgentResult> {
    let cumulativeReasoning = ''
    let finalConfig: any = null
    const errors: string[] = []

    for (const step of steps) {
      // Notify progress
      callbacks?.onProgress?.({
        step: step.name,
        description: step.description,
        complete: false,
      })

      try {
        // Build conversation for this step
        const messages: Anthropic.MessageParam[] = [
          {
            role: 'user',
            content: this.buildStepPrompt(
              step,
              userPrompt,
              structuredInputs,
              currentConfig,
              cumulativeReasoning
            ),
          },
        ]

        // Call Claude with extended thinking
        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: 16000,
          thinking: {
            type: 'enabled',
            budget_tokens: 10000,
          },
          messages,
          system: step.systemPrompt,
        })

        // Extract thinking and response
        let thinkingContent = ''
        let responseContent = ''

        for (const block of response.content) {
          if (block.type === 'thinking') {
            thinkingContent += block.thinking
            callbacks?.onThinking?.(block.thinking)
          } else if (block.type === 'text') {
            responseContent += block.text
          }
        }

        cumulativeReasoning += `\n\n## ${step.name}\n${thinkingContent}\n${responseContent}`

        // Try to extract JSON config from response
        const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch && jsonMatch[1]) {
          finalConfig = JSON.parse(jsonMatch[1])
        }

        // Mark step complete
        callbacks?.onProgress?.({
          step: step.name,
          description: step.description,
          complete: true,
        })
      } catch (error: any) {
        errors.push(`Error in ${step.name}: ${error.message}`)
        console.error(`Agent error in ${step.name}:`, error)
      }
    }

    const result: AgentResult = {
      success: errors.length === 0 && finalConfig !== null,
      config: finalConfig,
      reasoning: cumulativeReasoning,
      errors: errors.length > 0 ? errors : undefined,
    }

    callbacks?.onComplete?.(result)
    return result
  }

  private buildStepPrompt(
    step: AgentStep,
    userPrompt: string,
    structuredInputs: any,
    currentConfig: any | null,
    previousReasoning: string
  ): string {
    let prompt = `# User Request\n${userPrompt}\n\n`

    if (structuredInputs) {
      prompt += `# Structured Inputs\n${JSON.stringify(structuredInputs, null, 2)}\n\n`
    }

    if (currentConfig) {
      prompt += `# Current Configuration\n${JSON.stringify(currentConfig, null, 2)}\n\n`
      prompt += `Please apply the requested changes to the current configuration.\n\n`
    }

    if (previousReasoning) {
      prompt += `# Previous Steps\n${previousReasoning}\n\n`
    }

    prompt += `# Your Task for This Step\n${step.description}\n\n`
    prompt += `Please think through this step carefully using extended thinking, then provide your response with a JSON configuration at the end.`

    return prompt
  }

  /**
   * Validate a configuration against rules
   */
  async validate(
    config: any,
    validationRules: string[],
    callbacks?: StreamCallback
  ): Promise<{ valid: boolean; issues: string[] }> {
    callbacks?.onProgress?.({
      step: 'validation',
      description: 'Validating configuration...',
      complete: false,
    })

    const validationPrompt = `
# Configuration to Validate
${JSON.stringify(config, null, 2)}

# Validation Rules
${validationRules.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}

# Task
Review the configuration against these validation rules. List any issues found.
If valid, respond with: {"valid": true, "issues": []}
If invalid, respond with: {"valid": false, "issues": ["issue 1", "issue 2", ...]}

Provide your response as JSON only.
`

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [{ role: 'user', content: validationPrompt }],
        system: 'You are a configuration validator. Respond only with JSON.',
      })

      const textContent = response.content.find((block) => block.type === 'text')
      if (textContent && textContent.type === 'text') {
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0])
          callbacks?.onProgress?.({
            step: 'validation',
            description: result.valid ? 'Validation passed' : 'Validation found issues',
            complete: true,
          })
          return result
        }
      }
    } catch (error) {
      console.error('Validation error:', error)
    }

    return { valid: false, issues: ['Validation failed'] }
  }
}
