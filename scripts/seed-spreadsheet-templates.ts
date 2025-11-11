import { PrismaClient, Prisma } from '@prisma/client'
import { SPREADSHEET_TEMPLATES } from '../lib/data/spreadsheet-templates'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding spreadsheet templates...')

  try {
    // Check if templates already exist
    const existingTemplates = await prisma.spreadsheetTemplate.findMany({
      where: { isPublic: true },
    })

    if (existingTemplates.length > 0) {
      console.log(`⚠️  Found ${existingTemplates.length} existing public templates`)
      console.log('   Skipping seed. Delete existing templates first if you want to re-seed.')
      return
    }

    // Create templates
    for (const template of SPREADSHEET_TEMPLATES) {
      const created = await prisma.spreadsheetTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          category: template.category,
          schema: template.schema as unknown as Prisma.InputJsonValue,
          sampleData: template.sampleData as unknown as Prisma.InputJsonValue,
          isPublic: true,
          organizationId: null, // Global templates
        },
      })

      console.log(`✅ Created template: ${created.name} (${created.category})`)
    }

    console.log(`\n🎉 Successfully seeded ${SPREADSHEET_TEMPLATES.length} templates!`)
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
