# AI Coding Guide for Simpleam.app

Quick reference guide for AI coding assistants working with this codebase.

## Quick Navigation

### Finding Code by Feature

```
Feature → Location
─────────────────────────────────────────
Players     → /app/dashboard/players/
            → /components/dashboard/players-table-new.tsx
            → /app/actions/players.ts

Forms       → /app/dashboard/forms/
            → /components/forms/
            → /app/actions/forms.ts

Calendar    → /app/dashboard/calendar/
            → /components/calendar/
            → /app/actions/events.ts

Chat        → /app/dashboard/chat/
            → /components/chat/
            → /lib/chat/
            → /hooks/useChats.ts

Planner     → /app/dashboard/planner/
            → /components/planner/
            → /app/actions/planner.ts

Templates   → /app/dashboard/templates/
            → /components/templates/
            → /app/actions/templates.ts

Reports     → /app/dashboard/reports/
            → /components/reports/
            → /app/actions/reports.ts
```

### Common Tasks

**Add New Page:**
```typescript
// 1. Create page file
// app/dashboard/my-feature/page.tsx

export default async function MyFeaturePage() {
  const data = await fetchData();
  return <MyFeatureComponent data={data} />;
}

// 2. Add to navigation
// components/ui/sidebar.tsx
const menuItems = [
  // ... existing items
  { href: '/dashboard/my-feature', label: 'My Feature', icon: Icon },
];
```

**Add Server Action:**
```typescript
// 1. Create action file
// app/actions/my-feature.ts

'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createItem(data: ItemData) {
  const user = await getCurrentUser();
  const item = await db.item.create({
    data: { ...data, organizationId: user.organizationId },
  });
  revalidatePath('/dashboard/my-feature');
  return item;
}

// 2. Use in component
'use client';

import { createItem } from '@/app/actions/my-feature';

export function MyForm() {
  async function handleSubmit(formData: FormData) {
    await createItem(formData);
  }
  return <form action={handleSubmit}>...</form>;
}
```

**Add Database Table:**
```prisma
// 1. Edit prisma/schema.prisma

model MyModel {
  id        String   @id @default(cuid())
  name      String

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([organizationId])
  @@map("my_models")
}

// 2. Update Organization model
model Organization {
  // ... existing fields
  myModels MyModel[]
}

// 3. Push changes
// npx prisma db push
// npx prisma generate
```

**Add UI Component:**
```typescript
// 1. Create component file
// components/my-feature/my-component.tsx

interface MyComponentProps {
  data: Data;
  onAction?: () => void;
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Component content */}
    </div>
  );
}

// 2. Import and use
import { MyComponent } from '@/components/my-feature/my-component';

<MyComponent data={data} onAction={handleAction} />
```

## Code Patterns

### Authorization Check

```typescript
'use server';

import { getCurrentUser } from '@/lib/auth';

export async function protectedAction(itemId: string) {
  // 1. Get current user
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // 2. Fetch resource
  const item = await db.item.findUnique({ where: { id: itemId } });
  if (!item) throw new Error('Not found');

  // 3. Check ownership
  if (item.organizationId !== user.organizationId) {
    throw new Error('Unauthorized');
  }

  // 4. Proceed with action
  return db.item.update({ where: { id: itemId }, data: {/*...*/} });
}
```

### Form with Validation

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

