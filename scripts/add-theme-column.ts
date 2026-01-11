import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addThemeColumn() {
  try {
    console.log('Adding theme column to users table...')

    // Use raw SQL to add the column if it doesn't exist
    await prisma.$executeRaw`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT
    `

    // Add index for better performance
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS users_theme_idx ON users(theme)
    `

    console.log('✅ Theme column added successfully!')
  } catch (error) {
    console.error('❌ Failed to add theme column:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addThemeColumn()