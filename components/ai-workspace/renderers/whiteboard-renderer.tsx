'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Move, Flag } from 'lucide-react'

interface WhiteboardRendererProps {
  workspace: any
}

export function WhiteboardRenderer({ workspace }: WhiteboardRendererProps) {
  const artifactData = workspace.artifactData
  const whiteboardConfig = artifactData?.whiteboardConfig

  if (!whiteboardConfig) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Whiteboard Configuration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to generate a tactical whiteboard
          </p>
        </div>
      </div>
    )
  }

  const {
    title = 'Tactical Plan',
    sportType = 'soccer',
    formation,
    elements = [],
    annotations = [],
  } = whiteboardConfig

  // Field dimensions (percentage-based for responsiveness)
  const fieldColor = sportType === 'soccer' ? 'bg-green-100 dark:bg-green-950' : 'bg-amber-50 dark:bg-amber-950'

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{sportType}</Badge>
            {formation && <Badge variant="secondary">{formation}</Badge>}
          </div>
        </div>
      </div>

      {/* Tactical Field */}
      <Card>
        <CardContent className="p-6">
          <div className={`relative aspect-[2/3] w-full overflow-hidden rounded-lg border-2 border-border ${fieldColor}`}>
            {/* Field markings based on sport */}
            {sportType === 'soccer' && (
              <>
                {/* Center line */}
                <div className="absolute start-0 end-0 top-1/2 h-0.5 bg-white/50" />
                {/* Center circle */}
                <div className="absolute start-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50" />
                {/* Penalty areas */}
                <div className="absolute bottom-0 start-1/2 h-20 w-48 -translate-x-1/2 border-2 border-t-2 border-white/50" />
                <div className="absolute start-1/2 top-0 h-20 w-48 -translate-x-1/2 border-2 border-b-2 border-white/50" />
              </>
            )}

            {/* Render Elements (Players, Arrows, etc.) */}
            {elements.map((element: any, index: number) => {
              if (element.type === 'player') {
                return (
                  <div
                    key={index}
                    className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                    style={{
                      left: `${element.position?.x || 50}%`,
                      top: `${element.position?.y || 50}%`,
                    }}
                  >
                    <span className="text-xs font-bold">{element.number || element.label}</span>
                  </div>
                )
              }

              if (element.type === 'arrow') {
                return (
                  <svg
                    key={index}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <marker
                        id={`arrowhead-${index}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3, 0 6"
                          fill="hsl(var(--primary))"
                        />
                      </marker>
                    </defs>
                    <line
                      x1={`${element.from?.x || 0}%`}
                      y1={`${element.from?.y || 0}%`}
                      x2={`${element.to?.x || 0}%`}
                      y2={`${element.to?.y || 0}%`}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      markerEnd={`url(#arrowhead-${index})`}
                    />
                    {element.label && (
                      <text
                        x={`${((element.from?.x || 0) + (element.to?.x || 0)) / 2}%`}
                        y={`${((element.from?.y || 0) + (element.to?.y || 0)) / 2}%`}
                        fill="hsl(var(--foreground))"
                        fontSize="12"
                        textAnchor="middle"
                        className="font-semibold"
                      >
                        {element.label}
                      </text>
                    )}
                  </svg>
                )
              }

              return null
            })}

            {/* Render Annotations (Zones, Notes) */}
            {annotations.map((annotation: any, index: number) => {
              if (annotation.type === 'zone') {
                return (
                  <div
                    key={`annotation-${index}`}
                    className="absolute border-2 border-dashed border-accent bg-accent/10"
                    style={{
                      left: `${annotation.area?.x || 0}%`,
                      top: `${annotation.area?.y || 0}%`,
                      width: `${annotation.area?.width || 20}%`,
                      height: `${annotation.area?.height || 20}%`,
                    }}
                  >
                    {annotation.label && (
                      <span className="absolute -top-6 start-1/2 -translate-x-1/2 rounded bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                        {annotation.label}
                      </span>
                    )}
                  </div>
                )
              }

              return null
            })}

            {/* Empty state overlay */}
            {elements.length === 0 && annotations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Move className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No tactical elements yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend/Instructions */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                #
              </div>
              <span className="text-muted-foreground">Player positions</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg className="h-8 w-8" viewBox="0 0 24 24">
                <line
                  x1="4"
                  y1="12"
                  x2="20"
                  y2="12"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  markerEnd="url(#legend-arrow)"
                />
                <defs>
                  <marker
                    id="legend-arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                  </marker>
                </defs>
              </svg>
              <span className="text-muted-foreground">Movement/passing patterns</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 border-2 border-dashed border-accent bg-accent/10" />
              <span className="text-muted-foreground">Tactical zones</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Flag className="h-5 w-5" />
            <div>
              <p className="font-medium">Interactive Editing Available</p>
              <p className="text-xs">
                This is a preview. Publish to Canvas to enable full drawing tools and editing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
