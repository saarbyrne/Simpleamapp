# AI Assistant Setup Guide

## Quick Setup (3 Steps)

### Step 1: Run Database Migration

The AI system requires 5 new database tables. Run the migration SQL file:

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the file: `prisma/migrations/add_ai_system.sql`
4. Copy and paste the entire contents into the SQL Editor
5. Click "Run" to execute the migration

**Option B: Using Command Line**
```bash
# If database connection is working
npx prisma db push

# Or run the SQL file directly
psql $DATABASE_URL -f prisma/migrations/add_ai_system.sql
```

### Step 2: Add Anthropic API Key

Add your Anthropic API key to your `.env` or `.env.local` file:

```bash
# Add this line to .env or .env.local
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**To get an Anthropic API Key:**
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into your `.env` file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

That's it! Navigate to `/dashboard/ai` to start using the AI Assistant.

---

## Verification

### Check Database Tables

Run this query in your Supabase SQL Editor to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'ai_%';
```

You should see:
- `ai_conversations`
- `ai_messages`
- `ai_insights`
- `ai_settings`
- `ai_cost_tracking`

### Check Environment Variables

```bash
# Should print your API key
echo $ANTHROPIC_API_KEY
```

### Test the AI Assistant

1. Navigate to `http://localhost:3000/dashboard/ai`
2. You should see the AI Assistant interface with three tabs: Chat, Insights, Settings
3. Try sending a message like "Show me all players"
4. The AI should respond with player data from your database

---

## Troubleshooting

### Error: "The table public.ai_conversations does not exist"

**Cause:** Database migration hasn't been run yet.

**Solution:** Follow Step 1 above to run the migration SQL file in Supabase Dashboard.

### Error: "Could not resolve authentication method. Expected apiKey"

**Cause:** ANTHROPIC_API_KEY is not set in environment variables.

**Solution:**
1. Add `ANTHROPIC_API_KEY=sk-ant-your-key-here` to `.env.local`
2. Restart the development server (`npm run dev`)

### Error: "Can't reach database server"

**Cause:** Database connection issue with Supabase.

**Solution:**
1. Use Supabase Dashboard SQL Editor instead (Option A in Step 1)
2. Check that DATABASE_URL and DIRECT_URL are correct in `.env`
3. Verify your Supabase project is running

### AI Chat not responding

**Checks:**
1. Open browser console (F12) and check for errors
2. Verify ANTHROPIC_API_KEY is set correctly
3. Check that you have credits/quota remaining in your Anthropic account
4. Verify database tables exist (see Verification section above)

### Tool calls failing

**Checks:**
1. Ensure you have test data in your database (players, forms, events, etc.)
2. Check that the user has proper permissions in the system
3. Review server logs for specific error messages

---

## Features Overview

### Chat Interface
- Natural language queries about your team data
- Real-time streaming responses
- Tool calling for data access and actions
- Suggested queries to get started

### AI Tools (12 total)
**Data Retrieval:**
- `list_players` - Get all players with optional filters
- `get_player` - Get detailed player information
- `query_spreadsheet` - Query spreadsheet data
- `get_form_responses` - Get form responses with filters
- `search_notes` - Search notes by content or tags
- `list_events` - Get calendar events

**Actions:**
- `create_event` - Create calendar events
- `distribute_form` - Send forms to players
- `create_note` - Create notes

**Analysis:**
- `analyze_load_wellness` - Analyze load/wellness correlation
- `calculate_injury_risk` - Calculate player injury risk
- Plus more specialized tools for team management

### Insights Dashboard
- Proactive AI-generated insights
- Injury risk alerts
- Wellness decline detection
- Load spike warnings
- Form completion tracking

### Settings
- Privacy controls for data access
- Monthly token usage limits
- Cost tracking dashboard
- Alert frequency configuration
- Granular data permissions

---

## Cost Management

The AI system includes comprehensive cost tracking:

### Pricing (Claude Sonnet 4)
- Input tokens: $3 per million tokens
- Output tokens: $15 per million tokens
- Average conversation: ~5k tokens ≈ $0.075
- 1000 conversations/month ≈ $75

