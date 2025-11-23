import { PrismaClient } from '@prisma/client'
import { addDays, addHours, setHours, startOfDay, subDays } from 'date-fns'

const prisma = new PrismaClient()

// Riverside United FC - English Championship Team
const TEAM_NAME = 'Riverside United FC'
const TEAM_SLUG = 'riverside-united-fc'

// Player roster data
const PLAYERS = [
  // Goalkeepers
  { firstName: 'Tom', lastName: 'Harrison', position: 'Goalkeeper', jerseyNumber: 1, nationality: 'England', dob: '1996-03-15', tags: ['Captain', 'First Team'] },
  { firstName: 'Lucas', lastName: 'Fernández', position: 'Goalkeeper', jerseyNumber: 13, nationality: 'Spain', dob: '2000-07-22', tags: ['First Team'] },
  { firstName: 'Jake', lastName: 'Matthews', position: 'Goalkeeper', jerseyNumber: 31, nationality: 'England', dob: '2004-01-10', tags: ['Youth', 'Development'] },
  
  // Defenders
  { firstName: 'Marcus', lastName: 'Johnson', position: 'Right Back', jerseyNumber: 2, nationality: 'England', dob: '1994-05-20', tags: ['First Team', 'Experienced'] },
  { firstName: 'João', lastName: 'Silva', position: 'Centre Back', jerseyNumber: 3, nationality: 'Portugal', dob: '1997-09-14', tags: ['First Team', 'Starter'] },
  { firstName: 'Connor', lastName: "O'Brien", position: 'Centre Back', jerseyNumber: 4, nationality: 'Ireland', dob: '1999-02-28', tags: ['First Team', 'Starter'] },
  { firstName: 'Alex', lastName: 'Turner', position: 'Left Back', jerseyNumber: 5, nationality: 'England', dob: '1998-11-05', tags: ['First Team', 'Starter'] },
  { firstName: 'Kwame', lastName: 'Mensah', position: 'Centre Back', jerseyNumber: 6, nationality: 'Ghana', dob: '2001-06-18', tags: ['First Team'] },
  { firstName: 'Ryan', lastName: 'Phillips', position: 'Right Back', jerseyNumber: 15, nationality: 'Wales', dob: '2002-04-12', tags: ['First Team'] },
  { firstName: 'Liam', lastName: 'Foster', position: 'Centre Back', jerseyNumber: 23, nationality: 'England', dob: '2003-08-25', tags: ['Youth', 'Development'] },
  { firstName: 'Danny', lastName: 'Wright', position: 'Left Back', jerseyNumber: 28, nationality: 'England', dob: '1995-12-03', tags: ['First Team'] },
  
  // Midfielders
  { firstName: 'Pierre', lastName: 'Dubois', position: 'Central Midfield', jerseyNumber: 8, nationality: 'France', dob: '1995-07-09', tags: ['Vice Captain', 'First Team', 'Starter'] },
  { firstName: 'James', lastName: 'Mitchell', position: 'Attacking Midfield', jerseyNumber: 10, nationality: 'Scotland', dob: '1997-03-21', tags: ['First Team', 'Starter', 'Playmaker'] },
  { firstName: 'Carlos', lastName: 'Rodríguez', position: 'Right Midfield', jerseyNumber: 7, nationality: 'Spain', dob: '1999-10-17', tags: ['First Team', 'Starter'] },
  { firstName: 'Tomáš', lastName: 'Novák', position: 'Central Midfield', jerseyNumber: 14, nationality: 'Czech Republic', dob: '1998-05-30', tags: ['First Team'] },
  { firstName: 'Ethan', lastName: 'Davies', position: 'Defensive Midfield', jerseyNumber: 16, nationality: 'Wales', dob: '2001-09-08', tags: ['First Team', 'Starter'] },
  { firstName: 'Ahmed', lastName: 'Hassan', position: 'Left Midfield', jerseyNumber: 18, nationality: 'Egypt', dob: '2000-11-24', tags: ['First Team'] },
  { firstName: 'Ben', lastName: 'Clarke', position: 'Central Midfield', jerseyNumber: 21, nationality: 'England', dob: '2002-02-14', tags: ['First Team'] },
  { firstName: 'Oliver', lastName: 'Scott', position: 'Attacking Midfield', jerseyNumber: 26, nationality: 'England', dob: '2004-06-19', tags: ['Youth', 'Development'] },
  
  // Forwards
  { firstName: 'Javier', lastName: 'Morales', position: 'Striker', jerseyNumber: 9, nationality: 'Argentina', dob: '1996-08-11', tags: ['First Team', 'Starter', 'Top Scorer'] },
  { firstName: 'Michael', lastName: 'Roberts', position: 'Left Wing', jerseyNumber: 11, nationality: 'England', dob: '1998-04-07', tags: ['First Team', 'Starter'] },
  { firstName: 'Amadou', lastName: 'Diallo', position: 'Striker', jerseyNumber: 17, nationality: 'Senegal', dob: '2000-01-29', tags: ['First Team'] },
  { firstName: 'Sam', lastName: 'Taylor', position: 'Right Wing', jerseyNumber: 19, nationality: 'England', dob: '1999-12-16', tags: ['First Team'] },
  { firstName: 'Kai', lastName: 'Müller', position: 'Striker', jerseyNumber: 20, nationality: 'Germany', dob: '2002-07-23', tags: ['First Team'] },
  { firstName: 'Josh', lastName: 'Anderson', position: 'Left Wing', jerseyNumber: 27, nationality: 'England', dob: '2005-03-04', tags: ['Youth', 'Development'] },
]

