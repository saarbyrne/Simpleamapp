# Components Directory

Reusable React components organized by feature and functionality.

## Structure

```
/components
├── ui/                  # Base UI components (shadcn/ui)
├── calendar/            # Calendar and event components
├── chat/                # Chat interface components
├── dashboard/           # Dashboard-specific components
├── files/               # File management components
├── forms/               # Form builder components
├── notes/               # Notes feature components
├── platform-admin/      # Platform admin components
├── planner/             # Session planner components
├── reports/             # Reporting components
├── spreadsheets/        # Spreadsheet components
├── tactics/             # Tactical board components
├── templates/           # Template marketplace components
└── data-table/          # Reusable data table component
```

## Component Organization

### Base UI `/ui`
Low-level UI primitives from shadcn/ui:
- Buttons, inputs, dialogs, dropdowns
- Cards, badges, avatars
- Layout components (sidebar, navigation)
- Form elements

**Import:** `import { Button } from '@/components/ui/button'`

### Feature Components
Organized by feature area matching `/app/dashboard` routes:

- **Calendar** - Event cards, calendars, event forms
- **Chat** - Chat lists, message windows, file uploads
- **Forms** - Form builder, field editors, response tables
- **Players** - Player cards, profile views, statistics
- **Planner** - Session planner, drill library
- **Reports** - Report viewers, charts, export tools
- **Templates** - Template cards, marketplace views

### Dashboard Components `/dashboard`
Shared dashboard UI components:
- Data tables (players, forms, staff)
- Quick action panels
- Stat cards and summaries
- Search and filter bars

### Data Table `/data-table`
Powerful, reusable data table with:
- Sorting, filtering, pagination
- Column visibility controls
- Row selection and bulk actions
- Export functionality

## Naming Conventions

All components use **kebab-case** filenames:
- ✅ `event-form-dialog.tsx`
- ✅ `chat-window.tsx`
- ✅ `player-profile.tsx`
- ❌ `EventFormDialog.tsx`
- ❌ `ChatWindow.tsx`

## Component Patterns

### Server Components (Default)
```typescript
// No 'use client' directive = Server Component
export function ServerComponent({ data }: Props) {
  return <div>{data}</div>;
}
```

### Client Components
```typescript
'use client';

export function ClientComponent() {
  const [state, setState] = useState();
  return <div onClick={() => setState(/*...*/)}>...</div>;
}
```

### Compound Components
```typescript
// Parent component
export function DataTable({ children }: Props) {
  return <div className="table">{children}</div>;
}

// Child components
DataTable.Header = function Header() { /*...*/ };
DataTable.Row = function Row() { /*...*/ };
DataTable.Cell = function Cell() { /*...*/ };
```

## Styling

### Tailwind CSS
All components use Tailwind for styling:
```typescript
<div className="flex items-center gap-4 p-4 rounded-lg bg-card">
```

### CSS Variables
Theme colors defined in `app/globals.css`:
```css
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96.1%;
```

### Dark Mode
Automatic dark mode support via `class="dark"` on root:
```typescript
<div className="bg-white dark:bg-gray-900">
```

## State Management

### Local State
```typescript
const [value, setValue] = useState('');
```

### Context
```typescript
const { user } = useAuth();
const { theme } = useTheme();
```

### Server State (React Query pattern)
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['players'],
  queryFn: fetchPlayers
});
```

## Best Practices

1. **Keep Components Small** - Single responsibility principle
2. **Colocate Related Components** - Group by feature, not by type
3. **Use TypeScript** - Always define prop interfaces
4. **Server First** - Use server components by default
5. **Composition Over Props** - Prefer children/slots over boolean props
6. **Accessibility** - Use semantic HTML and ARIA labels
7. **Loading States** - Always handle loading and error states
8. **Responsive Design** - Mobile-first approach

## Testing

Component tests use React Testing Library:
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Related Documentation

- UI Components: See individual component files for usage
- Styling Guide: `/docs/architecture/styling.md`
- Component Patterns: `/docs/architecture/components.md`
