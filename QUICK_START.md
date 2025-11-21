# AI Assistant - Quick Start Guide

## 🚀 Get Started in 3 Steps (10 Minutes)

### Step 1: Database Migration (5 min)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to SQL Editor
3. Open the file: `prisma/migrations/add_ai_system.sql`
4. Copy all contents and paste into SQL Editor
5. Click **Run**

**Verify it worked:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_name LIKE 'ai_%';
```
You should see 5 tables: `ai_conversations`, `ai_messages`, `ai_insights`, `ai_settings`, `ai_cost_tracking`

### Step 2: Add API Key (2 min)

1. Get your key from [console.anthropic.com](https://console.anthropic.com/)
2. Add to `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
3. Restart server:
```bash
npm run dev
```

### Step 3: Test It (3 min)

1. Navigate to http://localhost:3000/dashboard/ai
2. Send a message: "Show me all players"
3. Watch the AI respond in real-time!

---

## 📚 Full Documentation

- **[AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md)** - Complete setup instructions
- **[AI_SYSTEM_README.md](./AI_SYSTEM_README.md)** - System documentation
- **[AI_DEPLOYMENT_CHECKLIST.md](./AI_DEPLOYMENT_CHECKLIST.md)** - Production deployment
- **[REVIEW_COMPLETE.md](./REVIEW_COMPLETE.md)** - Implementation review

---

## ❓ Troubleshooting

**Error: "The table public.ai_conversations does not exist"**
→ Run Step 1 (database migration)

**Error: "Could not resolve authentication method"**
→ Add ANTHROPIC_API_KEY to `.env.local` and restart server

**Nothing happens when I send a message**
→ Check browser console (F12) for errors

---

## 💰 Cost Information

- Average message: ~$0.005
- Average conversation: ~$0.045
- Heavy user (50 chats/month): ~$2.25/month
- Default limit: 1M tokens/month (≈220 conversations)

**Cost controls are built-in and configurable in Settings.**

---

## ✨ Features

- **Chat Interface** - Natural language queries with streaming responses
- **12 AI Tools** - Data access, actions, and analysis
- **Insights** - Proactive alerts and recommendations (framework ready)
- **Settings** - Privacy controls, usage limits, cost tracking

---

## 🎯 Try These Queries

- "Show me all players"
- "Who hasn't completed wellness form today?"
- "Create a recovery event for all players with wellness below 6"
- "Analyze load vs wellness for this week"
- "List all events this month"

---

## 📞 Need Help?

1. Check [AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md) for detailed instructions
2. Review troubleshooting sections in documentation
3. Verify all 3 steps above are completed

---

**That's it! You're ready to use the AI Assistant.** 🎉
