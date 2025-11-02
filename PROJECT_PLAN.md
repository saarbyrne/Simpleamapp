# SimpleAM.app - Project Plan & Understanding

## Project Understanding

### Mission Statement
SimpleAM.app is building the **"Dollar Shave Club for sports teams"** - a low-cost, high-quality athlete management platform that disrupts incumbents like Kitman Labs and Teamworks by leveraging AI, modern development practices, and ruthless cost efficiency.

**Core Philosophy:**
- Undeniably superior products at lower cost
- AI-first development (small team, high output)
- Modular and abstract (works for any sport)
- Simple, intuitive, no-frills interface
- Fast iteration and lean operations

### Target Market
- Professional sports clubs
- College/university teams
- Youth academies
- Direct-to-consumer, subscription-based model
- Freemium approach with easy trial and setup

### Current State Analysis

**What exists:**
- ✅ Vite + React + TypeScript project setup
- ✅ shadcn/ui components fully integrated
- ✅ Basic application shell with sidebar navigation
- ✅ Players table with TanStack Table (filtering, sorting, pagination)
- ✅ Basic routing between sections (Players, Forms, Reports, etc.)
- ✅ Mock data for 8 players
- ✅ Responsive design foundation

**What's missing:**
- ❌ Backend infrastructure (Supabase, Prisma)
- ❌ Authentication system
- ❌ Database schema
- ❌ All feature modules except basic Players UI
- ❌ Real data integration
- ❌ Mobile optimization
- ❌ Deployment pipeline

---

## Tech Stack (Confirmed from Docs)

### Frontend
- **Framework:** React 18 with Vite (currently using Vite, should migrate to Next.js 14+ App Router)
- **UI Library:** shadcn/ui + Tailwind CSS ✅ (already installed)
- **State Management:** TanStack Query + Zustand (needs setup)
- **Tables:** TanStack Table ✅ (already in use)
- **Forms:** React Hook Form + Zod ✅ (installed, not used yet)
- **Charts:** Recharts ✅ (installed, not used yet)

### Backend (Not Started)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **File Storage:** Supabase Storage
- **Email:** Resend
- **Background Jobs:** BullMQ + Redis

---

## Feature Modules (From Docs)

### Core Sections
1. **Players** - Squad management, profiles, activity tracking
2. **Forms** - Custom forms, wellness checks, surveys
3. **Reports** - Analytics, dashboards, insights
4. **Calendar** - Events, matches, training sessions
5. **Notes** - Rich text notes with privacy levels (Tiptap)
6. **Spreadsheets** - Data tables, performance tracking
7. **Canvas** - Drawing board, tactics, formations
8. **Files** - Document management
9. **Planner** - Scheduling, planning tools
10. **Data Management** - Import/export, integrations
11. **System Settings** - Organization settings, billing
12. **User Profile** - Account settings, preferences
13. **AI Assistant** - Context-aware help and insights
14. **Templates Hub** - Pre-built templates

---

## Critical Gaps & Priorities

### Phase 1: Foundation (Weeks 1-4)
**Priority: CRITICAL** - Nothing works without this

1. **Backend Infrastructure Setup**
   - Supabase project creation
   - Prisma schema design
   - Database migrations
   - Supabase client configuration

2. **Authentication System**
   - Supabase Auth integration
   - Login/signup flows
   - Magic links for players
   - Organization creation
   - Multi-org support

3. **Core Database Schema**
   - Organizations
   - Users (staff + players)
   - Persons (players/staff profiles)
   - Roles & permissions
   - Cross-org player linking

### Phase 2: Players Module (Weeks 5-7)
**Priority: HIGH** - Foundation for all other features

1. **Complete Player Management**
   - Create/edit player profiles
   - Player profile tabs (Overview, Forms, Events, Performance, Notes, Files)
   - Photo upload
   - CSV import
   - Advanced filtering
   - Cross-org player view

2. **Player Data Aggregation**
   - Form responses integration
   - Event attendance tracking
   - Performance metrics
   - Activity timeline

### Phase 3: Forms Module (Weeks 8-9)
**Priority: HIGH** - Core value proposition

1. **Form Builder**
   - Drag-and-drop interface
   - Field types (text, number, scale, multiple choice, etc.)
   - Conditional logic
   - Templates

2. **Form Distribution**
   - Schedule forms (one-time, recurring)
   - Target specific players/groups
   - WhatsApp/Email notifications

