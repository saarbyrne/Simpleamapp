'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Send, User, Sparkles, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { addAIWorkspaceMessage } from '@/app/actions/ai-workspace'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { type StructuredInputState } from './structured-input-panel'
import { enhancePrompt } from '@/lib/ai-workspace/enhance-prompt'
import { useRouter } from 'next/navigation'

interface ConversationPanelProps {
  workspace: any
  availablePlayers?: any[]
  availableEvents?: any[]
  isLoadingPlayers?: boolean
  isLoadingEvents?: boolean
  onArtifactUpdate?: (newArtifactData: any) => void
  onToggleFilters?: () => void
}

export function ConversationPanel({
  workspace,
  availablePlayers = [],
  availableEvents = [],
  isLoadingPlayers = false,
  isLoadingEvents = false,
  onArtifactUpdate,
  onToggleFilters,
}: ConversationPanelProps) {
  const t = useTranslations('aiWorkspace.canvas.conversation')
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState(workspace.messages || [])
  const [structuredInputState, setStructuredInputState] = useState<StructuredInputState | null>(null)
  const [progressStep, setProgressStep] = useState<string | null>(null)
  const [thinkingContent, setThinkingContent] = useState<string>('')
  const [showThinking, setShowThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasTriggeredInitialGeneration = useRef(false)

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Auto-trigger generation on first load if workspace is new and has no artifact
  useEffect(() => {
    // Check if this is a newly created workspace that needs initial generation
    // A new workspace will have:
    // - status: 'draft'
    // - no artifactData or empty artifactData
    // - only 1 initial message (the user's prompt)
    const hasOnlyInitialMessage = workspace.messages.length === 1 &&
      workspace.messages[0].role === 'user'

    const hasNoArtifact = !workspace.artifactData ||
      (typeof workspace.artifactData === 'object' &&
       Object.keys(workspace.artifactData).length === 0) ||
      (workspace.artifactData.reportConfig?.sections?.length === 0) ||
      (workspace.artifactData.whiteboardConfig?.elements?.length === 0) ||
      (workspace.artifactData.uiPageConfig?.components?.length === 0) ||
      (workspace.artifactData.planConfig?.milestones?.length === 0)

    const shouldAutoGenerate =
      !hasTriggeredInitialGeneration.current &&
      workspace.status === 'draft' &&
      hasOnlyInitialMessage &&
      hasNoArtifact

    if (shouldAutoGenerate) {
      hasTriggeredInitialGeneration.current = true

      // For initial auto-generation, we already have the user message stored
      // We just need to trigger the AI generation without adding a new message
      const initialPrompt = workspace.messages[0].content

      // Trigger generation directly without adding a new user message
      triggerGeneration(initialPrompt, initialPrompt)
    }
  }, [])

  const triggerGeneration = async (userMessage: string, enhancedMessage?: string) => {
    setIsProcessing(true)

    try {
      // Add placeholder for streaming assistant message
      const assistantMessageId = `assistant-${Date.now()}`
      setMessages((prev: any[]) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        },
      ])

      // Use enhanced message if provided, otherwise use original
      const messageToSend = enhancedMessage || userMessage

      // Use agentic generation for reports, standard for others
      const useAgenticGeneration = workspace.artifactType === 'reports'
      const endpoint = useAgenticGeneration
        ? '/api/ai-workspace/generate-agentic'
        : '/api/ai-workspace/generate'

      // Call AI generation API with streaming
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: workspace.id,
          message: messageToSend,
          structuredData: structuredInputState,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let buffer = ''
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'progress') {
                // Update progress indicator
                setProgressStep(data.complete ? null : `${data.step}: ${data.description}`)
              } else if (data.type === 'thinking') {
                // Accumulate thinking content
                setThinkingContent((prev) => prev + data.content)
                setShowThinking(true)
              } else if (data.type === 'delta' && data.content) {
                fullContent += data.content
                // Update the assistant message with streamed content
                setMessages((prev: any[]) =>
                  prev.map((msg: any) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                )
              } else if (data.type === 'tool_use') {
                // Show tool execution (optional)
                console.log('Tool used:', data.toolName, data.toolInput)
              } else if (data.type === 'done') {
                // Stream complete - notify parent of artifact update
                if (data.artifactData && onArtifactUpdate) {
                  onArtifactUpdate(data.artifactData)
                }
                setProgressStep(null)
                toast.success('Artifact generated successfully')
                // Refresh to get updated data
                router.refresh()
                break
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }

      setIsProcessing(false)
    } catch (error) {
      console.error('Error generating:', error)
      toast.error('Failed to generate artifact')
      setIsProcessing(false)
    }
  }

  const proceedWithGeneration = async (userMessage: string) => {
    setIsProcessing(true)
    setThinkingContent('') // Reset thinking for new generation
    setShowThinking(false)

    // Enhance prompt with structured inputs if available
    let enhancedMessage = userMessage
    if (structuredInputState) {
      const playerNames: Record<string, string> = {}
      availablePlayers.forEach((p: any) => {
        playerNames[p.id] = p.name
      })

      const eventNames: Record<string, string> = {}
      availableEvents.forEach((e: any) => {
        eventNames[e.id] = e.name
      })

      enhancedMessage = enhancePrompt({
        freeText: userMessage,
        criteria: structuredInputState.criteria || [],
        artifactInputs: structuredInputState.artifactInputs,
        artifactType: workspace.artifactType,
        currentArtifactData: workspace.artifactData,
        playerNames,
        eventNames,
      })
    }

    // Optimistically add user message
    const newUserMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage || '(Using structured inputs)',
      createdAt: new Date(),
    }
    setMessages((prev: any[]) => [...prev, newUserMessage])

    try {
      // Save user message
      const result = await addAIWorkspaceMessage(
        workspace.id,
        'user',
        enhancedMessage
      )

      if (!result.success) {
        throw new Error('Failed to send message')
      }

      // Trigger AI generation
      await triggerGeneration(userMessage, enhancedMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      setMessages((prev: any[]) =>
        prev.filter((msg: any) => !msg.id.startsWith('temp-'))
      )
      setIsProcessing(false)
    }
  }

  const handleSendMessage = async () => {
    if ((!message.trim() && !structuredInputState) || isProcessing) return

    const userMessage = message.trim()
    setMessage('')

    // Proceed directly with generation
    await proceedWithGeneration(userMessage)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Conversation History */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg: any, index: number) => (
            <div
              key={msg.id || index}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {/* Thinking Display - Inline Latest Thought */}
          {showThinking && thinkingContent && (
            <div className="mt-2 flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                <Brain className="h-3.5 w-3.5 animate-pulse text-muted-foreground" />
              </div>
              <div className="flex-1 rounded-md bg-muted/50 px-3 py-1.5">
                <p className="text-xs italic text-muted-foreground">
                  {thinkingContent.split('\n').slice(-3).join(' ').substring(0, 200)}
                  {thinkingContent.length > 200 ? '...' : ''}
                </p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-4 w-4 animate-pulse text-primary-foreground" />
              </div>
              <div className="space-y-2 rounded-lg bg-muted px-4 py-2">
                {progressStep && (
                  <div className="text-xs text-muted-foreground">
                    {progressStep}
                  </div>
                )}
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.2s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="mb-2 flex justify-end">
          {onToggleFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFilters}
              className="gap-2 text-xs"
            >
              <Sparkles className="h-3 w-3" />
              Filters
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('inputPlaceholder')}
            className="min-h-[80px] resize-none"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isProcessing}
            size="icon"
            className="h-[80px] w-[80px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
