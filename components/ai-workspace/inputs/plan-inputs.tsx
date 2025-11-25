'use client'

import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { EntityMultiSelect, Entity } from '@/components/notes/entity-multi-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export interface PlanInputs {
  timeHorizon: string
  viewMode: string
  playerIds: string[]
  eventIds: string[]
}

interface PlanInputsFormProps {
  inputs: PlanInputs
  onChange: (inputs: PlanInputs) => void
  availablePlayers?: Entity[]
  availableEvents?: Entity[]
  isLoadingPlayers?: boolean
  isLoadingEvents?: boolean
}

const TIME_HORIZONS = [
  { value: '1month', label: '1 Month' },
  { value: '3months', label: '3 Months' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
  { value: 'custom', label: 'Custom' },
]

const VIEW_MODES = [
  { value: 'timeline', label: 'Timeline View', description: 'Linear timeline' },
  { value: 'calendar', label: 'Calendar View', description: 'Month by month' },
  { value: 'kanban', label: 'Kanban View', description: 'Status columns' },
]

export function PlanInputsForm({
  inputs,
  onChange,
  availablePlayers = [],
  availableEvents = [],
  isLoadingPlayers = false,
  isLoadingEvents = false,
}: PlanInputsFormProps) {
  const updateInput = (field: keyof PlanInputs, value: any) => {
    onChange({ ...inputs, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Time Horizon */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Time Horizon</Label>
        <div className="flex flex-wrap gap-2">
          {TIME_HORIZONS.map((horizon) => (
            <Badge
              key={horizon.value}
              variant={inputs.timeHorizon === horizon.value ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent"
              onClick={() => updateInput('timeHorizon', horizon.value)}
            >
              {horizon.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* View Mode */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">View Mode</Label>
        <RadioGroup
          value={inputs.viewMode}
          onValueChange={(value) => updateInput('viewMode', value)}
        >
          {VIEW_MODES.map((mode) => (
            <div key={mode.value} className="flex items-start space-x-2">
              <RadioGroupItem value={mode.value} id={`mode-${mode.value}`} className="mt-1" />
              <div className="flex-1">
                <Label
                  htmlFor={`mode-${mode.value}`}
                  className="cursor-pointer font-medium"
                >
                  {mode.label}
                </Label>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Associated Players */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Associated Players</Label>
        <EntityMultiSelect
          entities={availablePlayers}
          selectedIds={inputs.playerIds}
          onChange={(ids) => updateInput('playerIds', ids)}
          placeholder="Select players"
          emptyMessage="No players found"
          entityType="player"
          isLoading={isLoadingPlayers}
        />
        <p className="text-xs text-muted-foreground">
          Optional: Link specific players to this plan
        </p>
      </div>

      {/* Associated Events */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Associated Events</Label>
        <EntityMultiSelect
          entities={availableEvents}
          selectedIds={inputs.eventIds}
          onChange={(ids) => updateInput('eventIds', ids)}
          placeholder="Select events"
          emptyMessage="No events found"
          entityType="event"
          isLoading={isLoadingEvents}
        />
        <p className="text-xs text-muted-foreground">
          Optional: Link specific events/competitions
        </p>
      </div>
    </div>
  )
}
