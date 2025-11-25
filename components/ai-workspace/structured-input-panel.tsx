'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sparkles, Settings } from 'lucide-react'
import { CriteriaBuilder, type Criterion } from './inputs/criteria-builder'
import { ReportInputsForm, type ReportInputs } from './inputs/report-inputs'
import { WhiteboardInputsForm, type WhiteboardInputs } from './inputs/whiteboard-inputs'
import { PlanInputsForm, type PlanInputs } from './inputs/plan-inputs'
import { UIPageInputsForm, type UIPageInputs } from './inputs/uipage-inputs'
import { Entity } from '@/components/notes/entity-multi-select'

export interface StructuredInputState {
  freeText: string
  criteria: Criterion[]
  artifactInputs: ReportInputs | WhiteboardInputs | PlanInputs | UIPageInputs | null
}

interface StructuredInputPanelProps {
  artifactType: string
  initialPrompt?: string
  hasArtifact?: boolean
  onChange: (state: StructuredInputState) => void
  availablePlayers?: Entity[]
  availableEvents?: Entity[]
  isLoadingPlayers?: boolean
  isLoadingEvents?: boolean
}

const DEFAULT_REPORT_INPUTS: ReportInputs = {
  timePeriod: 'last7Days',
  playerIds: [],
  metrics: ['wellness', 'trainingLoad'],
  visualizationType: 'line',
}

const DEFAULT_WHITEBOARD_INPUTS: WhiteboardInputs = {
  sportType: 'soccer',
  formation: '4-3-3',
  scenario: 'attack',
}

const DEFAULT_PLAN_INPUTS: PlanInputs = {
  timeHorizon: '3months',
  viewMode: 'timeline',
  playerIds: [],
  eventIds: [],
}

const DEFAULT_UIPAGE_INPUTS: UIPageInputs = {
  layout: 'grid',
  componentTypes: ['table', 'chart'],
  dataSources: ['players'],
}

export function StructuredInputPanel({
  artifactType,
  initialPrompt = '',
  hasArtifact = false,
  onChange,
  availablePlayers = [],
  availableEvents = [],
  isLoadingPlayers = false,
  isLoadingEvents = false,
}: StructuredInputPanelProps) {
  const [activeTab, setActiveTab] = useState(hasArtifact ? 'refine' : 'initial')
  const [freeText, setFreeText] = useState(initialPrompt)
  const [criteria, setCriteria] = useState<Criterion[]>([])
  const [artifactInputs, setArtifactInputs] = useState<any>(() => {
    switch (artifactType) {
      case 'reports':
        return DEFAULT_REPORT_INPUTS
      case 'whiteboards':
        return DEFAULT_WHITEBOARD_INPUTS
      case 'plans':
        return DEFAULT_PLAN_INPUTS
      case 'uiPages':
        return DEFAULT_UIPAGE_INPUTS
      default:
        return null
    }
  })

  // Notify parent of changes
  useEffect(() => {
    onChange({
      freeText,
      criteria,
      artifactInputs,
    })
  }, [freeText, criteria, artifactInputs, onChange])

  const renderArtifactInputs = () => {
    switch (artifactType) {
      case 'reports':
        return (
          <ReportInputsForm
            inputs={artifactInputs as ReportInputs}
            onChange={setArtifactInputs}
            availablePlayers={availablePlayers}
            isLoadingPlayers={isLoadingPlayers}
          />
        )
      case 'whiteboards':
        return (
          <WhiteboardInputsForm
            inputs={artifactInputs as WhiteboardInputs}
            onChange={setArtifactInputs}
          />
        )
      case 'plans':
        return (
          <PlanInputsForm
            inputs={artifactInputs as PlanInputs}
            onChange={setArtifactInputs}
            availablePlayers={availablePlayers}
            availableEvents={availableEvents}
            isLoadingPlayers={isLoadingPlayers}
            isLoadingEvents={isLoadingEvents}
          />
        )
      case 'uiPages':
        return (
          <UIPageInputsForm
            inputs={artifactInputs as UIPageInputs}
            onChange={setArtifactInputs}
          />
        )
      default:
        return null
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="initial" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Initial Prompt
        </TabsTrigger>
        <TabsTrigger value="refine" className="gap-2" disabled={!hasArtifact}>
          <Settings className="h-4 w-4" />
          Refine
        </TabsTrigger>
      </TabsList>

      <TabsContent value="initial" className="space-y-4 mt-4">
        {/* Free Text Area */}
        <div className="space-y-2">
          <Label htmlFor="free-text" className="text-sm font-medium">
            Describe what you want to create
          </Label>
          <Textarea
            id="free-text"
            placeholder={`e.g., "Create a weekly wellness report for the U18 squad showing fatigue trends over the last 30 days"`}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <Separator />

        {/* Structured Inputs */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Structured Options</Label>
          <Card>
            <CardContent className="pt-6">
              {renderArtifactInputs()}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Criteria Builder */}
        <CriteriaBuilder
          criteria={criteria}
          onChange={setCriteria}
          maxCriteria={10}
        />

        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">How this works:</p>
          <p>
            Combine your free-text description with structured options and custom criteria.
            The AI will use all of this to create a comprehensive {artifactType} artifact.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="refine" className="space-y-4 mt-4">
        {/* Refinement Mode */}
        <div className="space-y-2">
          <Label htmlFor="refine-text" className="text-sm font-medium">
            What would you like to change?
          </Label>
          <Textarea
            id="refine-text"
            placeholder={`e.g., "Change the time period to last 90 days" or "Add soreness and sleep metrics"`}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <Separator />

        {/* Same Structured Inputs (for direct editing) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Or adjust options directly</Label>
          <Card>
            <CardContent className="pt-6">
              {renderArtifactInputs()}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Criteria Builder */}
        <CriteriaBuilder
          criteria={criteria}
          onChange={setCriteria}
          maxCriteria={10}
        />

        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Refinement mode:</p>
          <p>
            Describe specific changes or adjust the structured options above.
            The AI will understand the current state and apply your requested modifications.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
