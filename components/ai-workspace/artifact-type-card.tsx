'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface ArtifactTypeCardProps {
  type: string
  label: string
  description: string
  icon: LucideIcon
  selected: boolean
  onClick: () => void
}

export function ArtifactTypeCard({
  type,
  label,
  description,
  icon: Icon,
  selected,
  onClick,
}: ArtifactTypeCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg hover:scale-105',
        'border-2',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border hover:border-primary/50'
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            selected ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
