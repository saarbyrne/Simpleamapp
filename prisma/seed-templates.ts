import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const officialTemplates = [
  // Forms
  {
    type: 'form',
    name: 'Daily Wellness Check',
    description: 'Quick daily wellness assessment for athletes tracking sleep, soreness, mood, and readiness',
    longDescription: `A comprehensive daily wellness form designed to monitor athlete wellbeing and readiness to train. This template includes:

- Sleep quality and duration tracking
- Muscle soreness rating (1-10 scale)
- Energy level assessment
- Mood evaluation
- Stress level monitoring
- Injury status check
- Notes section for additional comments

Perfect for coaches who want to monitor athlete wellness trends and identify potential issues before they become serious problems. Use this daily or before training sessions to optimize training loads.`,
    category: 'wellness',
    sport: 'multi-sport',
    tags: ['wellness', 'daily', 'quick', 'readiness', 'monitoring'],
    features: ['Pre-filled fields', 'Mobile-friendly', 'Quick completion', 'Data export'],
    config: {
      fields: [
        { type: 'number', label: 'Sleep Hours', required: true },
        { type: 'scale', label: 'Sleep Quality (1-10)', required: true },
        { type: 'scale', label: 'Muscle Soreness (1-10)', required: true },
        { type: 'scale', label: 'Energy Level (1-10)', required: true },
        { type: 'select', label: 'Mood', options: ['Great', 'Good', 'Neutral', 'Low', 'Poor'], required: true },
        { type: 'scale', label: 'Stress Level (1-10)', required: true },
        { type: 'boolean', label: 'Any injuries or concerns?', required: true },
        { type: 'textarea', label: 'Additional Notes', required: false },
      ],
    },
    isOfficial: true,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date(),
  },
  {
    type: 'form',
    name: 'Match Readiness Assessment',
    description: 'Pre-match readiness evaluation covering physical and mental preparedness',
    longDescription: `Evaluate player readiness before matches with this comprehensive assessment form. Helps coaches make informed selection decisions and optimize player performance.

Includes physical readiness indicators, mental state assessment, confidence levels, and tactical understanding checks.`,
    category: 'performance',
    sport: 'football',
    tags: ['match', 'readiness', 'pre-game', 'performance'],
    features: ['Conditional logic', 'Mobile-friendly', 'Team collaboration'],
    config: {
      fields: [
        { type: 'scale', label: 'Physical Readiness (1-10)', required: true },
        { type: 'scale', label: 'Mental Readiness (1-10)', required: true },
        { type: 'scale', label: 'Confidence Level (1-10)', required: true },
        { type: 'boolean', label: 'Fully understand match tactics?', required: true },
        { type: 'textarea', label: 'Any concerns?', required: false },
      ],
    },
    isOfficial: true,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date(),
  },
  {
    type: 'form',
    name: 'Injury Report',
    description: 'Comprehensive injury documentation and tracking form for medical staff',
    longDescription: `Medical staff injury report template for documenting injuries, treatments, and recovery progress. Essential for maintaining accurate medical records and tracking recovery timelines.`,
    category: 'medical',
    sport: 'multi-sport',
    tags: ['injury', 'medical', 'documentation', 'tracking'],
    features: ['Pre-filled fields', 'Custom validation', 'Data export'],
    config: {
      fields: [
        { type: 'select', label: 'Injury Type', options: ['Muscle', 'Ligament', 'Bone', 'Joint', 'Other'], required: true },
        { type: 'text', label: 'Location', required: true },
        { type: 'date', label: 'Date of Injury', required: true },
        { type: 'textarea', label: 'Description', required: true },
        { type: 'text', label: 'Treatment Plan', required: true },
        { type: 'number', label: 'Expected Recovery (days)', required: false },
      ],
    },
    isOfficial: true,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date(),
  },

  // Reports
  {
    type: 'report',
    name: 'Player Performance Summary',
    description: 'Weekly performance metrics dashboard for individual player tracking',
    longDescription: `Comprehensive performance report template showing key metrics, trends, and insights for individual players. Includes training load, wellness trends, and performance indicators.`,
    category: 'performance',
    sport: 'multi-sport',
    tags: ['performance', 'analytics', 'weekly', 'individual'],
    features: ['Analytics', 'Data export', 'Print-ready'],
    config: {
      dataSources: ['forms', 'spreadsheets'],
      visualizations: ['line-chart', 'bar-chart', 'table'],
      metrics: ['training-load', 'wellness-score', 'injury-status'],
    },
    isOfficial: true,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date(),
  },
  {
    type: 'report',
    name: 'Squad Wellness Overview',
    description: 'Team-wide wellness dashboard showing trends and alerts',
    longDescription: `Monitor team wellness at a glance with this comprehensive dashboard. Identifies players who may need attention and tracks overall team wellness trends.`,
    category: 'wellness',
    sport: 'multi-sport',
    tags: ['wellness', 'team', 'dashboard', 'monitoring'],
    features: ['Analytics', 'Team collaboration', 'Print-ready'],
    config: {
      dataSources: ['wellness-forms'],
      visualizations: ['heatmap', 'line-chart', 'alert-table'],
      metrics: ['average-wellness', 'at-risk-players', 'trends'],
    },
    isOfficial: true,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date(),
  },

  // Drawings
  {
    type: 'drawing',
    name: '4-3-3 Formation',
    description: 'Classic 4-3-3 attacking formation template for football/soccer',
    longDescription: `Standard 4-3-3 formation template perfect for planning attacking football. Includes player positions, movement patterns, and tactical notes section.`,
    category: 'tactics',
    sport: 'football',
    tags: ['formation', '4-3-3', 'tactics', 'football'],
    features: ['Pre-filled fields', 'Mobile-friendly', 'Print-ready'],
    config: {
      elements: [
        { type: 'player', position: { x: 50, y: 90 }, label: 'GK' },
        { type: 'player', position: { x: 20, y: 70 }, label: 'LB' },
        { type: 'player', position: { x: 40, y: 70 }, label: 'CB' },
        { type: 'player', position: { x: 60, y: 70 }, label: 'CB' },
        { type: 'player', position: { x: 80, y: 70 }, label: 'RB' },
        { type: 'player', position: { x: 35, y: 50 }, label: 'CM' },
        { type: 'player', position: { x: 50, y: 50 }, label: 'CM' },
        { type: 'player', position: { x: 65, y: 50 }, label: 'CM' },
        { type: 'player', position: { x: 20, y: 25 }, label: 'LW' },
        { type: 'player', position: { x: 50, y: 20 }, label: 'ST' },
        { type: 'player', position: { x: 80, y: 25 }, label: 'RW' },
      ],
    },
    isOfficial: true,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date(),
  },

  // Plans
  {
    type: 'plan',
    name: 'Season Plan Template',
    description: 'Complete season planning framework with phases, goals, and milestones',
    longDescription: `Comprehensive season planning template covering pre-season, in-season, and post-season phases. Includes goal setting, milestone tracking, and performance benchmarks.`,
    category: 'training',
    sport: 'multi-sport',
    tags: ['planning', 'season', 'long-term', 'goals'],
    features: ['Pre-filled fields', 'Team collaboration', 'Analytics'],
    config: {
      phases: [
        { name: 'Pre-season', duration: 6, focus: 'Base fitness and team building' },
        { name: 'Early season', duration: 8, focus: 'Competition preparation' },
        { name: 'Mid-season', duration: 12, focus: 'Peak performance' },
        { name: 'Late season', duration: 6, focus: 'Playoffs and championships' },
        { name: 'Post-season', duration: 2, focus: 'Recovery and reflection' },
      ],
      milestones: [
        'Fitness testing complete',
        'Tactical system implemented',
        'Squad depth established',
        'Peak form achieved',
      ],
    },
    isOfficial: true,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date(),
  },
  {
    type: 'plan',
    name: '6-Week Rehab Protocol',
    description: 'Structured rehabilitation program for return from injury',
    longDescription: `Evidence-based rehabilitation protocol covering 6 weeks from injury to return to play. Includes progressive loading, milestone checkpoints, and medical clearance stages.`,
    category: 'medical',
    sport: 'multi-sport',
    tags: ['rehab', 'injury', 'recovery', 'medical'],
    features: ['Pre-filled fields', 'Custom validation', 'Team collaboration'],
    config: {
      weeks: [
        { week: 1, focus: 'Pain management and mobility', activities: ['Ice', 'Gentle ROM', 'Pool work'] },
        { week: 2, focus: 'Strength foundation', activities: ['Bodyweight exercises', 'Pool running', 'Bike'] },
        { week: 3, focus: 'Progressive loading', activities: ['Light weights', 'Straight-line running', 'Balance work'] },
        { week: 4, focus: 'Sport-specific movements', activities: ['Change of direction', 'Jumping', 'Sport drills'] },
        { week: 5, focus: 'Team integration', activities: ['Modified training', 'Contact work', 'Position-specific'] },
        { week: 6, focus: 'Return to play', activities: ['Full training', 'Medical clearance', 'Match fitness'] },
      ],
      checkpoints: [
        'Pain-free ROM achieved',
        'Strength 90% of uninjured side',
        'Running mechanics cleared',
        'Medical clearance obtained',
      ],
    },
    isOfficial: true,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date(),
  },

  // Spreadsheets
  {
    type: 'spreadsheet',
    name: 'Training Load Tracker',
    description: 'Weekly training load monitoring with RPE and session duration',
    longDescription: `Track training load using session RPE method. Monitor weekly load, calculate acute:chronic ratios, and identify injury risk based on training load patterns.`,
    category: 'performance',
    sport: 'multi-sport',
    tags: ['training-load', 'monitoring', 'RPE', 'analytics'],
    features: ['Pre-filled fields', 'Analytics', 'Data export'],
    config: {
      columns: [
        { name: 'Date', type: 'date' },
        { name: 'Session Type', type: 'text' },
        { name: 'Duration (min)', type: 'number' },
        { name: 'RPE (1-10)', type: 'number' },
        { name: 'Load', type: 'formula', formula: 'Duration * RPE' },
        { name: 'Notes', type: 'text' },
      ],
      calculations: ['Weekly Total', 'Acute Load (7-day)', 'Chronic Load (28-day)', 'AC Ratio'],
    },
    isOfficial: true,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date(),
  },
]

async function seedOfficialTemplates() {
  console.log('🌱 Seeding official templates...')

  for (const template of officialTemplates) {
    try {
      const created = await prisma.communityTemplate.create({
        data: template,
      })
      console.log(`✅ Created: ${created.name} (${created.type})`)
    } catch (error) {
      console.error(`❌ Failed to create ${template.name}:`, error)
    }
  }

  console.log('✨ Seeding complete!')
}

// Run the seed function
seedOfficialTemplates()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
