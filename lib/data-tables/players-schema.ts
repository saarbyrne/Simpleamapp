import { ColumnDefinition } from '@/lib/types/spreadsheet'

/**
 * Auto-generated schema for Players data table
 * Maps PersonOrganization model to spreadsheet columns
 */
export const playersSchema: ColumnDefinition[] = [
  {
    id: 'firstName',
    name: 'First Name',
    type: 'text',
    settings: { width: 150 },
  },
  {
    id: 'lastName',
    name: 'Last Name',
    type: 'text',
    settings: { width: 150 },
  },
  {
    id: 'dateOfBirth',
    name: 'Date of Birth',
    type: 'date',
    settings: { width: 140 },
  },
  {
    id: 'nationality',
    name: 'Nationality',
    type: 'text',
    settings: { width: 130 },
  },
  {
    id: 'position',
    name: 'Position',
    type: 'text',
    settings: { width: 130 },
  },
  {
    id: 'jerseyNumber',
    name: 'Jersey #',
    type: 'number',
    settings: { width: 100 },
  },
  {
    id: 'status',
    name: 'Status',
    type: 'text',
    settings: { width: 120 },
  },
  {
    id: 'phone',
    name: 'Phone',
    type: 'text',
    settings: { width: 150 },
  },
  {
    id: 'email',
    name: 'Email',
    type: 'text',
    settings: { width: 200 },
  },
  {
    id: 'joinedAt',
    name: 'Joined',
    type: 'date',
    settings: { width: 130 },
  },
  {
    id: 'tags',
    name: 'Tags',
    type: 'text',
    settings: { width: 180 },
  },
]

/**
 * Transform database record to spreadsheet row
 */
export function playerToRow(personOrg: any): any {
  return {
    id: personOrg.id,
    firstName: personOrg.person.firstName,
    lastName: personOrg.person.lastName,
    dateOfBirth: personOrg.person.dateOfBirth,
    nationality: personOrg.person.nationality,
    position: personOrg.position,
    jerseyNumber: personOrg.jerseyNumber,
    status: personOrg.status,
    phone: personOrg.person.phone,
    email: personOrg.person.email,
    joinedAt: personOrg.joinedAt,
    tags: personOrg.tags?.join(', ') || '',
  }
}

/**
 * Transform spreadsheet row back to database update
 */
export function rowToPlayer(row: any): any {
  return {
    person: {
      firstName: row.firstName,
      lastName: row.lastName,
      dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
      nationality: row.nationality,
      phone: row.phone,
      email: row.email,
    },
    personOrg: {
      position: row.position,
      jerseyNumber: row.jerseyNumber ? parseInt(row.jerseyNumber) : null,
      status: row.status,
      tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
    },
  }
}