### Cost Controls
- Real-time token usage tracking per conversation
- Monthly token limits (default: 1M tokens)
- Cost estimation dashboard in Settings
- Automatic monthly reset
- Per-user and per-organization tracking

### Managing Costs
1. Set monthly token limits in AI Settings
2. Monitor usage in the Settings dashboard
3. Adjust limits as needed
4. Review cost tracking in `ai_cost_tracking` table

---

## Database Schema

### ai_conversations
Stores chat conversation history
- `id` - Unique identifier
- `orgId` - Organization ID
- `userId` - User ID
- `title` - Auto-generated conversation title
- `contextType` / `contextId` - Optional context linking

### ai_messages
Individual messages in conversations
- `id` - Unique identifier
- `conversationId` - Links to conversation
- `role` - "user" or "assistant"
- `content` - Message text
- `toolCalls` - Tool calls made by AI
- `inputTokens` / `outputTokens` - Token usage

### ai_insights
Proactive AI-generated insights
- `id` - Unique identifier
- `orgId` - Organization ID
- `type` - "injury_risk", "wellness_decline", etc.
- `priority` - "high", "medium", "low"
- `status` - "active", "dismissed", "acted_on"

### ai_settings
User preferences and privacy controls
- `id` - Unique identifier
- `orgId` / `userId` - Unique per user
- Alert toggles (injury risk, wellness, load, etc.)
- `dataAccess` - JSON with granular permissions
- `monthlyTokenLimit` - Usage limit

### ai_cost_tracking
Cost and usage monitoring
- `id` - Unique identifier
- `orgId` / `userId` - For filtering
- `conversationId` - Optional link to conversation
- `inputTokens` / `outputTokens` - Token counts
- `totalCost` - Calculated cost in USD

---

## Security & Privacy

### Data Access Controls
Users can control what data the AI can access:
- Player wellness data
- Load/GPS data
- Medical notes
- Form responses
- Event attendance
- Private notes

### Privacy Levels
Notes and data respect existing privacy levels:
- Public
- Medical (restricted access)
- Coaches only
- Mental health (highly restricted)
- Private

### Rate Limiting
- Per-user monthly token limits
- Per-organization aggregate tracking
- Automatic enforcement of limits
- Graceful degradation when limits reached

---

## Next Steps

1. **Add test data** - If you don't have much data yet, the AI won't have much to work with
2. **Try example queries** - Use the suggested queries in the Chat interface
3. **Configure settings** - Set up your privacy preferences and token limits
4. **Explore insights** - Check the Insights tab for proactive alerts
5. **Share with team** - Other users in your organization can access the AI Assistant

---

## Support

For issues or questions:
1. Check this setup guide first
2. Review the main [AI_SYSTEM_README.md](./AI_SYSTEM_README.md) for detailed documentation
3. Check browser console and server logs for errors
4. Verify all prerequisites are met (database tables, API key, server running)

---

## Development Notes

### Files Modified
- `prisma/schema.prisma` - Added 5 AI models
- `package.json` - Added @anthropic-ai/sdk and react-markdown
- `components/dashboard/app-sidebar.tsx` - Added AI Assistant nav item

### Files Created
**Backend:**
- `lib/ai/service.ts` - Anthropic API integration
- `lib/ai/tools.ts` - Tool definitions and execution
- `app/api/ai/chat/route.ts` - Streaming chat endpoint
- `app/api/ai/conversations/route.ts` - Conversation management
- `app/api/ai/conversations/[id]/route.ts` - Individual conversation ops
- `app/api/ai/insights/route.ts` - Insights API
- `app/api/ai/settings/route.ts` - Settings API

**Frontend:**
- `components/ai/ai-chat.tsx` - Chat interface
- `components/ai/conversation-history.tsx` - Conversation sidebar
- `components/ai/ai-insights.tsx` - Insights dashboard
- `components/ai/ai-settings.tsx` - Settings page
- `app/dashboard/ai/page.tsx` - Main AI page
- `app/dashboard/ai/ai-assistant-client.tsx` - Client component

**Documentation:**
- `AI_SYSTEM_README.md` - Comprehensive system documentation
- `AI_SETUP_GUIDE.md` - This file
- `prisma/migrations/add_ai_system.sql` - Migration SQL