3. **Form Responses**
   - Player submission interface
   - Response collection
   - Analytics dashboard

### Phase 4: Calendar & Events (Weeks 10-11)
**Priority: HIGH** - Essential for team management

1. **Calendar View**
   - Month/week/day views
   - Event types (training, match, medical)
   - Color coding

2. **Event Management**
   - Create/edit events
   - Attendance tracking
   - Player selection
   - Integration with forms

### Phase 5: Notes Module (Weeks 12-13)
**Priority: MEDIUM** - Collaboration feature

1. **Rich Text Editor**
   - Tiptap integration
   - Basic formatting
   - @mentions
   - Image embedding

2. **Privacy & Permissions**
   - Public notes
   - Role-specific (medical, coaching)
   - Private notes
   - Linking to entities

### Phase 6: Additional Modules (Weeks 14-20)
**Priority: MEDIUM-LOW**

1. Spreadsheets (3 weeks)
2. Reports (5-6 weeks)
3. Files (2.5 weeks)
4. Canvas (2.5 weeks)
5. Planner (3 weeks)

### Phase 7: AI Integration (Weeks 21-24)
**Priority: HIGH** - Competitive advantage

1. Context-aware AI assistant
2. Player performance insights
3. Form analysis
4. Predictive analytics

---

## What YOU Need to Setup (Required from You)

