import { ColumnDefinition, SpreadsheetRow } from '../types/spreadsheet'

export interface TemplateData {
  name: string
  description: string
  category: string
  schema: ColumnDefinition[]
  sampleData: SpreadsheetRow[]
}

export const SPREADSHEET_TEMPLATES: TemplateData[] = [
  // Performance Templates
  {
    name: 'Weekly Player Load',
    description: 'Track training load per player with RPE and duration',
    category: 'performance',
    schema: [
      {
        id: 'player',
        name: 'Player',
        type: 'person',
        settings: { filter: 'players', width: 200 },
      },
      {
        id: 'date',
        name: 'Date',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'sessionType',
        name: 'Session Type',
        type: 'text',
        settings: { width: 150 },
      },
      {
        id: 'duration',
        name: 'Duration (min)',
        type: 'number',
        settings: { width: 130 },
      },
      {
        id: 'rpe',
        name: 'RPE (1-10)',
        type: 'number',
        settings: { width: 120 },
      },
      {
        id: 'totalLoad',
        name: 'Total Load',
        type: 'formula',
        settings: { formula: 'duration * rpe', width: 130 },
      },
    ],
    sampleData: [
      {
        id: '1',
        sessionType: 'Training',
        duration: 90,
        rpe: 7,
        totalLoad: 630,
      },
      {
        id: '2',
        sessionType: 'Match',
        duration: 90,
        rpe: 9,
        totalLoad: 810,
      },
    ],
  },

  // Wellness Templates
  {
    name: 'Daily Wellness Tracking',
    description: 'Monitor player wellness indicators daily',
    category: 'wellness',
    schema: [
      {
        id: 'player',
        name: 'Player',
        type: 'person',
        settings: { filter: 'players', width: 200 },
      },
      {
        id: 'date',
        name: 'Date',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'sleep',
        name: 'Sleep Quality (1-10)',
        type: 'number',
        settings: { width: 160 },
      },
      {
        id: 'fatigue',
        name: 'Fatigue (1-10)',
        type: 'number',
        settings: { width: 140 },
      },
      {
        id: 'soreness',
        name: 'Soreness (1-10)',
        type: 'number',
        settings: { width: 150 },
      },
      {
        id: 'stress',
        name: 'Stress (1-10)',
        type: 'number',
        settings: { width: 130 },
      },
      {
        id: 'mood',
        name: 'Mood (1-10)',
        type: 'number',
        settings: { width: 120 },
      },
      {
        id: 'notes',
        name: 'Notes',
        type: 'text',
        settings: { width: 250 },
      },
    ],
    sampleData: [
      {
        id: '1',
        sleep: 8,
        fatigue: 4,
        soreness: 3,
        stress: 2,
        mood: 8,
        notes: 'Feeling good',
      },
    ],
  },

  {
    name: 'Injury Log',
    description: 'Track injuries, recovery, and return to play',
    category: 'injury',
    schema: [
      {
        id: 'player',
        name: 'Player',
        type: 'person',
        settings: { filter: 'players', width: 200 },
      },
      {
        id: 'injuryDate',
        name: 'Injury Date',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'injuryType',
        name: 'Injury Type',
        type: 'text',
        settings: { width: 180 },
      },
      {
        id: 'bodyPart',
        name: 'Body Part',
        type: 'text',
        settings: { width: 150 },
      },
      {
        id: 'severity',
        name: 'Severity',
        type: 'text',
        settings: { width: 120 },
      },
      {
        id: 'expectedReturn',
        name: 'Expected Return',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'actualReturn',
        name: 'Actual Return',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'notes',
        name: 'Notes',
        type: 'text',
        settings: { width: 250 },
      },
    ],
    sampleData: [
      {
        id: '1',
        injuryType: 'Hamstring Strain',
        bodyPart: 'Left Hamstring',
        severity: 'Moderate',
        notes: 'Grade 2 strain',
      },
    ],
  },

  {
    name: 'Match Statistics',
    description: 'Record player performance stats from matches',
    category: 'match',
    schema: [
      {
        id: 'player',
        name: 'Player',
        type: 'person',
        settings: { filter: 'players', width: 200 },
      },
      {
        id: 'match',
        name: 'Match',
        type: 'event',
        settings: { width: 200 },
      },
      {
        id: 'minutesPlayed',
        name: 'Minutes Played',
        type: 'number',
        settings: { width: 140 },
      },
      {
        id: 'goals',
        name: 'Goals',
        type: 'number',
        settings: { width: 100 },
      },
      {
        id: 'assists',
        name: 'Assists',
        type: 'number',
        settings: { width: 100 },
      },
      {
        id: 'passes',
        name: 'Passes',
        type: 'number',
        settings: { width: 100 },
      },
      {
        id: 'passAccuracy',
        name: 'Pass Accuracy %',
        type: 'number',
        settings: { width: 140 },
      },
      {
        id: 'tackles',
        name: 'Tackles',
        type: 'number',
        settings: { width: 100 },
      },
      {
        id: 'rating',
        name: 'Rating (1-10)',
        type: 'number',
        settings: { width: 130 },
      },
    ],
    sampleData: [
      {
        id: '1',
        minutesPlayed: 90,
        goals: 1,
        assists: 2,
        passes: 45,
        passAccuracy: 87,
        tackles: 3,
        rating: 8.5,
      },
    ],
  },

  {
    name: 'Training Attendance',
    description: 'Track player attendance at training sessions',
    category: 'attendance',
    schema: [
      {
        id: 'player',
        name: 'Player',
        type: 'person',
        settings: { filter: 'players', width: 200 },
      },
      {
        id: 'session',
        name: 'Session',
        type: 'event',
        settings: { width: 200 },
      },
      {
        id: 'date',
        name: 'Date',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'status',
        name: 'Status',
        type: 'text',
        settings: { width: 140 },
      },
      {
        id: 'reason',
        name: 'Reason',
        type: 'text',
        settings: { width: 200 },
      },
      {
        id: 'notes',
        name: 'Notes',
        type: 'text',
        settings: { width: 250 },
      },
    ],
    sampleData: [
      {
        id: '1',
        status: 'Present',
        reason: '',
        notes: 'Full participation',
      },
      {
        id: '2',
        status: 'Absent',
        reason: 'Injury',
        notes: 'Hamstring recovery',
      },
    ],
  },

  {
    name: 'GPS Data Import',
    description: 'Import and track GPS performance metrics',
    category: 'gps',
    schema: [
      {
        id: 'player',
        name: 'Player',
        type: 'person',
        settings: { filter: 'players', width: 200 },
      },
      {
        id: 'session',
        name: 'Session',
        type: 'event',
        settings: { width: 200 },
      },
      {
        id: 'date',
        name: 'Date',
        type: 'date',
        settings: { width: 150 },
      },
      {
        id: 'totalDistance',
        name: 'Total Distance (m)',
        type: 'number',
        settings: { width: 160 },
      },
      {
        id: 'highSpeedRunning',
        name: 'High Speed Running (m)',
        type: 'number',
        settings: { width: 180 },
      },
      {
        id: 'sprints',
        name: 'Sprints',
        type: 'number',
        settings: { width: 100 },
      },
      {
        id: 'maxSpeed',
        name: 'Max Speed (km/h)',
        type: 'number',
        settings: { width: 150 },
      },
      {
        id: 'accelerations',
        name: 'Accelerations',
        type: 'number',
        settings: { width: 130 },
      },
      {
        id: 'decelerations',
        name: 'Decelerations',
        type: 'number',
        settings: { width: 130 },
      },
    ],
    sampleData: [
      {
        id: '1',
        totalDistance: 8500,
        highSpeedRunning: 850,
        sprints: 12,
        maxSpeed: 32.5,
        accelerations: 45,
        decelerations: 42,
      },
    ],
  },
]
