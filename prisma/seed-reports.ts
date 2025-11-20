import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedReportTemplates() {
  console.log('Seeding report templates...')

  // Player Performance Summary Template
  await prisma.reportTemplate.upsert({
    where: { id: 'player-performance-summary' },
    update: {},
    create: {
      id: 'player-performance-summary',
      name: 'Player Performance Summary',
      description: 'Comprehensive overview of individual player wellness, load, and attendance metrics',
      category: 'player',
      isGlobal: true,
      config: {
        dataSources: [
          { type: 'form', name: 'Wellness Forms' },
          { type: 'spreadsheet', name: 'Load Tracking' },
          { type: 'event', name: 'Attendance' },
        ],
        visualization: 'dashboard',
        filters: {
          dateRange: { from: 'last_30_days' },
        },
        kpis: [
          { id: 'attendance_rate', label: 'Attendance Rate', metric: 'percentage', format: 'percentage' },
          { id: 'avg_wellness', label: 'Avg Wellness', metric: 'average', format: 'number' },
          { id: 'total_load', label: 'Total Load', metric: 'sum', format: 'number' },
        ],
      },
      sections: [
        {
          id: 'stats',
          type: 'stats',
          size: 'full',
          config: {
            kpis: [
              { id: 'attendance_rate', label: 'Attendance Rate', metric: 'percentage' },
              { id: 'avg_wellness', label: 'Avg Wellness', metric: 'average' },
              { id: 'total_load', label: 'Total Load', metric: 'sum' },
            ],
          },
        },
        {
          id: 'wellness_trend',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'line',
            title: 'Wellness Trend',
            xAxis: 'date',
            yAxis: 'wellness_score',
          },
        },
        {
          id: 'load_by_week',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'bar',
            title: 'Load by Week',
            xAxis: 'week',
            yAxis: 'total_load',
          },
        },
      ],
    },
  })

  // Squad Wellness Overview Template
  await prisma.reportTemplate.upsert({
    where: { id: 'squad-wellness-overview' },
    update: {},
    create: {
      id: 'squad-wellness-overview',
      name: 'Squad Wellness Overview',
      description: 'Team-wide wellness heatmap showing player readiness and trends',
      category: 'team',
      isGlobal: true,
      config: {
        dataSources: [
          { type: 'form', name: 'Wellness Forms' },
        ],
        visualization: 'dashboard',
        filters: {
          dateRange: { from: 'last_7_days' },
        },
      },
      sections: [
        {
          id: 'wellness_heatmap',
          type: 'chart',
          size: 'full',
          config: {
            visualization: 'heatmap',
            title: 'Wellness Heatmap (Last 7 Days)',
            rows: 'players',
            columns: 'dates',
            values: 'wellness_score',
          },
        },
        {
          id: 'team_averages',
          type: 'stats',
          size: 'full',
          config: {
            kpis: [
              { id: 'avg_sleep', label: 'Avg Sleep', metric: 'average' },
              { id: 'avg_soreness', label: 'Avg Soreness', metric: 'average' },
              { id: 'avg_energy', label: 'Avg Energy', metric: 'average' },
            ],
          },
        },
      ],
    },
  })

  // Load Distribution Template
  await prisma.reportTemplate.upsert({
    where: { id: 'load-distribution' },
    update: {},
    create: {
      id: 'load-distribution',
      name: 'Load Distribution',
      description: 'Training load analysis across squad with position and role breakdowns',
      category: 'performance',
      isGlobal: true,
      config: {
        dataSources: [
          { type: 'spreadsheet', name: 'Load Tracking' },
          { type: 'player', name: 'Player Data' },
        ],
        visualization: 'dashboard',
        filters: {
          dateRange: { from: 'last_30_days' },
        },
      },
      sections: [
        {
          id: 'load_by_position',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'bar',
            title: 'Average Load by Position',
            xAxis: 'position',
            yAxis: 'load',
            aggregation: 'average',
          },
        },
        {
          id: 'load_trends',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'line',
            title: 'Load Trends (4 Weeks)',
            xAxis: 'week',
            yAxis: 'total_load',
          },
        },
      ],
    },
  })

  // Injury Report Template
  await prisma.reportTemplate.upsert({
    where: { id: 'injury-report' },
    update: {},
    create: {
      id: 'injury-report',
      name: 'Injury Report',
      description: 'Injury incidence, time loss, and return to play tracking',
      category: 'medical',
      isGlobal: true,
      config: {
        dataSources: [
          { type: 'note', name: 'Medical Notes' },
          { type: 'event', name: 'Medical Events' },
        ],
        visualization: 'dashboard',
        filters: {
          dateRange: { from: 'last_90_days' },
          tags: ['injury', 'medical'],
        },
      },
      sections: [
        {
          id: 'injury_count',
          type: 'stats',
          size: 'full',
          config: {
            kpis: [
              { id: 'total_injuries', label: 'Total Injuries', metric: 'count' },
              { id: 'avg_recovery_days', label: 'Avg Recovery Days', metric: 'average' },
              { id: 'active_injuries', label: 'Active Injuries', metric: 'count' },
            ],
          },
        },
        {
          id: 'injury_by_type',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'pie',
            title: 'Injuries by Type',
            dataKey: 'injury_type',
            valueKey: 'count',
          },
        },
        {
          id: 'injury_timeline',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'line',
            title: 'Injury Incidence Over Time',
            xAxis: 'month',
            yAxis: 'injury_count',
          },
        },
      ],
    },
  })

  // Attendance Report Template
  await prisma.reportTemplate.upsert({
    where: { id: 'attendance-report' },
    update: {},
    create: {
      id: 'attendance-report',
      name: 'Attendance Report',
      description: 'Player attendance patterns by event type and date range',
      category: 'team',
      isGlobal: true,
      config: {
        dataSources: [
          { type: 'event', name: 'Events & Attendance' },
        ],
        visualization: 'dashboard',
        filters: {
          dateRange: { from: 'last_30_days' },
        },
      },
      sections: [
        {
          id: 'attendance_stats',
          type: 'stats',
          size: 'full',
          config: {
            kpis: [
              { id: 'overall_rate', label: 'Overall Rate', metric: 'percentage', format: 'percentage' },
              { id: 'training_rate', label: 'Training Rate', metric: 'percentage', format: 'percentage' },
              { id: 'match_rate', label: 'Match Rate', metric: 'percentage', format: 'percentage' },
            ],
          },
        },
        {
          id: 'attendance_by_event',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'bar',
            title: 'Attendance by Event Type',
            xAxis: 'event_type',
            yAxis: 'attendance_rate',
          },
        },
        {
          id: 'attendance_trend',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'line',
            title: 'Attendance Trend',
            xAxis: 'date',
            yAxis: 'attendance_rate',
          },
        },
      ],
    },
  })

  // Performance Metrics Template
  await prisma.reportTemplate.upsert({
    where: { id: 'performance-metrics' },
    update: {},
    create: {
      id: 'performance-metrics',
      name: 'Performance Metrics Dashboard',
      description: 'Key performance indicators and statistics dashboard',
      category: 'performance',
      isGlobal: true,
      config: {
        dataSources: [
          { type: 'spreadsheet', name: 'Performance Data' },
          { type: 'form', name: 'Performance Forms' },
        ],
        visualization: 'dashboard',
        filters: {
          dateRange: { from: 'last_30_days' },
        },
      },
      sections: [
        {
          id: 'key_metrics',
          type: 'stats',
          size: 'full',
          config: {
            kpis: [
              { id: 'avg_distance', label: 'Avg Distance (km)', metric: 'average', format: 'number' },
              { id: 'avg_high_speed', label: 'Avg High Speed Runs', metric: 'average', format: 'number' },
              { id: 'avg_sprint_count', label: 'Avg Sprints', metric: 'average', format: 'number' },
            ],
          },
        },
        {
          id: 'distance_trend',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'area',
            title: 'Distance Covered Trend',
            xAxis: 'date',
            yAxis: 'total_distance',
          },
        },
        {
          id: 'sprint_analysis',
          type: 'chart',
          size: 'half',
          config: {
            visualization: 'bar',
            title: 'Sprint Analysis by Position',
            xAxis: 'position',
            yAxis: 'sprint_count',
            aggregation: 'sum',
          },
        },
      ],
    },
  })

  console.log('Report templates seeded successfully!')
}

async function main() {
  try {
    await seedReportTemplates()
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
