/**
 * Script to seed default event templates
 * Run with: npx tsx scripts/seed-templates.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding default event templates...')

  // Find the first organization to use as the default
  const org = await prisma.organization.findFirst()

  if (!org) {
    console.error('❌ No organization found. Please create an organization first.')
    process.exit(1)
  }

  console.log(`✅ Found organization: ${org.name}`)

  const defaultTemplates = [
    {
      name: 'Match Day',
      description: 'Complete match day workflow with stats, analysis, and reports',
      type: 'match',
      defaultDuration: 120,
      sections: {
        spreadsheets: true,
        notes: true,
        drawings: true,
        forms: true,
        files: true,
      },
      sectionConfigs: {
        spreadsheets: [
          { name: 'Match Stats', columns: ['Player', 'Goals', 'Assists', 'Minutes'] },
          { name: 'Opposition Analysis', columns: ['Player', 'Position', 'Threat Level'] }
        ],
        notes: [
          { name: 'Coach Observations', privacy: 'coaching_staff' },
          { name: 'Medical Notes', privacy: 'medical_staff' }
        ],
        drawings: [
          { name: 'Formation', type: 'pitch' },
          { name: 'Set Pieces', type: 'tactics' }
        ],
        forms: [
          { name: 'Post-Match Report', trigger: 'after', delay: 30, recipients: 'coaching_staff' }
        ]
      },
      organizationId: org.id,
      isGlobal: false,
    },
    {
      name: 'Training Session',
      description: 'Regular training session with drills, GPS data, and wellness checks',
      type: 'training',
      defaultDuration: 120,
      sections: {
        spreadsheets: true,
        notes: true,
        drawings: true,
        forms: true,
        files: false,
      },
      sectionConfigs: {
        spreadsheets: [
          { name: 'GPS Data', columns: ['Player', 'Distance', 'High Speed Runs', 'Sprints'] },
          { name: 'Drill Performance', columns: ['Drill', 'Duration', 'Intensity'] }
        ],
        notes: [
          { name: 'Session Plan', privacy: 'coaching_staff' }
        ],
        drawings: [
          { name: 'Session Plan Diagram', type: 'tactics' }
        ],
        forms: [
          { name: 'Wellness Check', trigger: 'after', delay: 90, recipients: 'all_players' }
        ]
      },
      organizationId: org.id,
      isGlobal: false,
    },
    {
      name: 'Medical Assessment',
      description: 'Medical check-up or injury assessment',
      type: 'medical',
      defaultDuration: 60,
      sections: {
        spreadsheets: false,
        notes: true,
        drawings: false,
        forms: true,
        files: true,
      },
      sectionConfigs: {
        notes: [
          { name: 'Assessment Notes', privacy: 'medical_staff' },
          { name: 'Treatment Plan', privacy: 'medical_staff' }
        ],
        forms: [
          { name: 'Medical Assessment Form', trigger: 'during', delay: 0, recipients: 'medical_staff' }
        ],
        files: [
          { name: 'Medical Reports', type: 'documents' }
        ]
      },
      organizationId: org.id,
      isGlobal: false,
    },
    {
      name: 'Team Meeting',
      description: 'Tactical analysis or team discussion',
      type: 'meeting',
      defaultDuration: 60,
      sections: {
        spreadsheets: false,
        notes: true,
        drawings: true,
        forms: false,
        files: true,
      },
      sectionConfigs: {
        notes: [
          { name: 'Meeting Notes', privacy: 'all_staff' }
        ],
        drawings: [
          { name: 'Tactical Board', type: 'tactics' }
        ],
        files: [
          { name: 'Presentation Materials', type: 'documents' }
        ]
      },
      organizationId: org.id,
      isGlobal: false,
    },
    {
      name: 'Recovery Session',
      description: 'Post-match or post-training recovery',
      type: 'training',
      defaultDuration: 60,
      sections: {
        spreadsheets: true,
        notes: true,
        drawings: false,
        forms: true,
        files: false,
      },
      sectionConfigs: {
        spreadsheets: [
          { name: 'Recovery Metrics', columns: ['Player', 'Heart Rate', 'Sleep Quality', 'Soreness'] }
        ],
        notes: [
          { name: 'Recovery Plan', privacy: 'coaching_staff' }
        ],
        forms: [
          { name: 'Recovery Feedback', trigger: 'after', delay: 0, recipients: 'all_players' }
        ]
      },
      organizationId: org.id,
      isGlobal: false,
    }
  ]

  for (const templateData of defaultTemplates) {
    const existing = await prisma.eventTemplate.findFirst({
      where: {
        name: templateData.name,
        organizationId: org.id,
      }
    })

    if (existing) {
      console.log(`⏭️  Template "${templateData.name}" already exists, skipping...`)
    } else {
      await prisma.eventTemplate.create({
        data: templateData
      })
      console.log(`✅ Created template: ${templateData.name}`)
    }
  }

  console.log('🎉 Template seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
