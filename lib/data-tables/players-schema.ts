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
  },
  {
    id: 'lastName',
    name: 'Last Name',
    type: 'text',
  },
  {
    id: 'dateOfBirth',
    name: 'Date of Birth',
    type: 'date',
  },
  {
    id: 'nationality',
    name: 'Nationality',
    type: 'text',
  },
  {
    id: 'position',
    name: 'Position',
    type: 'text',
  },
  {
    id: 'jerseyNumber',
    name: 'Jersey #',
    type: 'number',
  },
  {
    id: 'status',
    name: 'Status',
    type: 'text',
  },
  {
    id: 'phone',
    name: 'Phone',
    type: 'text',
  },
  {
    id: 'email',
    name: 'Email',
    type: 'text',
  },
  {
    id: 'joinedAt',
    name: 'Joined',
    type: 'date',
  },
  {
    id: 'tags',
    name: 'Tags',
    type: 'text',
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