### 1. Supabase Account & Project
**Time: 10 minutes**
- Go to [supabase.com](https://supabase.com)
- Create free account
- Create new project: "simpleam-app" (or similar)
- Note down:
  - Project URL
  - Anon public key
  - Service role key (keep secret!)
  - Database password

**I'll need these credentials as environment variables**

### 2. WhatsApp Business API (Future - Week 5-7)
**Time: 5-7 days (Meta approval process)**
- Apply at Meta Business Platform
- Business verification documents needed
- Set up business account
- Get:
  - Phone number ID
  - Business Account ID
  - Access token
  - Webhook token

**Alternative:** Use Twilio for faster setup (higher cost per message)

### 3. Google OAuth (Future - Week 3-4)
**Time: 15 minutes**
- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create new project
- Enable Google OAuth 2.0
- Create credentials (Web application)
- Add authorized redirect URIs
- Get:
  - Client ID
  - Client Secret

### 4. Instagram/Facebook OAuth (Future - Week 3-4)
**Time: 20 minutes**
- Go to [developers.facebook.com](https://developers.facebook.com)
- Create new app (type: Consumer)
- Add Facebook Login + Instagram Graph API
- Configure OAuth settings
- Get:
  - App ID
  - App Secret

### 5. Domain & Hosting (Future - Week 6-8)
**Time: 30 minutes**
- Purchase domain (e.g., simpleam.app)
- Choose hosting:
  - **Recommended:** Vercel (free tier, easy Next.js deployment)
  - **Alternative:** Netlify, AWS, DigitalOcean
- Configure DNS

### 6. Email Service (Future - Week 4-5)
**Time: 15 minutes**
- Sign up for Resend.com (recommended in docs)
- Verify domain
- Get API key

---

## What I Can Do Independently

### Immediate Tasks (No External Setup Needed)
1. ✅ Review and understand codebase
2. ✅ Create project plan
3. Complete Players UI (profile view, tabs)
4. Build form builder interface
5. Design database schema
6. Create Prisma models
7. Build authentication UI (login/signup screens)
8. Develop component library
9. Create mock data and prototypes
10. Write technical documentation

### Tasks Requiring Your Setup
- Backend integration (needs Supabase credentials)
- Authentication flows (needs OAuth apps)
- Email notifications (needs Resend API key)
- WhatsApp integration (needs Meta/Twilio account)
- Deployment (needs hosting account)

---

## Recommended Development Approach

### Option 1: Frontend-First (Recommended for You)
**What I'll do:**
1. Build complete UI for all modules with mock data
2. Create beautiful, functional interfaces
3. Implement all interactions and workflows
4. Design database schema in parallel
5. **You see visual progress immediately**
6. Backend integration happens in Phase 2

**Advantages:**
- Visual feedback quickly
- You can test UX before backend
- Easier to iterate on design
- No external dependencies initially

**When we need backend:**
- Week 3-4: Set up Supabase (I'll guide you)
- Week 4-5: Connect authentication
- Week 5-6: Integrate database

### Option 2: Full-Stack Sequential
**What I'll do:**
1. Set up complete backend first (needs Supabase immediately)
2. Build frontend modules one-by-one with real integration
3. Slower initial progress
4. Each module fully functional before moving on

**Advantages:**
- Real data from day 1
- No need to refactor later
- Production-ready sooner

**Disadvantages:**
- Requires setup from you immediately
- Slower visible progress initially

---

## Immediate Next Steps

### Week 1: Foundation
**No external setup needed yet**

1. **Create Component Library**
   - Player profile component
   - Form builder components
   - Calendar components
   - Note editor components

2. **Enhance Players Module**
   - Build tabbed player profile view
   - Create player profile tabs (Overview, Forms, Events, etc.)
   - Add player creation form
   - Implement advanced filtering

3. **Design System Documentation**
   - Component patterns
   - Style guide
   - Usage examples

4. **Database Schema Design**
   - Draw ER diagrams
   - Write Prisma schema
   - Plan migrations

### Week 2-3: Core Modules (UI Only)
**Still no external setup needed**

1. Forms module UI
2. Calendar module UI
3. Notes editor integration
4. Dashboard views

### Week 4: Backend Preparation
**This is when I'll need Supabase setup from you**

1. Supabase project setup (you create account)
2. Prisma configuration
3. Database migrations
4. API routes setup

---

## Questions for You

### Project Direction
1. **Which approach do you prefer?**
   - Option 1: Frontend-first with mock data (recommended)
   - Option 2: Full-stack sequential

2. **What's your timeline?**
   - MVP in 3 months? 6 months? 12 months?
   - Are you validating with customers now?
   - Do you have funding?

3. **Migration from Vite to Next.js?**
   - Your docs specify Next.js 14+ App Router
   - Currently using Vite
   - Should I migrate to Next.js now or continue with Vite?

4. **Design Assets?**
   - You mentioned Figma files exist
   - Should I follow those exactly or adapt?
   - Do you have a brand guide (colors, fonts, logo)?

### Feature Priorities
1. **Which module is most critical?**
   - Players + Forms seem most important
   - What do customers need first?

2. **Mobile vs Desktop priority?**
   - Docs say "mobile first"
   - Should I optimize mobile before desktop?

3. **Multi-sport from day 1?**
   - Or start with one sport (football/soccer)?
   - How abstract should position/formation definitions be?

---

## Cost Estimates (Monthly)

### Development Phase (Free Tier)
- Supabase: $0 (free tier: 500MB database, 1GB file storage)
- Vercel: $0 (free tier: 100GB bandwidth)
- Development: $0

### Production (100 Active Players)
- Supabase: $25/month (Pro plan recommended)
- Vercel: $20/month (Pro plan)
- WhatsApp: $0-50 (~500 messages/month)
- Email: $0 (Resend free tier: 3,000/month)
- **Total: ~$45-95/month**

### Production (500+ Players)
- Supabase: $25-100/month
- Vercel: $20-50/month
- WhatsApp: $50-200/month
- Redis (BullMQ): $10-30/month
- **Total: ~$105-380/month**

---

## Tools & Access I'll Need From You

### Now (Week 1)
- ✅ GitHub repo access (already have)
- Confirmation on approach (Option 1 or 2)
- Design assets (Figma link if following exactly)

### Week 3-4 (Backend Setup)
- Supabase credentials (project URL, anon key, service key)
- Environment variables setup instructions

### Week 5-7 (Authentication)
- Google OAuth credentials
- Facebook/Instagram OAuth credentials

### Week 8-10 (Notifications)
- Email service API key (Resend)
- WhatsApp Business API or Twilio credentials

### Week 10-12 (Deployment)
- Domain name
- Hosting account access
- Production environment variables

---

## Success Metrics

### Technical Milestones
- [ ] Complete UI for Players module
- [ ] Complete UI for Forms module
- [ ] Backend infrastructure operational
- [ ] Authentication working
- [ ] First real user can sign up and use system
- [ ] Mobile-responsive on all pages
- [ ] AI assistant integrated

### Product Milestones
- [ ] First customer pilot (beta)
- [ ] 10 organizations using the platform
- [ ] Feature parity with key competitor features
- [ ] Cost < 50% of Kitman Labs/Teamworks
- [ ] Customer NPS > 8/10

---

## Let's Get Started!

**I recommend we start with Option 1 (Frontend-First) so you can see progress immediately.**

My first sprint (next 3-5 days):
1. Complete Player profile view with all tabs
2. Build form builder UI
3. Create calendar component
4. Design database schema

**What do you think? Ready to proceed?**
