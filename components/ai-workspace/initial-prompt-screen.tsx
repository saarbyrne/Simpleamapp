'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PromptComposer } from './prompt-composer'
import { toast } from 'sonner'

export function InitialPromptScreen() {
  const t = useTranslations('aiWorkspace')
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleAccept = async (prompt: string, artifactType: string, variables: any) => {
    setIsCreating(true)

    try {
      const response = await fetch('/api/ai-workspace/accept-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          artifactType,
          variables
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create workspace')
      }

      const result = await response.json()

      if (!result.workspaceId) {
        throw new Error('No workspace ID returned')
      }

      router.push(`/dashboard/ai-workspace/${result.workspaceId}`)
      toast.success(t('messages.workspaceCreated'))
    } catch (error) {
      console.error('Error creating workspace:', error)
      toast.error(t('messages.failedToCreate'))
      setIsCreating(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t('initialPrompt.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('initialPrompt.description')}
          </p>
        </div>

        {/* Prompt Composer */}
        <div className="relative z-10">
          <PromptComposer
            onAccept={handleAccept}
            isProcessing={isCreating}
          />
        </div>

        {/* Examples / Hints */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground pt-8">
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <strong className="block text-foreground mb-1">Reports</strong>
            "Show me wellness trends for the defenders over the last month"
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <strong className="block text-foreground mb-1">Whiteboards</strong>
            "Draw a 4-3-3 formation for the match against City"
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <strong className="block text-foreground mb-1">Plans</strong>
            "Create a 6-week return to play schedule for a hamstring injury"
          </div>
        </div>
      </div>
    </div>
  )
}