// Injury data
const INJURIES = [
  { playerIndex: 13, type: 'Hamstring Strain', bodyPart: 'Left Hamstring', severity: 'Moderate', daysOut: 18, status: 'injured' },
  { playerIndex: 21, type: 'Groin Strain', bodyPart: 'Right Groin', severity: 'Moderate', daysOut: 25, status: 'injured' },
  { playerIndex: 8, type: 'Ankle Sprain', bodyPart: 'Right Ankle', severity: 'Minor', daysOut: 7, status: 'injured' },
]

async function main() {
  console.log('🌱 Seeding Championship team data...\n')

  // 1. Find or create organization
  console.log('📋 Step 1: Organization setup')
  let org = await prisma.organization.findFirst({
    where: { slug: TEAM_SLUG }
  })

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: TEAM_NAME,
        slug: TEAM_SLUG,
        sport: 'football',
      }
    })
    console.log(`✅ Created organization: ${org.name}`)
  } else {
    console.log(`✅ Found existing organization: ${org.name}`)
  }

  // 2. Create players
  console.log('\n👥 Step 2: Creating player roster (25 players)')
  const createdPlayers = []
  
  for (const playerData of PLAYERS) {
    // Check if player already exists
    const existingPerson = await prisma.person.findFirst({
      where: {
        firstName: playerData.firstName,
        lastName: playerData.lastName,
      }
    })

    let person
    if (existingPerson) {
      person = existingPerson
    } else {
      person = await prisma.person.create({
        data: {
          firstName: playerData.firstName,
          lastName: playerData.lastName,
          dateOfBirth: new Date(playerData.dob),
          nationality: playerData.nationality,
        }
      })
    }

    // Check if person-org relationship exists
    const existingPersonOrg = await prisma.personOrganization.findFirst({
      where: {
        personId: person.id,
        organizationId: org.id,
      }
    })

    let personOrg
    if (existingPersonOrg) {
      personOrg = existingPersonOrg
    } else {
      // Determine status based on injuries
      const injuryData = INJURIES.find(inj => inj.playerIndex === createdPlayers.length)
      const status = injuryData ? injuryData.status : 'active'

      personOrg = await prisma.personOrganization.create({
        data: {
          personId: person.id,
          organizationId: org.id,
          role: 'player',
          position: playerData.position,
          jerseyNumber: playerData.jerseyNumber,
          status,
          tags: playerData.tags,
        }
      })
    }

    createdPlayers.push({ person, personOrg, data: playerData })
    console.log(`  ✓ ${playerData.firstName} ${playerData.lastName} (#${playerData.jerseyNumber}) - ${playerData.position}`)
  }

  console.log(`\n✅ Created ${createdPlayers.length} players`)

  // 3. Create events (4 weeks of training, matches, meetings)
  console.log('\n📅 Step 3: Creating events (4 weeks)')
  
  const baseDate = subDays(new Date(), 28) // Start 4 weeks ago
  const events = []

  // Week 1
  events.push(
    { title: 'Training Session - Technical & Tactical', type: 'training', start: setHours(addDays(baseDate, 0), 10), duration: 2 },
    { title: 'Training Session - Fitness & Conditioning', type: 'training', start: setHours(addDays(baseDate, 1), 10), duration: 1.5 },
    { title: 'Training Session - Match Preparation', type: 'training', start: setHours(addDays(baseDate, 2), 10), duration: 2 },
    { title: 'Team Meeting - Match Analysis', type: 'meeting', start: setHours(addDays(baseDate, 3), 9), duration: 1 },
    { title: 'MATCH: vs Leeds United (H)', type: 'match', start: setHours(addDays(baseDate, 5), 15), duration: 2, location: 'Riverside Stadium' },
    { title: 'Recovery Session', type: 'training', start: setHours(addDays(baseDate, 6), 11), duration: 1 },
  )

  // Week 2
  events.push(
    { title: 'Training Session - Technical & Tactical', type: 'training', start: setHours(addDays(baseDate, 7), 10), duration: 2 },
    { title: 'Training Session - Fitness & Conditioning', type: 'training', start: setHours(addDays(baseDate, 8), 10), duration: 1.5 },
    { title: 'Training Session - Match Preparation', type: 'training', start: setHours(addDays(baseDate, 9), 10), duration: 2 },
    { title: 'Medical Assessment - Monthly Check', type: 'medical', start: setHours(addDays(baseDate, 11), 9), duration: 1 },
    { title: 'MATCH: vs Sheffield Wednesday (A)', type: 'match', start: setHours(addDays(baseDate, 12), 15), duration: 2, location: 'Hillsborough Stadium' },
    { title: 'Recovery Session', type: 'training', start: setHours(addDays(baseDate, 13), 11), duration: 1 },
  )

  // Week 3
  events.push(
    { title: 'Training Session - Technical & Tactical', type: 'training', start: setHours(addDays(baseDate, 14), 10), duration: 2 },
    { title: 'Training Session - Fitness & Conditioning', type: 'training', start: setHours(addDays(baseDate, 15), 10), duration: 1.5 },
    { title: 'Training Session - Match Preparation', type: 'training', start: setHours(addDays(baseDate, 16), 10), duration: 2 },
    { title: 'Team Meeting - Tactical Review', type: 'meeting', start: setHours(addDays(baseDate, 17), 9), duration: 1 },
    { title: 'MATCH: vs Middlesbrough (H)', type: 'match', start: setHours(addDays(baseDate, 19), 15), duration: 2, location: 'Riverside Stadium' },
    { title: 'Recovery Session', type: 'training', start: setHours(addDays(baseDate, 20), 11), duration: 1 },
  )

  // Week 4
  events.push(
    { title: 'Training Session - Technical & Tactical', type: 'training', start: setHours(addDays(baseDate, 21), 10), duration: 2 },
    { title: 'Training Session - Fitness & Conditioning', type: 'training', start: setHours(addDays(baseDate, 22), 10), duration: 1.5 },
    { title: 'Training Session - Match Preparation', type: 'training', start: setHours(addDays(baseDate, 23), 10), duration: 2 },
    { title: 'Medical Assessment - Injury Review', type: 'medical', start: setHours(addDays(baseDate, 25), 9), duration: 1 },
    { title: 'MATCH: vs Norwich City (A)', type: 'match', start: setHours(addDays(baseDate, 26), 15), duration: 2, location: 'Carrow Road' },
    { title: 'Recovery Session', type: 'training', start: setHours(addDays(baseDate, 27), 11), duration: 1 },
  )

  const createdEvents = []
  for (const eventData of events) {
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        type: eventData.type,
        startTime: eventData.start,
        endTime: addHours(eventData.start, eventData.duration),
        location: eventData.location,
        organizationId: org.id,
      }
    })
    createdEvents.push(event)
    console.log(`  ✓ ${eventData.title}`)
  }

  console.log(`\n✅ Created ${createdEvents.length} events`)

  // 4. Create wellness form
  console.log('\n📋 Step 4: Creating forms')
  
  const wellnessForm = await prisma.form.create({
    data: {
      name: 'Daily Wellness Check',
      description: 'Daily self-reported wellness monitoring for all players',
      organizationId: org.id,
      schema: {
        fields: [
          { id: 'sleep_quality', type: 'rating', label: 'Sleep Quality', required: true, min: 1, max: 5 },
          { id: 'sleep_hours', type: 'number', label: 'Sleep Hours', required: true, min: 0, max: 12 },
          { id: 'soreness_level', type: 'rating', label: 'Muscle Soreness', required: true, min: 1, max: 5 },
          { id: 'energy_level', type: 'rating', label: 'Energy Level', required: true, min: 1, max: 5 },
          { id: 'stress_level', type: 'rating', label: 'Stress Level', required: true, min: 1, max: 5 },
          { id: 'mood', type: 'rating', label: 'Mood', required: true, min: 1, max: 5 },
          { id: 'hydration', type: 'select', label: 'Hydration Status', required: true, options: ['Good', 'Fair', 'Poor'] },
          { id: 'comments', type: 'textarea', label: 'Additional Comments', required: false },
        ]
      },
      scheduleType: 'daily',
      targetType: 'all',
    }
  })
  console.log(`  ✓ Daily Wellness Check`)

  const gpsForm = await prisma.form.create({
    data: {
      name: 'GPS/Load Monitoring',
      description: 'Training load and GPS data collection',
      organizationId: org.id,
      schema: {
        fields: [
          { id: 'total_distance', type: 'number', label: 'Total Distance (km)', required: true },
          { id: 'high_speed_running', type: 'number', label: 'High-Speed Running (m)', required: true },
          { id: 'sprint_distance', type: 'number', label: 'Sprint Distance (m)', required: true },
          { id: 'accelerations', type: 'number', label: 'Accelerations', required: true },
          { id: 'decelerations', type: 'number', label: 'Decelerations', required: true },
          { id: 'player_load', type: 'number', label: 'Player Load (AU)', required: true },
          { id: 'hr_avg', type: 'number', label: 'Average Heart Rate (bpm)', required: false },
          { id: 'hr_max', type: 'number', label: 'Max Heart Rate (bpm)', required: false },
        ]
      },
      targetType: 'all',
    }
  })
  console.log(`  ✓ GPS/Load Monitoring`)

  const injuryForm = await prisma.form.create({
    data: {
      name: 'Injury Report',
      description: 'Medical staff injury documentation',
      organizationId: org.id,
      schema: {
        fields: [
          { id: 'injury_type', type: 'select', label: 'Injury Type', required: true, options: ['Muscle Strain', 'Ligament Sprain', 'Joint', 'Contusion', 'Fracture', 'Other'] },
          { id: 'body_part', type: 'select', label: 'Body Part', required: true, options: ['Hamstring', 'Quadriceps', 'Calf', 'Groin', 'Ankle', 'Knee', 'Hip', 'Back', 'Shoulder', 'Other'] },
          { id: 'severity', type: 'select', label: 'Severity', required: true, options: ['Minor', 'Moderate', 'Severe'] },
          { id: 'mechanism', type: 'textarea', label: 'How did it happen?', required: true },
          { id: 'expected_return', type: 'date', label: 'Expected Return Date', required: false },
        ]
      },
      targetType: 'specific',
    }
  })
  console.log(`  ✓ Injury Report`)

  console.log(`\n✅ Created 3 forms`)

  // 5. Create form responses (wellness data for 28 days)
  console.log('\n💬 Step 5: Creating form responses (this may take a moment...)')
  
  let responseCount = 0
  
  // Helper function to generate realistic wellness data
  const generateWellnessData = (playerIndex: number, dayOffset: number) => {
    const isInjured = INJURIES.some(inj => inj.playerIndex === playerIndex)
    const baseQuality = isInjured ? 2.5 : 3.5 + Math.random()
    const variation = (Math.random() - 0.5) * 0.8
    
    return {
      sleep_quality: Math.max(1, Math.min(5, Math.round(baseQuality + variation))),
      sleep_hours: Math.max(5, Math.min(10, 7 + (Math.random() - 0.5) * 2)),
      soreness_level: Math.max(1, Math.min(5, Math.round(isInjured ? 4 : 2 + Math.random() * 2))),
      energy_level: Math.max(1, Math.min(5, Math.round(baseQuality + variation))),
      stress_level: Math.max(1, Math.min(5, Math.round(2 + Math.random() * 2))),
      mood: Math.max(1, Math.min(5, Math.round(baseQuality + variation))),
      hydration: ['Good', 'Good', 'Good', 'Fair', 'Good'][Math.floor(Math.random() * 5)],
      comments: Math.random() > 0.9 ? 'Feeling good today' : '',
    }
  }

  // Create wellness responses for all players for 28 days
  for (let day = 0; day < 28; day++) {
    for (let i = 0; i < createdPlayers.length; i++) {
      const player = createdPlayers[i]
      const responseDate = addDays(baseDate, day)
      
      await prisma.formResponse.create({
        data: {
          formId: wellnessForm.id,
          personOrgId: player.personOrg.id,
          responses: generateWellnessData(i, day),
          submittedAt: setHours(responseDate, 8),
        }
      })
      responseCount++
    }
  }

  console.log(`  ✓ Created ${responseCount} wellness check responses`)

  // 6. Create spreadsheets
  console.log('\n📊 Step 6: Creating spreadsheets with data')

  // Weekly Training Load spreadsheet
  const trainingLoadData = []
  for (let week = 1; week <= 4; week++) {
    for (const player of createdPlayers) {
      const isStarter = player.data.tags.includes('Starter') || player.data.tags.includes('First Team')
      const baseLoad = isStarter ? 25 : 18
      const variation = (Math.random() - 0.5) * 5
      
      trainingLoadData.push({
        player_name: `${player.person.firstName} ${player.person.lastName}`,
        week_number: week,
        total_distance: (baseLoad + variation).toFixed(1),
        high_speed_distance: Math.round(1200 + Math.random() * 600),
        sprint_distance: Math.round(400 + Math.random() * 300),
        player_load: Math.round(1800 + Math.random() * 400),
        training_sessions: isStarter ? 5 : 4,
        match_minutes: isStarter ? 90 : Math.round(Math.random() * 60),
        acute_load: (baseLoad + variation).toFixed(1),
        chronic_load: (baseLoad * 0.9).toFixed(1),
        ac_ratio: ((baseLoad + variation) / (baseLoad * 0.9)).toFixed(2),
      })
    }
  }

  const trainingLoadSheet = await prisma.spreadsheet.create({
    data: {
      name: 'Weekly Training Load - November 2024',
      description: 'GPS and load monitoring data aggregated by week',
      organizationId: org.id,
      schema: {
        columns: [
          { id: 'player_name', name: 'Player Name', type: 'text' },
          { id: 'week_number', name: 'Week', type: 'number' },
          { id: 'total_distance', name: 'Total Distance (km)', type: 'number' },
          { id: 'high_speed_distance', name: 'High-Speed Distance (m)', type: 'number' },
          { id: 'sprint_distance', name: 'Sprint Distance (m)', type: 'number' },
          { id: 'player_load', name: 'Player Load (AU)', type: 'number' },
          { id: 'training_sessions', name: 'Training Sessions', type: 'number' },
          { id: 'match_minutes', name: 'Match Minutes', type: 'number' },
          { id: 'acute_load', name: 'Acute Load', type: 'number' },
          { id: 'chronic_load', name: 'Chronic Load', type: 'number' },
          { id: 'ac_ratio', name: 'A:C Ratio', type: 'number' },
        ]
      },
      data: { rows: trainingLoadData },
    }
  })
  console.log(`  ✓ Weekly Training Load (${trainingLoadData.length} rows)`)

  // Wellness Tracking spreadsheet
  const wellnessData = []
  for (let week = 1; week <= 4; week++) {
    for (const player of createdPlayers) {
      const isInjured = INJURIES.some(inj => inj.playerIndex === createdPlayers.indexOf(player))
      const baseScore = isInjured ? 60 : 75 + Math.random() * 15
      
      wellnessData.push({
        player_name: `${player.person.firstName} ${player.person.lastName}`,
        week_number: week,
        avg_sleep_hours: (7 + (Math.random() - 0.5)).toFixed(1),
        avg_sleep_quality: (3.5 + Math.random()).toFixed(1),
        avg_soreness: (isInjured ? 3.8 : 2.2 + Math.random()).toFixed(1),
        avg_energy: (3.5 + Math.random()).toFixed(1),
        avg_stress: (2.5 + Math.random()).toFixed(1),
        avg_mood: (3.8 + Math.random() * 0.8).toFixed(1),
        wellness_score: Math.round(baseScore),
        flagged_days: isInjured ? Math.round(Math.random() * 3) : 0,
      })
    }
  }

  const wellnessSheet = await prisma.spreadsheet.create({
    data: {
      name: 'Wellness Tracking - November 2024',
      description: 'Aggregated wellness metrics by week',
      organizationId: org.id,
      schema: {
        columns: [
          { id: 'player_name', name: 'Player Name', type: 'text' },
          { id: 'week_number', name: 'Week', type: 'number' },
          { id: 'avg_sleep_hours', name: 'Avg Sleep Hours', type: 'number' },
          { id: 'avg_sleep_quality', name: 'Avg Sleep Quality', type: 'number' },
          { id: 'avg_soreness', name: 'Avg Soreness', type: 'number' },
          { id: 'avg_energy', name: 'Avg Energy', type: 'number' },
          { id: 'avg_stress', name: 'Avg Stress', type: 'number' },
          { id: 'avg_mood', name: 'Avg Mood', type: 'number' },
          { id: 'wellness_score', name: 'Wellness Score', type: 'number' },
          { id: 'flagged_days', name: 'Flagged Days', type: 'number' },
        ]
      },
      data: { rows: wellnessData },
    }
  })
  console.log(`  ✓ Wellness Tracking (${wellnessData.length} rows)`)

  // Injury Log spreadsheet
  const injuryData = [
    {
      player_name: 'Tomáš Novák',
      injury_date: '2024-11-08',
      injury_type: 'Hamstring Strain',
      body_part: 'Left Hamstring',
      severity: 'Moderate',
      expected_return: '2024-11-26',
      actual_return: '',
      days_missed: 18,
      matches_missed: 2,
      status: 'Injured',
    },
    {
      player_name: 'Amadou Diallo',
      injury_date: '2024-11-12',
      injury_type: 'Groin Strain',
      body_part: 'Right Groin',
      severity: 'Moderate',
      expected_return: '2024-12-07',
      actual_return: '',
      days_missed: 25,
      matches_missed: 3,
      status: 'Injured',
    },
    {
      player_name: 'Ryan Phillips',
      injury_date: '2024-11-20',
      injury_type: 'Ankle Sprain',
      body_part: 'Right Ankle',
      severity: 'Minor',
      expected_return: '2024-11-27',
      actual_return: '',
      days_missed: 7,
      matches_missed: 1,
      status: 'Injured',
    },
  ]

  const injurySheet = await prisma.spreadsheet.create({
    data: {
      name: 'Injury Log - 2024/25 Season',
      description: 'Current season injury tracking',
      organizationId: org.id,
      schema: {
        columns: [
          { id: 'player_name', name: 'Player Name', type: 'text' },
          { id: 'injury_date', name: 'Injury Date', type: 'date' },
          { id: 'injury_type', name: 'Injury Type', type: 'text' },
          { id: 'body_part', name: 'Body Part', type: 'text' },
          { id: 'severity', name: 'Severity', type: 'text' },
          { id: 'expected_return', name: 'Expected Return', type: 'date' },
          { id: 'actual_return', name: 'Actual Return', type: 'date' },
          { id: 'days_missed', name: 'Days Missed', type: 'number' },
          { id: 'matches_missed', name: 'Matches Missed', type: 'number' },
          { id: 'status', name: 'Status', type: 'text' },
        ]
      },
      data: { rows: injuryData },
    }
  })
  console.log(`  ✓ Injury Log (${injuryData.length} rows)`)

  console.log(`\n✅ Created 3 spreadsheets`)

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('✨ Championship Team Seeding Complete!')
  console.log('='.repeat(60))
  console.log(`\n📊 Summary:`)
  console.log(`  • Organization: ${org.name}`)
  console.log(`  • Players: ${createdPlayers.length}`)
  console.log(`  • Events: ${createdEvents.length} (4 weeks)`)
  console.log(`  • Forms: 3 (Wellness, GPS, Injury)`)
  console.log(`  • Form Responses: ${responseCount}`)
  console.log(`  • Spreadsheets: 3 (Training Load, Wellness, Injuries)`)
  console.log(`\n🎯 You can now create reports with:`)
  console.log(`  • Player wellness trends over 4 weeks`)
  console.log(`  • Training load distribution by position`)
  console.log(`  • Injury tracking and analysis`)
  console.log(`  • Multi-chart dashboards combining all data`)
  console.log('\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

