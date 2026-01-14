/**
 * Script to add Liverpool/Everton branding and player photos
 * Run with: npx tsx scripts/add-team-data.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏟️  Adding team branding and player photos...\n')

  // Find your organizations
  const orgs = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
    },
    take: 10,
  })

  console.log('Found organizations:')
  orgs.forEach((org, i) => {
    console.log(`  ${i + 1}. ${org.name} (${org.slug})`)
  })

  if (orgs.length < 2) {
    console.log('\n❌ Need at least 2 organizations. Please create them first.')
    return
  }

  // Update first org with Liverpool branding
  const liverpool = orgs[0]
  console.log(`\n⚽ Setting up ${liverpool.name} as Liverpool FC...`)

  await prisma.organization.update({
    where: { id: liverpool.id },
    data: {
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
      primaryColor: '#C8102E',
      secondaryColor: '#F6EB61',
    },
  })

  // Update second org with Everton branding
  const everton = orgs[1]
  console.log(`⚽ Setting up ${everton.name} as Everton FC...`)

  await prisma.organization.update({
    where: { id: everton.id },
    data: {
      logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
      primaryColor: '#003399',
      secondaryColor: '#FFFFFF',
    },
  })

  // Add photos to players in first org (Liverpool)
  const liverpoolPlayers = await prisma.person.findMany({
    where: {
      organizations: {
        some: {
          organizationId: liverpool.id,
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photo: true,
    },
  })

  console.log(`\n📸 Adding photos to ${liverpoolPlayers.length} Liverpool players...`)

  for (const player of liverpoolPlayers) {
    const name = `${player.firstName} ${player.lastName}`
    const photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=C8102E&color=F6EB61&bold=true`

    await prisma.person.update({
      where: { id: player.id },
      data: { photo: photoUrl },
    })
  }

  // Add photos to players in second org (Everton)
  const evertonPlayers = await prisma.person.findMany({
    where: {
      organizations: {
        some: {
          organizationId: everton.id,
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photo: true,
    },
  })

  console.log(`📸 Adding photos to ${evertonPlayers.length} Everton players...`)

  for (const player of evertonPlayers) {
    const name = `${player.firstName} ${player.lastName}`
    const photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=003399&color=FFFFFF&bold=true`

    await prisma.person.update({
      where: { id: player.id },
      data: { photo: photoUrl },
    })
  }

  console.log('\n✅ Done! Team branding and player photos added.')
  console.log('\nTeam colors set:')
  console.log(`  🔴 ${liverpool.name}: #C8102E / #F6EB61`)
  console.log(`  🔵 ${everton.name}: #003399 / #FFFFFF`)
  console.log(`\nYou can now:`)
  console.log(`  1. View logos/photos in the Players page`)
  console.log(`  2. Adjust colors in System Settings > Branding`)
  console.log(`  3. Switch themes in Profile > Preferences`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
