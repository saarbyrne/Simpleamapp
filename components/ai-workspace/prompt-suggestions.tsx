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
      <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-blue-900">Analyzing your prompt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
      {/* Header with message */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
          <Check className="h-3 w-3 text-white" />
        </div>
        <p className="text-sm text-blue-900">{message}</p>
      </div>

      {/* Tag suggestions */}
      <div className="flex flex-wrap gap-2 pl-8">
        {tags.map((tag) => {
          const isSelected = selectedTags.has(tag.label)
          return (
            <button
              key={tag.label}
              onClick={() => toggleTag(tag.label)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-all',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              )}
            >
              {tag.label}
            </button>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pl-8 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-xs text-gray-600 hover:text-gray-900"
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
