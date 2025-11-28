'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowUp, Loader2 } from 'lucide-react'
import { EnhancedPromptCard } from './enhanced-prompt-card'
import type { Variable } from './variable-chip'
import { toast } from 'sonner'

interface PromptComposerProps {
    onAccept: (prompt: string, artifactType: string, variables: any) => void
    isProcessing?: boolean
}

export function PromptComposer({ onAccept, isProcessing: externalProcessing }: PromptComposerProps) {
    const [input, setInput] = useState('')
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [enhancedData, setEnhancedData] = useState<{
        template: string
        variables: Variable[]
        artifactType: string
        confidence: number
    } | null>(null)

    const handleEnhance = async () => {
        if (!input.trim()) return

        setIsEnhancing(true)
        try {
            // Call the API to enhance the prompt
            const response = await fetch('/api/ai-workspace/enhance-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input }),
            })

            if (!response.ok) throw new Error('Failed to enhance prompt')

            const data = await response.json()
            setEnhancedData(data)
        } catch (error) {
            console.error('Error enhancing prompt:', error)
            toast.error('Failed to interpret prompt. Please try again.')
        } finally {
            setIsEnhancing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleEnhance()
        }
    }

    if (enhancedData) {
        return (
            <EnhancedPromptCard
                originalPrompt={input}
                enhancedPromptTemplate={enhancedData.template}
                variables={enhancedData.variables}
                artifactType={enhancedData.artifactType}
                confidence={enhancedData.confidence}
                onAccept={(finalPrompt, variables) => {
                    onAccept(finalPrompt, enhancedData.artifactType, variables)
                    // Reset after acceptance if needed, or let parent handle unmount
                }}
                onEdit={() => setEnhancedData(null)} // Go back to raw input
                onRegenerate={handleEnhance}
            />
        )
    }

    return (
        <Card className="relative overflow-hidden border-primary/20 shadow-lg transition-all focus-within:ring-1 focus-within:ring-primary/50">
            <div className="p-4">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you want to create (e.g., 'Weekly wellness report for the defenders')..."
                    className="min-h-[100px] w-full resize-none border-0 bg-transparent p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                    autoFocus
                />
            </div>
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2">
                <div className="text-xs text-muted-foreground">
                    Press <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">Enter</kbd> to generate
                </div>
                <Button
                    size="sm"
                    onClick={handleEnhance}
                    disabled={!input.trim() || isEnhancing || externalProcessing}
                    className="gap-2"
                >
                    {isEnhancing || externalProcessing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            Generate
                            <ArrowUp className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </Card>
    )
}
