/**
 * Check if data was saved correctly
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking organizations...\n')

  const orgs = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      primaryColor: true,
      secondaryColor: true,
    },
    take: 3,
  })

  orgs.forEach((org) => {
    console.log(`Organization: ${org.name}`)
    console.log(`  Logo: ${org.logo || '(none)'}`)
    console.log(`  Primary: ${org.primaryColor || '(none)'}`)
    console.log(`  Secondary: ${org.secondaryColor || '(none)'}`)
    console.log()
  })

  console.log('🔍 Checking players...\n')

  const players = await prisma.person.findMany({
    select: {
      firstName: true,
      lastName: true,
      photo: true,
    },
    take: 5,
  })

  players.forEach((player) => {
    console.log(`Player: ${player.firstName} ${player.lastName}`)
    console.log(`  Photo: ${player.photo || '(none)'}`)
    console.log()
  })
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
