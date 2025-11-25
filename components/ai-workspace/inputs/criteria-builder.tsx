'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Criterion {
  id: string
  label: string
  value: string
}

interface CriteriaBuilderProps {
  criteria: Criterion[]
  onChange: (criteria: Criterion[]) => void
  maxCriteria?: number
  className?: string
}

export function CriteriaBuilder({
  criteria,
  onChange,
  maxCriteria = 10,
  className,
}: CriteriaBuilderProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const addCriterion = () => {
    if (criteria.length >= maxCriteria) return

    const newCriterion: Criterion = {
      id: `criterion-${Date.now()}`,
      label: '',
      value: '',
    }

    onChange([...criteria, newCriterion])
    setFocusedId(newCriterion.id)
  }

  const removeCriterion = (id: string) => {
    onChange(criteria.filter((c) => c.id !== id))
  }

  const updateCriterion = (id: string, field: 'label' | 'value', newValue: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id ? { ...c, [field]: newValue } : c
      )
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Criteria</Label>
        {criteria.length < maxCriteria && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addCriterion}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Criteria
          </Button>
        )}
      </div>

      {criteria.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Add criteria to refine your request
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCriterion}
            className="mt-3 gap-1"
          >
            <Plus className="h-4 w-4" />
            Add First Criterion
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className={cn(
                'group relative rounded-lg border p-3 transition-colors',
                focusedId === criterion.id && 'border-primary'
              )}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Criterion name (e.g., 'Time Period', 'Player Group')"
                    value={criterion.label}
                    onChange={(e) => updateCriterion(criterion.id, 'label', e.target.value)}
                    onFocus={() => setFocusedId(criterion.id)}
                    onBlur={() => setFocusedId(null)}
                    className="h-8 text-sm font-medium"
                  />
                  <Input
                    placeholder="Value (e.g., 'Last 30 days', 'U18 Squad')"
                    value={criterion.value}
                    onChange={(e) => updateCriterion(criterion.id, 'value', e.target.value)}
                    onFocus={() => setFocusedId(criterion.id)}
                    onBlur={() => setFocusedId(null)}
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCriterion(criterion.id)}
                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove criterion</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {criteria.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {criteria.length} / {maxCriteria} criteria used
        </p>
      )}
    </div>
  )
}
