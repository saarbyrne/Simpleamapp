# App Directory

Next.js 14 App Router pages and API routes.

## Structure

```
/app
├── (auth)/              # Authentication pages (login, register)
├── dashboard/           # Main application dashboard
│   ├── calendar/        # Calendar and events
│   ├── chat/            # Team chat
│   ├── data-management/ # Data import/export
│   ├── files/           # File management
│   ├── forms/           # Form builder and responses
│   ├── players/         # Player management
│   ├── planner/         # Session planner
│   ├── reports/         # Reports and analytics
│   ├── staff/           # Staff management
│   └── templates/       # Template marketplace
├── platform-admin/      # Platform admin panel
├── actions/             # Server actions
├── api/                 # API routes
└── globals.css          # Global styles
```

## Routing Conventions

### App Router (Next.js 14)
- `page.tsx` - Route page component
- `layout.tsx` - Shared layout for route segment
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI

### Route Groups
- `(auth)/` - Groups auth pages without affecting URL
- Pages inside are at `/login`, `/register`, not `/auth/login`

### Dynamic Routes
- `[id]/` - Dynamic route segment (e.g., `/players/123`)
- `[...slug]/` - Catch-all route segment

## Key Sections

### Authentication `(auth)/`
Public-facing authentication pages:
- `/login` - User login
- `/register` - User registration (if enabled)

### Dashboard `/dashboard`
Main application interface after login. Contains all core features:

**Calendar & Events:**
- Event scheduling and management
- Calendar views (day, week, month)
- Event attendance tracking

**Chat:**
- Real-time team messaging
- Direct messages and group chats
- File sharing

**Players:**
- Player roster management
- Player profiles and statistics
- Performance tracking

**Forms:**
- Custom form builder
- Form responses and analysis
- Form templates

**Planner:**
- Session planning tools
- Tactical board integration
- Drill library

**Reports:**
- Performance reports
- Team analytics
- Custom report generation

**Templates:**
- Template marketplace
- Share and discover templates
- My templates management

### Platform Admin `/platform-admin`
Super-admin dashboard for platform management:
- User management across all organizations
- Organization management and billing
- System settings and configuration
- Platform-wide analytics

**Access:** Requires `platformAdmin: true` flag on user account

### Server Actions `/actions`
Server-side data operations using Next.js Server Actions:
- `auth.ts` - Authentication operations
- `chat.ts` - Chat operations
- `events.ts` - Calendar event operations
- `files.ts` - File upload/download
- `forms.ts` - Form CRUD operations
- `notes.ts` - Notes operations
- `players.ts` - Player management
- `planner.ts` - Session planner operations
- `reports.ts` - Report generation
- `search.ts` - Cross-entity search
- `templates.ts` - Template operations
- `platform-admin.ts` - Platform admin operations

### API Routes `/api`
RESTful API endpoints and webhooks:
- `/api/auth/` - Authentication endpoints
- `/api/webhooks/` - External service webhooks
- `/api/files/` - File operations
- `/api/search/` - Search API

## Authentication & Middleware

### Middleware
Authentication is handled by `middleware.ts` in the project root:
- Protects `/dashboard/*` routes
- Redirects unauthenticated users to `/login`
- Checks platform admin status for `/platform-admin/*`

### Session Management
- Uses Next-Auth for session management
- Session stored in secure HTTP-only cookies
- Automatic session refresh

## Data Fetching Patterns

### Server Components (Default)
```typescript
// Fetch data directly in server components
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Client Components
```typescript
'use client';

// Use hooks for real-time data
import { useData } from '@/hooks/useData';

export function Component() {
  const { data } = useData();
  return <div>{data}</div>;
}
```

### Server Actions
```typescript
'use server';

// Server actions for mutations
export async function updateData(formData: FormData) {
  const result = await db.update(/* ... */);
  revalidatePath('/dashboard');
  return result;
}
```

## Layouts

### Root Layout `/app/layout.tsx`
- Applies to all pages
- Sets up providers (Clerk, Theme, etc.)
- Global fonts and metadata

### Dashboard Layout `/app/dashboard/layout.tsx`
- Sidebar navigation
- User menu
- Notifications
- Common dashboard UI

### Platform Admin Layout `/app/platform-admin/layout.tsx`
- Platform admin navigation
- Access control check
- Admin-specific UI elements

## Best Practices

1. **Colocate Related Files** - Keep page, layout, loading, error together
2. **Use Server Components by Default** - Add 'use client' only when needed
3. **Server Actions for Mutations** - Prefer Server Actions over API routes
4. **Streaming with Suspense** - Use loading.tsx for instant loading states
5. **Parallel Routes** - Use `@folder` convention for parallel routes
6. **Route Groups** - Use `(folder)` to organize without affecting URLs

## Environment Variables

Required environment variables are defined in `.env.local`:
- Database connection strings
- Authentication providers
- API keys
- Feature flags

See `/docs/setup/` for environment setup guides.
