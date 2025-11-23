# How to Run the Championship Team Seed Script

This guide will help you populate your database with realistic Championship soccer team data.

---

## 🎯 What This Creates

**Riverside United FC** - A complete English Championship team with:

- ✅ **25 Players** - Full squad with positions, nationalities, jersey numbers
- ✅ **24 Events** - 4 weeks of training sessions, matches, medical assessments
- ✅ **3 Forms** - Daily Wellness, GPS/Load Monitoring, Injury Reports
- ✅ **700+ Form Responses** - 28 days of wellness data for all players
- ✅ **3 Spreadsheets** - Training Load, Wellness Tracking, Injury Log
- ✅ **Realistic Data** - Injuries, performance variations, match results

---

## 📋 Prerequisites

1. **Database is running** - Your PostgreSQL database must be accessible
2. **Environment variables set** - `DATABASE_URL` in your `.env` file
3. **Prisma is set up** - Run `npx prisma generate` if you haven't

---

## 🚀 Running the Seed Script

### Option 1: Direct Execution (Recommended)

```bash
# From the project root
npx tsx prisma/seed-championship-team.ts
```

### Option 2: Using ts-node

```bash
# From the project root
npx ts-node prisma/seed-championship-team.ts
```

### Option 3: Compile and Run

```bash
# Compile TypeScript
npx tsc prisma/seed-championship-team.ts

# Run the compiled JavaScript
node prisma/seed-championship-team.js
```

---

## ⏱️ Expected Runtime

The script should complete in **30-60 seconds** depending on your database connection.

You'll see progress output like:

```
🌱 Seeding Championship team data...

📋 Step 1: Organization setup
✅ Created organization: Riverside United FC

👥 Step 2: Creating player roster (25 players)
  ✓ Tom Harrison (#1) - Goalkeeper
  ✓ Lucas Fernández (#13) - Goalkeeper
  ...

📅 Step 3: Creating events (4 weeks)
  ✓ Training Session - Technical & Tactical
  ✓ MATCH: vs Leeds United (H)
  ...

📋 Step 4: Creating forms
  ✓ Daily Wellness Check
  ✓ GPS/Load Monitoring
  ✓ Injury Report

💬 Step 5: Creating form responses (this may take a moment...)
  ✓ Created 700 wellness check responses

📊 Step 6: Creating spreadsheets with data
  ✓ Weekly Training Load (100 rows)
  ✓ Wellness Tracking (100 rows)
  ✓ Injury Log (3 rows)

============================================================
✨ Championship Team Seeding Complete!
============================================================

📊 Summary:
  • Organization: Riverside United FC
  • Players: 25
  • Events: 24 (4 weeks)
  • Forms: 3 (Wellness, GPS, Injury)
  • Form Responses: 700
  • Spreadsheets: 3 (Training Load, Wellness, Injuries)

🎯 You can now create reports with:
  • Player wellness trends over 4 weeks
  • Training load distribution by position
  • Injury tracking and analysis
  • Multi-chart dashboards combining all data
```

---

## 🔍 Verifying the Data

After running the seed script, you can verify the data in several ways:

### 1. Using Prisma Studio

```bash
npx prisma studio
```

Then navigate to:
- **Organizations** - Look for "Riverside United FC"
- **Persons** - See all 25 players
- **Events** - View the calendar events
- **Forms** - Check the 3 forms
- **FormResponses** - Browse the 700+ responses
- **Spreadsheets** - View the data tables

### 2. Using the Application

1. Log in to your application
2. Navigate to **Players** - You should see 25 players
3. Navigate to **Calendar** - You should see 24 events over 4 weeks
4. Navigate to **Forms** - You should see 3 forms with responses
5. Navigate to **Spreadsheets** - You should see 3 spreadsheets with data
6. Navigate to **Reports** - Now you can create reports!

---

## 📊 Creating Your First Report

Now that you have data, try creating these reports:

