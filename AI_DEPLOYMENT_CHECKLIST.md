# AI Assistant Deployment Checklist

Use this checklist to deploy the AI Assistant system to production.

## Pre-Deployment

### 1. Database Migration
- [ ] **Run migration SQL in Supabase Dashboard**
  - Navigate to SQL Editor in Supabase Dashboard
  - Copy contents of `prisma/migrations/add_ai_system.sql`
  - Execute the SQL
  - Verify all 5 tables were created (run verification query below)

**Verification Query:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'ai_%'
ORDER BY table_name;
```

Expected output:
```
ai_conversations
ai_cost_tracking
ai_insights
ai_messages
ai_settings
```

- [ ] **Check indexes were created**
```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename LIKE 'ai_%'
ORDER BY tablename, indexname;
```

- [ ] **Verify foreign keys**
```sql
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name LIKE 'ai_%';
```

### 2. Environment Variables
- [ ] **Add ANTHROPIC_API_KEY to production environment**
  - Vercel: Project Settings → Environment Variables
  - Netlify: Site settings → Build & deploy → Environment
  - Other: Add to your hosting platform's environment variables

```bash
ANTHROPIC_API_KEY=sk-ant-your-production-key-here
```

- [ ] **Verify environment variable is set**
  - Test by deploying and checking logs
  - Or use hosting platform's environment variable viewer

### 3. Dependencies
- [ ] **Verify package.json includes:**
  ```json
  {
    "@anthropic-ai/sdk": "^0.30.1",
    "react-markdown": "^9.0.1"
  }
  ```

- [ ] **Install dependencies** (if not already done)
  ```bash
  npm install
  ```

### 4. Prisma Client
- [ ] **Generate Prisma Client with new models**
  ```bash
  npx prisma generate
  ```

- [ ] **Verify Prisma Client recognizes AI models**
  ```typescript
  // Should not show TypeScript errors
  import { db } from '@/lib/db'
  db.aIConversation // Should autocomplete
  db.aIMessage // Should autocomplete
  db.aIInsight // Should autocomplete
  db.aISettings // Should autocomplete
  db.aICostTracking // Should autocomplete
  ```

## Testing

### 5. Local Testing
- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Navigate to AI Assistant**
  - Go to http://localhost:3000/dashboard/ai
  - Should see AI Assistant interface without errors

- [ ] **Test Chat Tab**
  - Send a test message: "Show me all players"
  - Should receive streaming response from Claude
  - Check browser console for errors

- [ ] **Test Insights Tab**
  - Should see "No Active Insights" message
  - No console errors

- [ ] **Test Settings Tab**
  - Should load default settings or user's existing settings
  - Toggle a setting and click Save
  - Should see success toast

- [ ] **Test Conversation History**
  - Send a few messages in chat
  - Should appear in left sidebar
  - Click to load conversation
  - Test delete conversation

### 6. API Testing
- [ ] **Test chat endpoint**
  ```bash
  curl -X POST http://localhost:3000/api/ai/chat \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role": "user", "content": "Hello"}]}'
  ```

- [ ] **Test conversations endpoint**
  ```bash
  curl http://localhost:3000/api/ai/conversations
  ```

- [ ] **Test insights endpoint**
  ```bash
  curl http://localhost:3000/api/ai/insights
  ```

- [ ] **Test settings endpoint**
  ```bash
  curl http://localhost:3000/api/ai/settings
  ```

### 7. Error Handling
- [ ] **Test without ANTHROPIC_API_KEY**
  - Remove API key temporarily
  - Try to send message
  - Should show graceful error message

- [ ] **Test with invalid API key**
  - Set API key to invalid value
  - Try to send message
  - Should show authentication error

- [ ] **Test database connection failure**
  - Check that UI shows loading state
  - Check that API returns proper 500 errors

## Production Deployment

### 8. Build Verification
- [ ] **Run production build**
  ```bash
  npm run build
  ```

- [ ] **Check for TypeScript errors**
  - Build should complete without errors
  - No type errors related to AI models

- [ ] **Check for missing imports**
  - Verify all AI components compile correctly
  - No missing dependencies

### 9. Deploy to Production
- [ ] **Commit all changes**
  ```bash
  git add .
  git commit -m "Add AI Assistant system"
  git push origin main
  ```

- [ ] **Deploy to hosting platform**
  - Vercel: Automatic deployment on push
  - Netlify: Automatic deployment on push
  - Other: Follow platform-specific deployment process

- [ ] **Monitor deployment logs**
  - Check for any build errors
  - Verify environment variables are loaded
  - Check that Prisma Client generated correctly

### 10. Post-Deployment Verification
- [ ] **Test production URL**
  - Navigate to https://your-domain.com/dashboard/ai
  - Should load without errors

- [ ] **Test authentication**
  - Log in as a user
  - Access AI Assistant
  - Send a test message

- [ ] **Monitor API responses**
  - Check server logs for errors
  - Verify Anthropic API calls are working
  - Check database queries are executing

- [ ] **Test all features**
  - Chat interface
  - Conversation history
  - Insights dashboard
  - Settings page

## Monitoring & Maintenance

### 11. Cost Monitoring
- [ ] **Set up Anthropic usage alerts**
  - Monitor your Anthropic dashboard
  - Set budget alerts if available

- [ ] **Check initial usage**
  - Review ai_cost_tracking table
  - Verify cost calculations are accurate

- [ ] **Monitor token usage**
  ```sql
  SELECT
    DATE(created_at) as date,
    COUNT(*) as requests,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(total_cost) as total_cost
  FROM ai_cost_tracking
  GROUP BY DATE(created_at)
  ORDER BY date DESC
  LIMIT 30;
  ```

### 12. User Access
- [ ] **Create test user settings**
  - First user to access AI will get default settings
  - Verify settings are created correctly

- [ ] **Document usage for team**
  - Share AI_SETUP_GUIDE.md with team
  - Provide training on how to use AI Assistant
  - Set expectations for response times and capabilities

### 13. Performance Monitoring
- [ ] **Monitor API response times**
  - Check streaming latency
  - Monitor database query performance
  - Look for slow tool calls

- [ ] **Set up error tracking**
  - Sentry, LogRocket, or similar
  - Monitor AI-related errors specifically

- [ ] **Database performance**
  - Monitor query performance for AI tables
  - Check index usage
  - Optimize if needed

## Rollback Plan

### 14. Emergency Rollback
If something goes wrong, follow these steps:

- [ ] **Disable AI Assistant in UI**
  - Comment out AI nav item in app-sidebar.tsx
  - Deploy immediately

- [ ] **Investigate issues**
  - Check server logs
  - Review error messages
  - Identify root cause

- [ ] **Fix and redeploy**
  - Address identified issues
  - Test locally
  - Re-enable and deploy

## Post-Launch

### 15. User Feedback
- [ ] **Collect initial feedback**
  - Ask users about experience
  - Identify pain points
  - Note feature requests

- [ ] **Monitor usage patterns**
  - What queries are users asking?
  - Which tools are used most?
  - Are conversations useful?

### 16. Optimization
- [ ] **Review cost per user**
  - Calculate average monthly cost
  - Adjust token limits if needed
  - Optimize prompts for efficiency

- [ ] **Improve prompts**
  - Based on user feedback
  - Reduce token usage where possible
  - Improve response quality

- [ ] **Add more tools**
  - Identify common manual tasks
  - Add new tools to automate them
  - Test thoroughly before deploying

## Success Metrics

Track these metrics after launch:

- [ ] **Adoption Rate**
  - % of users who try AI Assistant
  - % of users who return after first use
  - Average sessions per user per week

- [ ] **Engagement**
  - Average messages per conversation
  - Average conversations per user per month
  - Tool usage frequency

- [ ] **Satisfaction**
  - User feedback scores
  - Support tickets related to AI
  - Feature request volume

- [ ] **Cost Efficiency**
  - Cost per user per month
  - Cost per conversation
  - ROI vs. manual processes

## Troubleshooting Guide

### Common Issues

**Issue: "The table public.ai_conversations does not exist"**
- Solution: Run database migration (Step 1)

**Issue: "Could not resolve authentication method"**
- Solution: Add ANTHROPIC_API_KEY to environment variables (Step 2)

**Issue: Build fails with TypeScript errors**
- Solution: Run `npx prisma generate` (Step 4)

**Issue: High API costs**
- Solution: Review and reduce token limits in Settings

**Issue: Slow response times**
- Solution: Check database performance, optimize queries, review tool execution times

**Issue: Tool calls failing**
- Solution: Verify database has test data, check user permissions, review server logs

## Support

For issues during deployment:

1. Review logs in hosting platform
2. Check browser console for client-side errors
3. Review server logs for API errors
4. Verify all checklist items completed
5. Consult AI_SETUP_GUIDE.md and AI_SYSTEM_README.md

---

## Sign-off

Deployment completed by: ___________________

Date: ___________________

Verified by: ___________________

All checklist items completed: ⬜

Production URL: ___________________

Initial users invited: ⬜

Monitoring set up: ⬜
