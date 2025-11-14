/**
 * Script to fix corrupted drawing data in the database
 * Run with: npx ts-node scripts/fix-drawings.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixDrawings() {
  console.log('Starting to fix drawings...')

  try {
    // Get all drawings
    const drawings = await prisma.drawing.findMany()

    console.log(`Found ${drawings.length} drawings to check`)

    let fixed = 0

    for (const drawing of drawings) {
      let needsUpdate = false
      const data = drawing.data as any

      if (!data || typeof data !== 'object') {
        console.log(`Skipping drawing ${drawing.id} - invalid data structure`)
        continue
      }

      // Ensure elements array exists
      if (!Array.isArray(data.elements)) {
        data.elements = []
        needsUpdate = true
      }

      // Fix each element
      data.elements = data.elements.map((element: any) => {
        if (!element || typeof element !== 'object') {
          return null
        }

        let elementChanged = false

        // Ensure groupIds is an array
        if (!Array.isArray(element.groupIds)) {
          element.groupIds = []
          elementChanged = true
        }

        // Ensure boundElements is either null or an array
        if (element.boundElements !== undefined && element.boundElements !== null) {
          if (!Array.isArray(element.boundElements)) {
            element.boundElements = []
            elementChanged = true
          }
        }

        // CRITICAL: Unlock all locked elements
        if (element.locked === true) {
          element.locked = false
          elementChanged = true
          console.log(`  Unlocking element ${element.id} in drawing ${drawing.name}`)
        }

        if (elementChanged) {
          needsUpdate = true
        }

        return element
      }).filter(Boolean)

      // Ensure appState exists
      if (!data.appState || typeof data.appState !== 'object') {
        data.appState = {
          viewBackgroundColor: '#2f9e44',
          gridSize: null,
        }
        needsUpdate = true
      }

      // Ensure files exists
      if (!data.files || typeof data.files !== 'object') {
        data.files = {}
        needsUpdate = true
      }

      if (needsUpdate) {
        await prisma.drawing.update({
          where: { id: drawing.id },
          data: { data },
        })

        fixed++
        console.log(`Fixed drawing: ${drawing.name} (${drawing.id})`)
      }
    }

    console.log(`\nCompleted! Fixed ${fixed} out of ${drawings.length} drawings`)
  } catch (error) {
    console.error('Error fixing drawings:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixDrawings()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