### Example 1: Player Wellness Trends
1. Go to **Reports** → **New Report**
2. Choose **Dashboard** type
3. Select **Forms** as data source → **Daily Wellness Check**
4. Add a **Line Chart**:
   - X-Axis: Date Submitted
   - Y-Axis: Energy Level
   - Aggregation: Average
5. Add another chart for Sleep Quality
6. Create the report!

### Example 2: Training Load Distribution
1. Go to **Reports** → **New Report**
2. Choose **Single Chart** type
3. Select **Spreadsheets** → **Weekly Training Load**
4. Choose **Bar Chart**:
   - X-Axis: Player Name
   - Y-Axis: Total Distance
   - Aggregation: Average
5. Create the report!

### Example 3: Multi-Chart Dashboard
1. Go to **Reports** → **New Report**
2. Choose **Dashboard** type
3. Select **Forms** → **Daily Wellness Check**
4. Add multiple sections:
   - Line chart: Wellness trends over time
   - Bar chart: Average wellness by player
   - Pie chart: Hydration status distribution
5. Arrange them in the grid preview
6. Create the dashboard!

---

## 🔄 Re-running the Script

The script is **idempotent** for most operations:

- ✅ **Safe to re-run** - Won't create duplicate players if they already exist
- ✅ **Will add more data** - Events and form responses will be added
- ⚠️ **May create duplicates** - Events and responses will be duplicated

If you want a **clean slate**:

```bash
# Option 1: Delete the organization (cascades to all related data)
# Use Prisma Studio to delete "Riverside United FC"

# Option 2: Reset the entire database (DESTRUCTIVE!)
npx prisma migrate reset
# Then re-run the seed script
```

---

## 🐛 Troubleshooting

### Error: "Organization not found"
**Solution:** The script creates the organization automatically. If you see this, there may be a database connection issue.

### Error: "Unique constraint failed"
**Solution:** Some data already exists. Either delete the existing data or modify the script to use different IDs.

### Error: "Cannot find module 'date-fns'"
**Solution:** Install dependencies:
```bash
npm install date-fns
```

### Script runs but no data appears
**Solution:** Check your `DATABASE_URL` environment variable. Make sure you're connected to the correct database.

---

## 📈 What's Next?

After seeding the data:

1. **Explore the Players page** - See the full roster
2. **Check the Calendar** - View training and match events
3. **Browse Forms** - Look at the wellness and GPS forms
4. **Open Spreadsheets** - Review the performance data
5. **Create Reports** - Build your first dashboard!
6. **Test the Reports Feature** - This was the whole point! 🎉

---

## 💡 Tips for Testing Reports

- **Start simple** - Create a single chart first
- **Use date range filters** - Try "Last 7 days" vs "Last 30 days"
- **Mix data sources** - Combine form responses with spreadsheet data
- **Create dashboards** - Add 3-4 charts to see the grid layout
- **Test responsiveness** - View reports on different screen sizes
- **Export functionality** - Try exporting to CSV/PDF

---

## 🎨 Customization

Want to modify the data? Edit `seed-championship-team.ts`:

- **Change team name** - Update `TEAM_NAME` constant
- **Add more players** - Extend the `PLAYERS` array
- **Adjust date range** - Modify `baseDate` calculation
- **Add more events** - Extend the `events` array
- **Customize wellness data** - Modify `generateWellnessData()` function
- **Add more spreadsheets** - Create additional data tables

---

## ✅ Success Checklist

After running the seed script, verify:

- [ ] 25 players visible in Players page
- [ ] 24 events visible in Calendar (spanning 4 weeks)
- [ ] 3 forms created (Wellness, GPS, Injury)
- [ ] Form responses visible (700+ wellness checks)
- [ ] 3 spreadsheets with data
- [ ] Can create a report using form data
- [ ] Can create a report using spreadsheet data
- [ ] Can create a multi-chart dashboard
- [ ] Reports display data correctly
- [ ] No console errors when viewing reports

---

## 🎉 You're Ready!

Your database is now populated with realistic Championship soccer team data. Time to test the reports feature properly! 

Create some dashboards, explore the data, and see how the reporting system handles real-world sports science scenarios.

**Happy reporting!** 📊⚽

