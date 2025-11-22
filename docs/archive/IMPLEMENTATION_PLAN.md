# 🎯 Implementation Plan: Planner & AI Assistant System

## Current Status

### ✅ Already Implemented
- **Planner Feature**: Database models, server actions, UI components all complete
- **Marketing Website**: Successfully integrated with auth-aware navigation
- **Database Schema**: Complete Prisma schema with all models defined

### ❌ Blockers
- Database tables don't exist (pooler connection issue)
- Need manual SQL execution via Supabase
- AI system referenced in commit but not actually implemented

---

## Phase 1: Database Setup (Critical - Do This First)

### Step 1.1: Generate Complete Migration SQL
```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/complete-schema.sql
```

### Step 1.2: Apply Migration in Supabase
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye
2. Navigate to: **SQL Editor** → **New Query**
3. Copy contents from: `prisma/complete-schema.sql`
4. Paste and click **Run**
5. Verify success

### Step 1.3: Verify Tables Exist
Run in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- organizations, users, persons, person_organizations
- forms, form_responses, form_templates
- events, event_templates, event_attendance
- notes, files, spreadsheets, spreadsheet_templates
- canvas_boards, drawings, drawing_templates
- **plans, milestones, milestone_links, milestone_comments** ← Planner tables
- reports, report_templates
- subscriptions, activities, organization_roles, user_roles

### Step 1.4: Mark Migration as Applied
```bash
npx prisma migrate resolve --applied complete-schema
npx prisma generate
```

---

## Phase 2: Test Planner Feature (10 minutes)

### Step 2.1: Start Dev Server
```bash
npm run dev
```

### Step 2.2: Navigate to Planner
- Go to: http://localhost:3000/dashboard/planner
- Should see plans listing page
- Click "Create Plan" button

### Step 2.3: Create Test Plan
Test with these values:
- **Name**: "Season 2025 Training Plan"
- **Type**: "season"
- **Start Date**: Today
- **End Date**: 3 months from now
- **Description**: "Complete training schedule for 2025 season"

### Step 2.4: Verify Functionality
- ✅ Plan appears in table
- ✅ Can view plan details
- ✅ Can add milestones
- ✅ Timeline visualization works

---

## Phase 3: AI System Implementation (Optional - 2-3 hours)

⚠️ **Note**: Despite commit message, AI system is NOT actually implemented. Here's what would be needed:

### Step 3.1: Add Database Models
Add to `prisma/schema.prisma`:
```prisma
model AIConversation {
  id             String      @id @default(cuid())
  userId         String
  user           User        @relation(fields: [userId], references: [id])
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  title          String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  messages       AIMessage[]
  @@map("ai_conversations")
}

model AIMessage {
  id             String         @id @default(cuid())
  conversationId String
  conversation   AIConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String         // "user" | "assistant"
  content        String
  tokenCount     Int?
  createdAt      DateTime       @default(now())
  @@map("ai_messages")
}

model AISettings {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  monthlyTokenLimit Int   @default(1000000)
  dataAccessLevel String  @default("full") // "full" | "limited" | "none"
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  @@map("ai_settings")
}
```

### Step 3.2: Add Dependencies
```bash
npm install @anthropic-ai/sdk react-markdown
```

### Step 3.3: Create AI Service
Create `lib/ai/service.ts` with:
- Anthropic client initialization
- Streaming chat endpoint
- Tool definitions (12 tools for data access)
- Cost tracking logic

### Step 3.4: Create API Routes
- `/api/ai/chat` - Streaming chat
- `/api/ai/conversations` - CRUD operations
- `/api/ai/settings` - User settings

### Step 3.5: Create UI Components
- `components/ai/ai-chat.tsx` - Chat interface
- `components/ai/conversation-history.tsx` - Sidebar
- `components/ai/ai-settings.tsx` - Settings page
- `app/dashboard/ai/page.tsx` - Main page

### Step 3.6: Add to Navigation
Update `components/dashboard/app-sidebar.tsx`:
```tsx
{
  title: "AI Assistant",
  url: "/dashboard/ai",
  icon: Sparkles,
}
```

---

## Phase 4: Testing & Validation

### Step 4.1: Planner Tests
- [ ] Create plan
- [ ] Add milestones
- [ ] Link milestones to events/forms/notes
- [ ] Update milestone progress
- [ ] Complete plan
- [ ] Create from template

### Step 4.2: AI Tests (if implemented)
- [ ] Start new conversation
- [ ] Query player data
- [ ] Analyze wellness data
- [ ] Generate insights
- [ ] Check cost tracking
- [ ] Verify privacy controls

### Step 4.3: Integration Tests
- [ ] Planner links to Events
- [ ] Planner links to Forms
- [ ] Planner links to Notes
- [ ] AI can access planner data (if AI implemented)

---

## Quick Start Commands

```bash
# 1. Generate and view migration SQL
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/complete-schema.sql
cat prisma/complete-schema.sql

# 2. After applying in Supabase
npx prisma generate
npm run dev

# 3. Test planner
open http://localhost:3000/dashboard/planner

# 4. Check database status anytime
npm run db:status
```

---

## Decision: Do You Want AI System?

**Option A: Planner Only** (Fastest - 30 minutes)
- Execute Phase 1 & 2 only
- Planner will be fully functional
- Skip AI implementation for now

**Option B: Full Implementation** (3-4 hours)
- Execute all phases
- Get both Planner AND AI Assistant
- Requires Anthropic API key
- ~$50-100/month estimated cost for AI

**My Recommendation**: Start with **Option A**
- Get Planner working first
- Validate it meets your needs
- Add AI later if desired
- AI can be added incrementally without disrupting Planner

---

## Troubleshooting

### Issue: "Table does not exist"
**Solution**: Run Phase 1 steps - tables need to be created

### Issue: "Prisma Client not initialized"
**Solution**: Run `npx prisma generate`

### Issue: "Connection pool timeout"
**Solution**: Use DIRECT_URL for migrations, not pooler URL

### Issue: Migration conflicts
**Solution**: 
```bash
# Reset migration history
rm -rf prisma/migrations
# Apply fresh migration in Supabase
# Then mark as applied
npx prisma migrate resolve --applied complete-schema
```

---

## Next Steps After This Plan

1. **Marketing Website** ✅ Done
2. **Database Setup** ← Start here
3. **Planner Feature** ← Test this
4. **AI System** ← Decide if needed
5. **Deploy to Production**

