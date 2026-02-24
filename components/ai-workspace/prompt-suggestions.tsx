'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SuggestionTag {
  type: string
  label: string
  value: any
  category: 'population' | 'outcome' | 'comparison' | 'time' | 'visualization' | 'other'
}

interface PromptSuggestionsProps {
  message: string
  tags: SuggestionTag[]
  onAccept: (selectedTags: SuggestionTag[]) => void
  onSkip: () => void
  isLoading?: boolean
}

export function PromptSuggestions({
  message,
  tags,
  onAccept,
  onSkip,
  isLoading = false,
}: PromptSuggestionsProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const toggleTag = (tagLabel: string) => {
    const newSelected = new Set(selectedTags)
    if (newSelected.has(tagLabel)) {
      newSelected.delete(tagLabel)
    } else {
      newSelected.add(tagLabel)
    }
    setSelectedTags(newSelected)
  }

  const handleAccept = () => {
    const selected = tags.filter((tag) => selectedTags.has(tag.label))
    onAccept(selected)
  }

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-accent p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-foreground">Analyzing your prompt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-accent p-4">
      {/* Header with message */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
        <p className="text-sm text-foreground">{message}</p>
      </div>

      {/* Tag suggestions */}
      <div className="flex flex-wrap gap-2 ps-8">
        {tags.map((tag) => {
          const isSelected = selectedTags.has(tag.label)
          return (
            <button
              key={tag.label}
              onClick={() => toggleTag(tag.label)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-all',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-background text-foreground hover:border-primary hover:bg-accent'
              )}
            >
              {tag.label}
            </button>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between ps-8 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Skip, continue anyway
        </Button>
        <Button
          onClick={handleAccept}
          disabled={selectedTags.size === 0}
          size="sm"
          className="gap-2"
        >
          Continue with {selectedTags.size > 0 ? selectedTags.size : ''} tag
          {selectedTags.size !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
