'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StructuredInputPanel, type StructuredInputState } from './structured-input-panel'

interface FiltersPanelProps {
  workspace: any
  onClose: () => void
  onApply?: (state: StructuredInputState) => void
}

export function FiltersPanel({ workspace, onClose, onApply }: FiltersPanelProps) {
  const [structuredInputState, setStructuredInputState] = useState<StructuredInputState | null>(null)

  const handleApply = () => {
    if (structuredInputState && onApply) {
      onApply(structuredInputState)
    }
    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-sm font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <StructuredInputPanel
            artifactType={workspace.artifactType}
            initialPrompt={workspace.initialPrompt}
            hasArtifact={!!workspace.artifactData}
            onChange={setStructuredInputState}
            availablePlayers={[]}
            availableEvents={[]}
            isLoadingPlayers={false}
            isLoadingEvents={false}
          />
        </div>
      </ScrollArea>

      {/* Footer with Apply button */}
      <div className="border-t p-4">
        <Button
          onClick={handleApply}
          disabled={!structuredInputState}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
