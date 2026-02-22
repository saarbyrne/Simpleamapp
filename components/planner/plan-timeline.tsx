'use client'

import { useMemo } from 'react'
import { format, differenceInDays, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/components/ui/utils'

type Milestone = {
  id: string
  title: string
  startDate?: Date | null
  endDate?: Date | null
  dueDate?: Date | null
  status: string
}

type PlanTimelineProps = {
  startDate: Date
  endDate: Date
  milestones: Milestone[]
}

const statusColors = {
  pending: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  complete: 'bg-green-500',
  blocked: 'bg-red-500',
}

export function PlanTimeline({ startDate, endDate, milestones }: PlanTimelineProps) {
  const planStart = new Date(startDate)
  const planEnd = new Date(endDate)
  const today = new Date()

  const months = useMemo(() => {
    return eachMonthOfInterval({ start: planStart, end: planEnd })
  }, [planStart, planEnd])

  const totalDays = differenceInDays(planEnd, planStart)

  const getPositionAndWidth = (itemStart?: Date | null, itemEnd?: Date | null) => {
    if (!itemStart) return null

    const start = new Date(itemStart)
    const end = itemEnd ? new Date(itemEnd) : start

    const daysFromStart = differenceInDays(start, planStart)
    const duration = differenceInDays(end, start) || 1

    const left = (daysFromStart / totalDays) * 100
    const width = (duration / totalDays) * 100

    return {
      left: Math.max(0, left),
      width: Math.min(100 - left, width),
    }
  }

  const todayPosition = useMemo(() => {
    if (today < planStart || today > planEnd) return null
    const daysFromStart = differenceInDays(today, planStart)
    return (daysFromStart / totalDays) * 100
  }, [today, planStart, planEnd, totalDays])

  const milestonesWithDates = milestones.filter(
    (m) => m.startDate || m.dueDate
  )

  if (milestonesWithDates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Add dates to milestones to see them on the timeline
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Month markers */}
          <div className="relative h-8 border-b border-border">
            <div className="flex absolute w-full">
              {months.map((month, index) => {
                const monthStart = startOfMonth(month)
                const monthEnd = endOfMonth(month)
                const position = getPositionAndWidth(
                  monthStart > planStart ? monthStart : planStart,
                  monthEnd < planEnd ? monthEnd : planEnd
                )

                if (!position) return null

                return (
                  <div
                    key={month.toISOString()}
                    className="absolute text-xs text-muted-foreground font-medium"
                    style={{
                      left: `${position.left}%`,
                    }}
                  >
                    {format(month, 'MMM yyyy')}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Milestones track */}
          <div className="relative space-y-2 min-h-[200px]">
            {/* Today marker */}
            {todayPosition !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
                style={{ left: `${todayPosition}%` }}
              >
                <div className="absolute -top-1 start-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge variant="default" className="text-xs">
                    Today
                  </Badge>
                </div>
              </div>
            )}

            {/* Milestone bars */}
            {milestonesWithDates.map((milestone, index) => {
              const position = getPositionAndWidth(
                milestone.startDate || milestone.dueDate,
                milestone.endDate || milestone.dueDate
              )

              if (!position) return null

              return (
                <div
                  key={milestone.id}
                  className="relative h-12"
                  style={{
                    top: `${index * 52}px`,
                  }}
                >
                  <div
                    className={cn(
                      'absolute h-8 rounded-md flex items-center px-2 text-white text-xs font-medium shadow-sm',
                      'hover:shadow-md transition-shadow cursor-pointer',
                      statusColors[milestone.status as keyof typeof statusColors] || 'bg-gray-400'
                    )}
                    style={{
                      left: `${position.left}%`,
                      width: `${position.width}%`,
                      minWidth: '60px',
                    }}
                    title={milestone.title}
                  >
                    <span className="truncate">{milestone.title}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 pt-4 border-t text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-400" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-muted-foreground">Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-muted-foreground">Blocked</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
