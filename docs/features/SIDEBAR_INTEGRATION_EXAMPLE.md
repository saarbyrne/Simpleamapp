# Adding Messages to Your Sidebar

## Quick Integration Example

Here's how to add the Messages link to your existing sidebar navigation.

---

## Option 1: Add to Navigation Array

**File:** `components/dashboard/app-sidebar.tsx`

**Find this section (around line 77):**

```typescript
const navItems = [
  { labelKey: 'nav.players', href: '/dashboard/players', icon: Users },
  { labelKey: 'nav.forms', href: '/dashboard/forms', icon: FileText },
  { labelKey: 'nav.reports', href: '/dashboard/reports', icon: BarChart3 },
  { labelKey: 'nav.calendar', href: '/dashboard/calendar', icon: Calendar },
  { labelKey: 'nav.notes', href: '/dashboard/notes', icon: StickyNote },
  { labelKey: 'nav.spreadsheets', href: '/dashboard/spreadsheets', icon: Table },
  { labelKey: 'nav.canvas', href: '/dashboard/canvas', icon: PencilRuler },
  { labelKey: 'nav.files', href: '/dashboard/files', icon: Folder },
  { labelKey: 'nav.planner', href: '/dashboard/planner', icon: CalendarCheck },
]
```

**Add this line:**

```typescript
import { MessageSquare } from 'lucide-react' // Add to imports at top

const navItems = [
  { labelKey: 'nav.players', href: '/dashboard/players', icon: Users },
  { labelKey: 'nav.forms', href: '/dashboard/forms', icon: FileText },
  { labelKey: 'nav.reports', href: '/dashboard/reports', icon: BarChart3 },
  { labelKey: 'nav.calendar', href: '/dashboard/calendar', icon: Calendar },
  { labelKey: 'nav.messages', href: '/dashboard/chat', icon: MessageSquare }, // ✅ ADD THIS
  { labelKey: 'nav.notes', href: '/dashboard/notes', icon: StickyNote },
  { labelKey: 'nav.spreadsheets', href: '/dashboard/spreadsheets', icon: Table },
  { labelKey: 'nav.canvas', href: '/dashboard/canvas', icon: PencilRuler },
  { labelKey: 'nav.files', href: '/dashboard/files', icon: Folder },
  { labelKey: 'nav.planner', href: '/dashboard/planner', icon: CalendarCheck },
]
```

---

## Option 2: Add Translation

**File:** `messages/en.json` (or your locale file)

**Add:**

```json
{
  "nav": {
    "players": "Players",
    "forms": "Forms",
    "reports": "Reports",
    "calendar": "Calendar",
    "messages": "Messages",  // ✅ ADD THIS
    "notes": "Notes",
    "spreadsheets": "Spreadsheets",
    // ... rest of nav items
  }
}
```

Do the same for other locales (e.g., `messages/es.json`, `messages/fr.json`).

---

## Option 3: Add Unread Badge (Optional)

To show unread count in the sidebar:

**File:** `components/dashboard/app-sidebar.tsx`

**1. Add imports at top:**

```typescript
import { ChatNotificationBadge } from '@/components/chat/ChatNotificationBadge'
```

**2. Modify the navigation item to include badge:**

This requires customizing how badges are rendered. Here's a complete example:

```typescript
// Add userId prop to AppSidebar
type AppSidebarProps = {
  userName: string
  userEmail?: string | null
  userAvatar?: string | null
  userId?: string // ✅ ADD THIS
}

export const AppSidebar = memo(function AppSidebar({
  userName,
  userEmail,
  userAvatar,
  userId // ✅ ADD THIS
}: AppSidebarProps) {
  // ... existing code

  const navItems = [
    { labelKey: 'nav.players', href: '/dashboard/players', icon: Users },
    { labelKey: 'nav.forms', href: '/dashboard/forms', icon: FileText },
    { labelKey: 'nav.reports', href: '/dashboard/reports', icon: BarChart3 },
    { labelKey: 'nav.calendar', href: '/dashboard/calendar', icon: Calendar },
    {
      labelKey: 'nav.messages',
      href: '/dashboard/chat',
      icon: MessageSquare,
      badge: userId ? <ChatNotificationBadge userId={userId} /> : null // ✅ ADD THIS
    },
    // ... rest of items
  ]

  // ... rest of component

  // In your render code, show the badge:
  return (
    <Sidebar>
      {/* ... */}
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
                {item.badge && <span className="ml-auto">{item.badge}</span>} {/* ✅ ADD THIS */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      {/* ... */}
    </Sidebar>
  )
})
```

**3. Pass userId from layout:**

**File:** `app/dashboard/layout.tsx`

```typescript
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await ensureUserWithOrganization(user) // ✅ Get DB user

  return (
    <DashboardLayoutClient
      userName={dbUser.name}
      userEmail={user?.email ?? null}
      userAvatar={null}
      userId={dbUser.id} // ✅ PASS THIS
    >
      {children}
    </DashboardLayoutClient>
  )
}
```

---

## Simplified Option (No Badge)

If you just want the Messages link without the unread badge, just add:

```typescript
import { MessageSquare } from 'lucide-react'

const navItems = [
  // ... existing items
  { labelKey: 'nav.messages', href: '/dashboard/chat', icon: MessageSquare },
  // ... rest of items
]
```

And add the translation:

```json
{
  "nav": {
    "messages": "Messages"
  }
}
```

**That's it!** Users can now click "Messages" in the sidebar to access the chat.

---

## Visual Example

Your sidebar will look like this:

```
┌─────────────────────┐
│ SimpleAM            │
├─────────────────────┤
│ 👥 Players          │
│ 📝 Forms            │
│ 📊 Reports          │
│ 📅 Calendar         │
│ 💬 Messages    [3]  │  ← NEW! (with badge)
│ 📋 Notes            │
│ 📊 Spreadsheets     │
│ 🎨 Canvas           │
│ 📁 Files            │
│ 📆 Planner          │
│ 🎯 Tactics          │
└─────────────────────┘
```

---

## Testing

After adding the link:

1. Restart dev server: `npm run dev`
2. Navigate to `/dashboard`
3. See "Messages" in sidebar
4. Click it
5. Should navigate to `/dashboard/chat`
6. Should see chat list

---

## Troubleshooting

### Link doesn't appear
- Check you saved `app-sidebar.tsx`
- Restart dev server
- Clear browser cache

### Translation missing
- Add `"nav.messages": "Messages"` to `messages/en.json`
- Restart dev server

### Badge doesn't show
- Verify Firebase credentials in `.env.local`
- Check Firebase Auth is initialized
- Open browser console for errors

---

## Alternative: Top Navigation

If you use top navigation instead of sidebar, add similarly:

```typescript
<nav>
  <Link href="/dashboard/players">Players</Link>
  <Link href="/dashboard/forms">Forms</Link>
  <Link href="/dashboard/chat" className="flex items-center gap-2">
    <MessageSquare className="h-5 w-5" />
    Messages
    <ChatNotificationBadge userId={currentUser.id} />
  </Link>
  {/* ... other links */}
</nav>
```

---

That's it! Your sidebar now has a Messages link with real-time unread count. 🎉
