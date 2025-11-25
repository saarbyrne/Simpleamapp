'use client'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WhiteboardInputs {
  sportType: string
  formation: string
  scenario: string
}

interface WhiteboardInputsFormProps {
  inputs: WhiteboardInputs
  onChange: (inputs: WhiteboardInputs) => void
}

const SPORT_TYPES = [
  { value: 'soccer', label: 'Soccer/Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'hockey', label: 'Hockey' },
  { value: 'rugby', label: 'Rugby' },
  { value: 'american-football', label: 'American Football' },
]

const SOCCER_FORMATIONS = [
  { value: '4-4-2', label: '4-4-2', description: 'Classic formation' },
  { value: '4-3-3', label: '4-3-3', description: 'Attacking' },
  { value: '3-5-2', label: '3-5-2', description: 'Wing backs' },
  { value: '4-2-3-1', label: '4-2-3-1', description: 'Modern' },
  { value: '5-3-2', label: '5-3-2', description: 'Defensive' },
  { value: '3-4-3', label: '3-4-3', description: 'High press' },
]

const SCENARIOS = [
  { value: 'attack', label: 'Attacking Play', description: 'Offensive strategies' },
  { value: 'defense', label: 'Defensive Setup', description: 'Defensive positioning' },
  { value: 'pressing', label: 'Pressing System', description: 'High pressure tactics' },
  { value: 'transition', label: 'Transition', description: 'Counter attacks' },
  { value: 'set-piece', label: 'Set Piece', description: 'Corners, free kicks' },
  { value: 'build-up', label: 'Build-Up Play', description: 'Playing from back' },
]

export function WhiteboardInputsForm({
  inputs,
  onChange,
}: WhiteboardInputsFormProps) {
  const updateInput = (field: keyof WhiteboardInputs, value: string) => {
    onChange({ ...inputs, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Sport Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sport</Label>
        <RadioGroup
          value={inputs.sportType}
          onValueChange={(value) => updateInput('sportType', value)}
        >
          {SPORT_TYPES.map((sport) => (
            <div key={sport.value} className="flex items-center space-x-2">
              <RadioGroupItem value={sport.value} id={`sport-${sport.value}`} />
              <Label
                htmlFor={`sport-${sport.value}`}
                className="cursor-pointer font-normal"
              >
                {sport.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Formation (Soccer only for now) */}
      {inputs.sportType === 'soccer' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Formation</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SOCCER_FORMATIONS.map((formation) => (
              <Card
                key={formation.value}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  inputs.formation === formation.value &&
                    'border-primary bg-primary/5'
                )}
                onClick={() => updateInput('formation', formation.value)}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Users className="h-6 w-6 mb-2 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">{formation.label}</h4>
                  <p className="text-xs text-muted-foreground text-center">
                    {formation.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scenario */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tactical Scenario</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SCENARIOS.map((scenario) => (
            <Card
              key={scenario.value}
              className={cn(
                'cursor-pointer transition-all hover:border-primary',
                inputs.scenario === scenario.value &&
                  'border-primary bg-primary/5'
              )}
              onClick={() => updateInput('scenario', scenario.value)}
            >
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">{scenario.label}</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {scenario.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
