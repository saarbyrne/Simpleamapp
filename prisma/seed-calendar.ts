import { PrismaClient } from '@prisma/client'
import { addDays, addHours, setHours, startOfWeek, addWeeks } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding calendar events...')

  // Find the first organization
  const org = await prisma.organization.findFirst()

  if (!org) {
    console.error('❌ No organization found. Please create an organization first.')
    return
  }

  console.log(`✅ Found organization: ${org.name}`)

  // Get some players for attendance
  const players = await prisma.personOrganization.findMany({
    where: {
      organizationId: org.id,
      role: 'player',
    },
    take: 10,
  })

  console.log(`✅ Found ${players.length} players`)

  // Clear existing events for this org
  await prisma.event.deleteMany({
    where: { organizationId: org.id }
  })

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday

  // Create events for this week and next week
  const events = [
    // This week
    {
      title: 'Monday Training Session',
      description: 'Regular Monday morning training with focus on fitness',
      type: 'training',
      startTime: setHours(weekStart, 9),
      endTime: setHours(weekStart, 11),
      location: 'Training Ground A',
    },
    {
      title: 'Tactical Analysis Meeting',
      description: 'Video review of last match',
      type: 'meeting',
      startTime: setHours(addDays(weekStart, 1), 14),
      endTime: setHours(addDays(weekStart, 1), 15),
      location: 'Conference Room',
    },
    {
      title: 'Wednesday Training Session',
      description: 'Ball work and tactical drills',
      type: 'training',
      startTime: setHours(addDays(weekStart, 2), 9),
      endTime: setHours(addDays(weekStart, 2), 11),
      location: 'Training Ground A',
    },
    {
      title: 'Medical Check-ups',
      description: 'Routine medical assessments for all squad members',
      type: 'medical',
      startTime: setHours(addDays(weekStart, 3), 10),
      endTime: setHours(addDays(weekStart, 3), 12),
      location: 'Medical Center',
    },
    {
      title: 'Pre-Match Training',
      description: 'Light training and set piece practice',
      type: 'training',
      startTime: setHours(addDays(weekStart, 4), 10),
      endTime: setHours(addDays(weekStart, 4), 11),
      location: 'Training Ground A',
    },
    {
      title: 'League Match vs. Chelsea',
      description: 'Premier League Home Game',
      type: 'match',
      startTime: setHours(addDays(weekStart, 5), 15),
      endTime: setHours(addDays(weekStart, 5), 17),
      location: 'Home Stadium',
    },
    {
      title: 'Recovery Session',
      description: 'Post-match recovery and stretching',
      type: 'training',
      startTime: setHours(addDays(weekStart, 6), 10),
      endTime: setHours(addDays(weekStart, 6), 11),
      location: 'Training Ground B',
    },

    // Next week
    {
      title: 'Monday Training Session',
      description: 'Week start fitness and conditioning',
      type: 'training',
      startTime: setHours(addWeeks(weekStart, 1), 9),
      endTime: setHours(addWeeks(weekStart, 1), 11),
      location: 'Training Ground A',
    },
    {
      title: 'Champions League Match vs. Bayern Munich',
      description: 'UCL Quarter Final - First Leg',
      type: 'match',
      startTime: setHours(addDays(addWeeks(weekStart, 1), 2), 20),
      endTime: setHours(addDays(addWeeks(weekStart, 1), 2), 22),
      location: 'Home Stadium',
    },
    {
      title: 'Video Analysis Session',
      description: 'Review Bayern Munich tactics',
      type: 'meeting',
      startTime: setHours(addDays(addWeeks(weekStart, 1), 3), 14),
      endTime: setHours(addDays(addWeeks(weekStart, 1), 3), 16),
      location: 'Conference Room',
    },
    {
      title: 'Cup Match vs. Arsenal',
      description: 'FA Cup Semi-Final',
      type: 'match',
      startTime: setHours(addDays(addWeeks(weekStart, 1), 6), 17),
      endTime: setHours(addDays(addWeeks(weekStart, 1), 6), 19),
      location: 'Wembley Stadium',
    },

    // Some events in the past
    {
      title: 'Last Week Training',
      description: 'Past training session',
      type: 'training',
      startTime: setHours(addDays(weekStart, -7), 9),
      endTime: setHours(addDays(weekStart, -7), 11),
      location: 'Training Ground A',
    },
    {
      title: 'Previous Match vs. Liverpool',
      description: 'Premier League Away Game (Won 2-1)',
      type: 'match',
      startTime: setHours(addDays(weekStart, -5), 17),
      endTime: setHours(addDays(weekStart, -5), 19),
      location: 'Anfield',
    },

    // Some events in the future
    {
      title: 'Future Training Camp',
      description: 'Pre-season training camp',
      type: 'training',
      startTime: setHours(addDays(now, 30), 9),
      endTime: setHours(addDays(now, 30), 17),
      location: 'Dubai Training Complex',
    },
    {
      title: 'Friendly Match',
      description: 'Pre-season friendly',
      type: 'match',
      startTime: setHours(addDays(now, 35), 18),
      endTime: setHours(addDays(now, 35), 20),
      location: 'International Stadium',
    },
  ]

  for (const eventData of events) {
    const event = await prisma.event.create({
      data: {
        ...eventData,
        organizationId: org.id,
      }
    })

    // Add some attendees to some events
    if (players.length > 0 && ['training', 'match'].includes(eventData.type)) {
      // Add random number of players (5-10)
      const numAttendees = Math.min(5 + Math.floor(Math.random() * 6), players.length)
      const selectedPlayers = players.slice(0, numAttendees)

      for (const player of selectedPlayers) {
        const statuses = ['invited', 'attending', 'absent', 'excused']
        const status = eventData.startTime < now
          ? statuses[Math.floor(Math.random() * statuses.length)]
          : 'invited'

        await prisma.eventAttendance.create({
          data: {
            eventId: event.id,
            personOrgId: player.id,
            status,
          }
        })
      }
    }

    console.log(`✅ Created event: ${event.title}`)
  }

  console.log('🎉 Calendar seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
