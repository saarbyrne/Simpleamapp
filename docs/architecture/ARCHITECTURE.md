# Simpleam.app Architecture

Comprehensive architecture overview for AI coding models and developers.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Data Flow](#data-flow)
- [Authentication & Authorization](#authentication--authorization)
- [Database Schema](#database-schema)
- [API Patterns](#api-patterns)
- [Real-time Features](#real-time-features)
- [File Storage](#file-storage)
- [Module Dependencies](#module-dependencies)
- [Best Practices](#best-practices)

## Project Overview

Simpleam.app is a team management platform built for sports organizations. It provides:

- **Player Management** - Roster, profiles, performance tracking
- **Calendar & Events** - Event scheduling and attendance
- **Forms** - Custom form builder and response collection
- **Session Planner** - Training session planning with tactical boards
- **Chat** - Real-time team messaging
- **Reports** - Performance analytics and reporting
- **Templates** - Sharable template marketplace
- **Files** - Document management and storage

### Target Users

1. **Coaches** - Primary users managing teams
2. **Staff** - Administrative and support staff
3. **Platform Admins** - Super admins managing the entire platform

## Technology Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Context + Server Actions
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Rich Text:** Tiptap

### Backend

- **Runtime:** Node.js (Next.js Server Components/Actions)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** Firebase (chat)
- **Authentication:** NextAuth.js
- **File Storage:** Supabase Storage
- **Search:** PostgreSQL full-text search

### Infrastructure

- **Hosting:** Vercel (recommended)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Real-time:** Firebase Realtime Database
- **CDN:** Vercel Edge Network

## Directory Structure

```
/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── dashboard/         # Main application
│   ├── platform-admin/    # Platform admin panel
│   ├── actions/           # Server Actions (API layer)
│   └── api/               # REST API routes
│
├── components/            # React components
│   ├── ui/               # Base UI primitives (shadcn/ui)
│   ├── calendar/         # Calendar components
│   ├── chat/             # Chat interface
│   ├── dashboard/        # Dashboard components
│   ├── forms/            # Form builder
│   ├── planner/          # Session planner
│   └── ...               # Other feature components
│
├── lib/                   # Shared utilities
│   ├── animations/       # Animation variants
│   ├── chat/             # Chat utilities
│   ├── date/             # Date utilities
│   ├── platform-admin/   # Admin utilities
│   ├── ai/               # AI integrations
│   ├── supabase/         # Supabase clients
│   └── ...               # Other utilities
│
├── hooks/                 # Custom React hooks
│   ├── useChats.ts       # Chat hooks
│   ├── useMessages.ts    # Message hooks
│   └── ...               # Other hooks
│
├── types/                 # TypeScript types
│   ├── chat.ts           # Chat types
│   ├── database.ts       # Prisma types
│   └── ...               # Other types
│
├── prisma/                # Database
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration history
│   └── scripts/          # SQL scripts
│
├── docs/                  # Documentation
│   ├── setup/            # Setup guides
│   ├── features/         # Feature docs
│   ├── deployment/       # Deployment guides
│   ├── testing/          # Testing docs
│   └── architecture/     # Architecture docs (this file)
│
└── tests/                 # Test files
```

## Data Flow

### Request Flow

```
User Action
    ↓
Component (Client)
    ↓
Server Action or API Route
    ↓
Business Logic + Authorization
    ↓
Database (Prisma)
    ↓
Response
    ↓
Component Update
    ↓
UI Re-render
```

### Server Actions Pattern

```typescript
// 1. Client Component
'use client';

import { createPlayer } from '@/app/actions/players';

export function CreatePlayerForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createPlayer(formData);
    if (result.success) {
      // Handle success
    }
  }

  return <form action={handleSubmit}>...</form>;
}

// 2. Server Action
'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function createPlayer(formData: FormData) {
  // Authorization
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // Validation
  const data = validatePlayerData(formData);

  // Database operation
  const player = await db.player.create({
    data: { ...data, organizationId: user.organizationId },
  });

  // Cache revalidation
  revalidatePath('/dashboard/players');

  return { success: true, player };
}
```

### Real-time Data Flow (Chat)

```
User sends message
    ↓
Client Component
    ↓
Firebase SDK
    ↓
Firebase Realtime Database
    ↓
All connected clients receive update
    ↓
Custom Hook (useMessages)
    ↓
Component re-renders with new message
```

## Authentication & Authorization

### Authentication Flow

1. **Login** - User enters credentials
2. **NextAuth** - Validates credentials against database
3. **Session** - Creates encrypted session cookie
4. **Middleware** - Protects routes, validates session
5. **Access** - User accesses protected pages

### Authorization Levels

```typescript
// Permission hierarchy
type Role = 'owner' | 'admin' | 'coach' | 'viewer';

// Organization-level permissions
interface Permissions {
  players: 'read' | 'write';
  forms: 'read' | 'write';
  events: 'read' | 'write';
  reports: 'read' | 'write';
}

// Platform admin (super user)
interface User {
  platformAdmin: boolean; // Access to all organizations
}
```

### Permission Checking Pattern

```typescript
// In Server Actions
export async function updatePlayer(id: string, data: PlayerData) {
  const user = await getCurrentUser();
  const player = await db.player.findUnique({ where: { id } });

  // Check organization membership
  if (player.organizationId !== user.organizationId) {
    throw new Error('Unauthorized');
  }

  // Check role permissions
  if (!hasPermission(user, 'players', 'write')) {
    throw new Error('Insufficient permissions');
  }

  // Proceed with update
  return db.player.update({ where: { id }, data });
}
```

## Database Schema

### Core Relationships

```
Organization (1) ←→ (Many) User
Organization (1) ←→ (Many) Player
Organization (1) ←→ (Many) Event
Organization (1) ←→ (Many) Form

Player (Many) ←→ (Many) Event (via EventAttendance)
Player (1) ←→ (Many) PlayerNote
Player (1) ←→ (Many) FormResponse

Form (1) ←→ (Many) FormField
Form (1) ←→ (Many) FormResponse
FormResponse (1) ←→ (Many) FormFieldResponse

User (1) ←→ (Many) File
User (1) ←→ (Many) Note
```

### Key Tables

**Users & Organizations:**
- `users` - User accounts
- `organizations` - Teams/clubs
- `sessions` - Auth sessions

**Players & Staff:**
- `players` - Player roster
- `staff` - Staff members
- `player_notes` - Notes on players

**Forms:**
- `forms` - Form definitions
- `form_fields` - Form field configs
- `form_responses` - Form submissions
- `form_field_responses` - Individual answers

**Calendar:**
- `events` - Calendar events
- `event_attendance` - Attendance records

**Content:**
- `templates` - Sharable templates
- `files` - File metadata
- `notes` - Rich text notes
- `reports` - Generated reports

## API Patterns

### Server Actions (Preferred)

Used for:
- CRUD operations
- Form submissions
- Data mutations

```typescript
'use server';

export async function createResource(data: FormData) {
  // Authorization
  const user = await getCurrentUser();

  // Validation
  const validated = schema.parse(data);

  // Operation
  const result = await db.resource.create({ data: validated });

  // Cache invalidation
  revalidatePath('/dashboard/resources');

  return result;
}
```

### API Routes (When Needed)

Used for:
- Webhooks
- File uploads
- Third-party integrations
- Non-form submissions

```typescript
// app/api/webhook/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  // Process webhook
  await processWebhook(payload);

  return Response.json({ success: true });
}
```

### Error Handling

```typescript
export async function updateResource(id: string, data: Data) {
  try {
    // Validate
    const validated = schema.parse(data);

    // Authorize
    await checkPermission(id);

    // Update
    const result = await db.resource.update({
      where: { id },
      data: validated,
    });

    revalidatePath(`/dashboard/resource/${id}`);

    return { success: true, data: result };
  } catch (error) {
    console.error('Update failed:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed',
    };
  }
}
```

## Real-time Features

### Firebase Chat

Chat uses Firebase Realtime Database for real-time messaging:

```typescript
// Write message
import { ref, push } from 'firebase/database';

const messagesRef = ref(database, `chats/${chatId}/messages`);
await push(messagesRef, {
  senderId: user.id,
  content: 'Hello!',
  createdAt: Date.now(),
});

// Subscribe to messages
import { onValue } from 'firebase/database';

const messagesRef = ref(database, `chats/${chatId}/messages`);
onValue(messagesRef, (snapshot) => {
  const messages = Object.values(snapshot.val() || {});
  setMessages(messages);
});
```

### Custom Hook Pattern

```typescript
export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(Object.values(data || {}));
      setLoading(false);
    });

    return unsubscribe; // Cleanup
  }, [chatId]);

  return { messages, loading };
}
```

## File Storage

### Supabase Storage

Files are stored in Supabase Storage with metadata in PostgreSQL:

```typescript
// Upload file
import { uploadFile } from '@/app/actions/files';

const file = formData.get('file') as File;
const result = await uploadFile(file, {
  organizationId: user.organizationId,
  uploadedBy: user.id,
});

// File stored in:
// Supabase Storage: /organizations/{orgId}/files/{fileId}
// PostgreSQL: File metadata (name, size, type, url)
```

### File Access Control

```typescript
// Check file permissions before download
export async function downloadFile(fileId: string) {
  const user = await getCurrentUser();
  const file = await db.file.findUnique({ where: { id: fileId } });

  // Verify organization membership
  if (file.organizationId !== user.organizationId) {
    throw new Error('Unauthorized');
  }

  // Generate signed URL
  const { data } = await supabase.storage
    .from('files')
    .createSignedUrl(file.path, 3600); // 1 hour expiry

  return data.signedUrl;
}
```

## Module Dependencies

### Dependency Graph

```
app/
  ├─ Uses: components/, lib/, hooks/, types/
  │
components/
  ├─ Uses: lib/, hooks/, types/
  │
lib/
  ├─ Uses: types/
  │
hooks/
  ├─ Uses: lib/, types/
  │
types/
  └─ No dependencies (leaf nodes)
```

### Import Conventions

```typescript
// Use absolute imports
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { useChats } from '@/hooks/useChats';

// NOT relative imports
import { Button } from '../../../components/ui/button'; // ❌
```

### Circular Dependencies

Avoid circular dependencies:

```typescript
// ❌ Bad
// lib/a.ts
import { funcB } from './b';

// lib/b.ts
import { funcA } from './a';

// ✅ Good - extract shared code
// lib/shared.ts
export const sharedLogic = () => {};

// lib/a.ts
import { sharedLogic } from './shared';

// lib/b.ts
import { sharedLogic } from './shared';
```

## Best Practices

### 1. Server Components by Default

```typescript
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Only add 'use client' when needed
'use client';

export function ClientComponent() {
  const [state, setState] = useState();
  // Interactive component
}
```

### 2. Colocate Related Code

```typescript
// ✅ Feature-based organization
/components/players/
  ├─ player-card.tsx
  ├─ player-form.tsx
  └─ player-table.tsx

// ❌ Type-based organization
/components/cards/player-card.tsx
/components/forms/player-form.tsx
/components/tables/player-table.tsx
```

### 3. Type Safety

```typescript
// ✅ Fully typed
export async function updatePlayer(
  id: string,
  data: PlayerUpdateInput
): Promise<Player> {
  return db.player.update({ where: { id }, data });
}

// ❌ Untyped
export async function updatePlayer(id: any, data: any): Promise<any> {
  return db.player.update({ where: { id }, data });
}
```

### 4. Error Boundaries

```typescript
// app/dashboard/players/error.tsx
'use client';

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 5. Loading States

```typescript
// app/dashboard/players/loading.tsx
export default function Loading() {
  return <PlayerTableSkeleton />;
}
```

### 6. Accessibility

```typescript
// ✅ Accessible
<button
  onClick={handleClick}
  aria-label="Delete player"
  aria-describedby="delete-description"
>
  <TrashIcon />
</button>

// ❌ Not accessible
<div onClick={handleClick}>
  <TrashIcon />
</div>
```

### 7. Performance

```typescript
// ✅ Paginate large datasets
const players = await db.player.findMany({
  take: 50,
  skip: page * 50,
  orderBy: { createdAt: 'desc' },
});

// ✅ Select only needed fields
const users = await db.user.findMany({
  select: { id: true, name: true, email: true },
});

// ✅ Use indexes for queries
@@index([organizationId, email])
```

## Development Workflow

```bash
# 1. Start development server
npm run dev

# 2. Open database GUI
npx prisma studio

# 3. Make schema changes
# Edit prisma/schema.prisma

# 4. Push schema changes
npx prisma db push

# 5. Test changes
npm run test

# 6. Build for production
npm run build
```

## Related Documentation

- Setup Guide: `/docs/setup/`
- Feature Docs: `/docs/features/`
- Deployment: `/docs/deployment/`
- Testing: `/docs/testing/`
- API Docs: `/app/README.md`
- Database: `/prisma/README.md`
