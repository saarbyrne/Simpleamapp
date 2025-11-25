'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { BarChart3, PencilRuler, Layout, CalendarCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArtifactTypeCard } from './artifact-type-card'
import { ArtifactType } from '@/lib/types/ai-workspace'
import { toast } from 'sonner'
import { createAIWorkspace } from '@/app/actions/ai-workspace'

interface SuggestionTag {
  type: string
  label: string
  value: any
  category: string
}

const ARTIFACT_TYPES = [
  {
    type: 'reports' as ArtifactType,
    icon: BarChart3,
  },
  {
    type: 'whiteboards' as ArtifactType,
    icon: PencilRuler,
  },
  {
    type: 'uiPages' as ArtifactType,
    icon: Layout,
  },
  {
    type: 'plans' as ArtifactType,
    icon: CalendarCheck,
  },
]

export function InitialPromptScreen() {
  const t = useTranslations('aiWorkspace')
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SuggestionTag[]>([])
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const fetchSuggestions = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description of what you want to create')
      return
    }

    setIsLoadingSuggestions(true)

    try {
      const response = await fetch('/api/ai-workspace/suggest-enhancements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          artifactType: selectedType || 'reports',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.tags) {
          setSuggestions(data.tags)
          setShowSuggestions(true)
        } else {
          // No suggestions, proceed directly
          await proceedToCreate()
        }
      } else {
        // Error getting suggestions, proceed anyway
        await proceedToCreate()
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      await proceedToCreate()
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const proceedToCreate = async () => {
    setIsCreating(true)

    try {
      // Build enhanced prompt if tags are selected
      let enhancedPrompt = prompt.trim()
      if (selectedTags.size > 0) {
        const selected = suggestions.filter((tag) => selectedTags.has(tag.label))
        const tagText = selected.map(t => `${t.type}: ${t.label}`).join(', ')
        enhancedPrompt += `\n\nRequirements: ${tagText}`
      }

      const result = await createAIWorkspace({
        prompt: enhancedPrompt,
        artifactType: selectedType || undefined,
      })

      if (!result.success || !result.workspaceId) {
        throw new Error(result.error || 'Failed to create workspace')
      }

      router.push(`/dashboard/ai-workspace/${result.workspaceId}`)
      toast.success(t('messages.workspaceCreated'))
    } catch (error) {
      console.error('Error creating workspace:', error)
      toast.error(t('messages.failedToCreate'))
      setIsCreating(false)
    }
  }

  const toggleTag = (tagLabel: string) => {
    const newSelected = new Set(selectedTags)
    if (newSelected.has(tagLabel)) {
      newSelected.delete(tagLabel)
    } else {
      newSelected.add(tagLabel)
    }
    setSelectedTags(newSelected)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('initialPrompt.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('initialPrompt.description')}
          </p>
        </div>

        {/* Artifact Type Selection */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ARTIFACT_TYPES.map((artifact) => (
            <ArtifactTypeCard
              key={artifact.type}
              type={artifact.type}
              label={t(`artifactTypes.${artifact.type}`)}
              description={t(`artifactTypes.${artifact.type}Description`)}
              icon={artifact.icon}
              selected={selectedType === artifact.type}
              onClick={() => setSelectedType(artifact.type)}
            />
          ))}
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <Textarea
            placeholder={t('initialPrompt.promptPlaceholder')}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none text-base"
            disabled={isCreating || showSuggestions}
          />

          {/* Suggestion Tags */}
          {showSuggestions && suggestions.length > 0 && (
            <Card className="p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Consider adding these elements:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((tag) => {
                  const isSelected = selectedTags.has(tag.label)
                  return (
                    <Badge
                      key={tag.label}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.label)}
                    >
                      {tag.label}
                    </Badge>
                  )
                })}
              </div>
            </Card>
          )}

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={showSuggestions ? proceedToCreate : fetchSuggestions}
              disabled={isCreating || isLoadingSuggestions || !prompt.trim()}
              className="min-w-[200px]"
            >
              {isCreating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
              ) : isLoadingSuggestions ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : showSuggestions ? (
                'Create Workspace'
              ) : (
                t('initialPrompt.submit')
              )}
            </Button>
          </div>
        </div>

        {/* Optional hint text */}
        {selectedType && (
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Creating a <strong>{t(`artifactTypes.${selectedType}`)}</strong>
              {selectedType && ' - You can change this later'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