export function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  });

  async function onSubmit(values: FormValues) {
    await createItem(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Data Table

```typescript
'use client';

import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Player>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button onClick={() => handleEdit(row.original)}>
        Edit
      </Button>
    ),
  },
];

export function PlayersTable({ data }: Props) {
  return <DataTable columns={columns} data={data} />;
}
```

### Real-time Data (Chat)

```typescript
'use client';

import { useMessages } from '@/hooks/useMessages';

export function ChatComponent({ chatId }: Props) {
  const { messages, loading } = useMessages(chatId);

  if (loading) return <Skeleton />;

  return (
    <div>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
```

### File Upload

```typescript
'use client';

import { uploadFile } from '@/app/actions/files';

export function FileUploadForm() {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFile(formData);
    console.log('Uploaded:', result.url);
  }

  return <input type="file" onChange={handleUpload} />;
}
```

## Module Import Paths

### Organized by Feature

```typescript
// Animations
import { fadeIn, slideIn, spinner } from '@/lib/animations';

// Chat
import { sendMessage, formatTimestamp } from '@/lib/chat';
import { useChats, useMessages } from '@/hooks/useChats';

// Date utilities
import { formatDate, parseDate } from '@/lib/date';

// Platform admin
import { checkPlatformAdmin } from '@/lib/platform-admin';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';

// Feature components
import { PlayerCard } from '@/components/dashboard/player-card';
import { EventForm } from '@/components/calendar/event-form-dialog';

// Server actions
import { createPlayer } from '@/app/actions/players';
import { createEvent } from '@/app/actions/events';

// Types
import { Player, Event, Form } from '@prisma/client';
import type { Chat, Message } from '@/types/chat';
```

## File Naming Conventions

```
✅ Correct:
- player-card.tsx
- event-form-dialog.tsx
- chat-window.tsx
- create-player.ts

❌ Incorrect:
- PlayerCard.tsx
- EventFormDialog.tsx
- ChatWindow.tsx
- CreatePlayer.ts
```

## Common Pitfalls

### ❌ Using Client Component When Server Component Works

```typescript
// ❌ Unnecessary 'use client'
'use client';

export default function Page() {
  return <StaticContent />;
}

// ✅ Server component (default)
export default function Page() {
  return <StaticContent />;
}
```

### ❌ Forgetting to Revalidate Cache

```typescript
// ❌ Cache not updated
export async function updatePlayer(id: string, data: PlayerData) {
  return db.player.update({ where: { id }, data });
}

// ✅ Revalidate after mutation
export async function updatePlayer(id: string, data: PlayerData) {
  const result = await db.player.update({ where: { id }, data });
  revalidatePath('/dashboard/players');
  return result;
}
```

### ❌ Missing Authorization Checks

```typescript
// ❌ No authorization
export async function deletePlayer(id: string) {
  return db.player.delete({ where: { id } });
}

// ✅ With authorization
export async function deletePlayer(id: string) {
  const user = await getCurrentUser();
  const player = await db.player.findUnique({ where: { id } });

  if (player.organizationId !== user.organizationId) {
    throw new Error('Unauthorized');
  }

  return db.player.delete({ where: { id } });
}
```

### ❌ Exposing Sensitive Data

```typescript
// ❌ Returns password
export async function getUser(id: string) {
  return db.user.findUnique({ where: { id } });
}

// ✅ Omits sensitive fields
export async function getUser(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      // password excluded
    },
  });
}
```

## Testing Approach

### Unit Tests

```typescript
// lib/date/date-utils.test.ts
import { formatDate } from './date-utils';

describe('formatDate', () => {
  test('formats date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('Jan 1, 2024');
  });
});
```

### Component Tests

```typescript
// components/player-card.test.tsx
import { render, screen } from '@testing-library/react';
import { PlayerCard } from './player-card';

test('renders player name', () => {
  render(<PlayerCard player={mockPlayer} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### E2E Tests

```typescript
// tests/e2e/players.test.ts
import { test, expect } from '@playwright/test';

test('can create player', async ({ page }) => {
  await page.goto('/dashboard/players');
  await page.click('text=Add Player');
  await page.fill('[name="firstName"]', 'John');
  await page.fill('[name="lastName"]', 'Doe');
  await page.click('text=Save');
  await expect(page.locator('text=John Doe')).toBeVisible();
});
```

## Environment Setup

```bash
# 1. Clone and install
git clone <repo>
cd Simpleamapp
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Setup database
npx prisma db push
npx prisma db seed

# 4. Start development
npm run dev

# Open http://localhost:3000
```

## Debugging Tips

### Check Server Logs

```typescript
// Add logging to server actions
export async function createPlayer(data: PlayerData) {
  console.log('Creating player:', data);

  try {
    const result = await db.player.create({ data });
    console.log('Created player:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to create player:', error);
    throw error;
  }
}
```

### Use Prisma Studio

```bash
# Open database GUI
npx prisma studio

# Browse tables, edit data, run queries
```

### Check Database Queries

```typescript
// Enable query logging
// lib/db.ts
export const db = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

## Key Files Reference

```
Configuration:
  - next.config.js         # Next.js configuration
  - tailwind.config.ts     # Tailwind configuration
  - tsconfig.json          # TypeScript configuration
  - prisma/schema.prisma   # Database schema
  - .env.local             # Environment variables

Entry Points:
  - app/layout.tsx         # Root layout
  - app/page.tsx           # Home page
  - middleware.ts          # Auth middleware

Utilities:
  - lib/db.ts              # Prisma client
  - lib/supabase/client.ts # Supabase client
  - lib/firebase.ts        # Firebase config
  - lib/utils.ts           # General utilities

Types:
  - types/database.ts      # Prisma types
  - types/chat.ts          # Chat types
  - types/forms.ts         # Form types
```

## Design System Usage

SimpleAM uses a comprehensive design system built on shadcn/ui and Radix primitives. When writing code:

### Quick Reference

**Design Tokens:**
```typescript
import { motion, colors, spacing, typography } from '@/design-system/tokens'
```

**Components:**
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/data-table'
```

**Tables:**
- Always use TanStack Table via `DataTable` component
- Reference: `app/dashboard/players/page.tsx`

**Colors:**
- Use semantic classes: `bg-primary`, `text-foreground`, `border-border`
- Never hardcode: `bg-blue-500`, `#3b82f6`

**Spacing:**
- Use Tailwind scale: `p-4`, `m-2`, `gap-6`
- Never hardcode: `padding: 13px`

**Responsive:**
- Mobile-first: `p-4 md:p-6 lg:p-8`

**Accessibility:**
- Images need `alt` text
- Icon buttons need `aria-label`
- Form inputs need associated `Label`

For complete guidelines, see: `/docs/design-system/DESIGN_SYSTEM.md`

## Getting Help

```
Documentation:   /docs/
Design System:   /docs/design-system/DESIGN_SYSTEM.md
Architecture:    /docs/architecture/ARCHITECTURE.md
Setup Guide:     /docs/setup/
API Reference:   /app/README.md
Database:        /prisma/README.md
Components:      /components/README.md
Hooks:           /hooks/README.md
Types:           /types/README.md
```

## Quick Wins for AI Models

1. **Always check READMEs first** - Each directory has context
2. **Use organized imports** - Modules are grouped logically
3. **Follow established patterns** - Consistency is key
4. **Check authorization** - Security is critical
5. **Revalidate caches** - Keep UI in sync
6. **Type everything** - No `any` types
7. **Test thoroughly** - Especially authorization logic
8. **Read similar code** - Learn from existing patterns

## Summary

This codebase is organized for:
- ✅ **Clear module boundaries** - Easy to find code
- ✅ **Consistent patterns** - Predictable structure
- ✅ **Type safety** - Full TypeScript coverage
- ✅ **Good documentation** - README files everywhere
- ✅ **Security first** - Authorization baked in
- ✅ **Performance** - Server components by default
- ✅ **Developer experience** - Modern tooling

Happy coding! 🚀
