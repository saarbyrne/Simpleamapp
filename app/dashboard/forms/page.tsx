import { FormsTable, type FormRow } from '@/components/dashboard/forms-table'

// Mock data - replace with actual data fetching when ready
const mockForms: FormRow[] = [
  {
    id: 'FRM-101',
    title: 'Offseason Hydration Survey',
    category: 'Health & Recovery',
    status: 'Active',
    responses: 142,
    updated: new Date('2025-04-12'),
    owner: 'Ava Turner',
  },
  {
    id: 'FRM-097',
    title: 'Performance Goal Setting',
    category: 'Coaching',
    status: 'Draft',
    responses: 0,
    updated: new Date('2025-03-28'),
    owner: 'Marcus Reed',
  },
  {
    id: 'FRM-082',
    title: 'Injury Follow-up Check-in',
    category: 'Medical',
    status: 'Active',
    responses: 63,
    updated: new Date('2025-03-25'),
    owner: 'Sierra Neal',
  },
  {
    id: 'FRM-071',
    title: 'Weekly Wellness Pulse',
    category: 'Health & Recovery',
    status: 'Active',
    responses: 205,
    updated: new Date('2025-03-20'),
    owner: 'Ava Turner',
  },
  {
    id: 'FRM-055',
    title: 'Academics Progress Report',
    category: 'Education',
    status: 'Archived',
    responses: 318,
    updated: new Date('2025-02-05'),
    owner: 'Devon Kelly',
  },
]

export default function FormsPage() {
  return <FormsTable forms={mockForms} total={mockForms.length} />
}
