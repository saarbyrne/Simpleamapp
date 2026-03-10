# SimpleAM - Comprehensive Sports Management Platform

> **AI-powered athlete management and analytics platform** - Unify team management, performance tracking, tactical planning, and data-driven insights in one intelligent workspace.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

[Original Design](https://www.figma.com/design/5oEpqcdnfjW9BTPo5ch9Jw/simpleam.app) • [Documentation](./docs/) • [Agent Start](./docs/AGENT_START.md)

---

## 🎯 What is SimpleAM?

SimpleAM is an enterprise-grade sports management platform that **replaces 5+ separate tools** used by coaches, medical staff, and athletes with a unified, AI-powered workspace. Built for sports teams, academies, and professional organizations, it provides:

- **Athlete Management** - Complete player profiles, health tracking, and development plans
- **Data Collection** - Custom forms with scheduling, wellness monitoring, and RPE tracking
- **Calendar & Events** - Training sessions, matches, medical appointments with attendance
- **Tactical Planning** - Integrated whiteboard (Excalidraw) for formations, drills, and session plans
- **Analytics & Reports** - Customizable dashboards with AI-generated insights
- **AI Workspace** - Generate reports, whiteboards, training plans, and UI pages from natural language
- **Team Collaboration** - Real-time chat, file sharing, and multi-role access control
- **Long-term Planning** - Season planning, player development programs, and milestone tracking

### Why SimpleAM?

**For Coaches:**
- Plan entire seasons with integrated calendar and tactical tools
- Track player wellness and performance trends
- Generate reports with one click instead of manual spreadsheets
- AI analyzes patterns and suggests training adjustments

**For Medical Staff:**
- Private medical notes with granular access control
- Injury tracking and rehabilitation planning
- Wellness monitoring with automated alerts
- GDPR-compliant data management

**For Athletes:**
- Self-service wellness check-ins
- Access to personal development plans
- View training schedules and session plans
- Track progress toward goals

---

## ✨ Key Features

### 🤖 AI-Powered Workflows
- **AI Workspace**: Generate comprehensive artifacts from natural language prompts
  - Reports with charts and KPIs
  - Tactical whiteboards with formations
  - Training plans with periodization
  - Custom UI pages
- **Extended Thinking**: Claude Sonnet 4.5 with 10,000 token reasoning budget
- **Real-time Streaming**: Server-Sent Events (SSE) for live progress updates
- **Smart Validation**: Multi-step validation ensures quality outputs

### 📊 Advanced Data Management
- **Spreadsheet Interface**: Excel-like editing with custom column schemas
- **Version History**: Track changes with rollback capability
- **Audit Trails**: Row-level change tracking for compliance
- **30-Day Trash**: Soft delete with recovery
- **Granular Permissions**: View/Edit/Admin per table
- **Virtualization**: Handle 1000+ row tables at 60 FPS

### 📅 Smart Calendar
- **Multiple Views**: Month, week, day, agenda
- **Recurring Events**: RRule support for complex schedules
- **Attendance Tracking**: Invited, attending, absent, excused
- **Event Templates**: Pre-configured sessions with resources
- **Linked Resources**: Attach forms, files, notes, drawings to events

### 🎨 Tactical Whiteboard
- **Excalidraw Integration**: Full-featured tactical drawing
- **Template Library**: Formations, drills, set pieces organized by sport
- **Public Sharing**: Share tokens for external access
- **Version History**: Track changes over time

### 📝 Form Builder
- **Drag-and-Drop**: Visual form creator
- **Conditional Logic**: Show/hide fields based on responses
- **Scheduled Distribution**: One-time, daily, weekly, monthly
- **Template Library**: Wellness, RPE, medical, custom
- **Response Analytics**: Track completion rates and trends

### 📈 Report Builder
- **Drag-and-Drop**: Assemble multi-section dashboards
- **Chart Types**: Line, bar, area, pie, table, KPI cards
- **Data Sources**: Spreadsheets, forms, events
- **Time Filters**: Last 7/30/90 days, custom ranges
- **AI Insights**: Optional AI-generated analysis
- **PDF Export**: Professional reports for sharing

### 🌍 Multi-Language Support
- **8 Languages**: English, Spanish, French, German, Portuguese, Italian, Japanese, Arabic
- **RTL Support**: Full right-to-left for Arabic, Hebrew, Farsi, Urdu
- **Auto-Translation**: Assisted translation workflow
- **Locale Routing**: URL-based language detection

### 🔒 Privacy & Security
- **Row Level Security**: PostgreSQL RLS on all tables
- **Granular Privacy Levels**: Public, Medical, Mental Health, Coaches, Private
- **GDPR Compliance**: PII scrubbing in analytics
- **Audit Logging**: Track all data access and modifications
- **Secure Authentication**: Supabase Auth with OAuth support

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (ES2017+ support required)
- **PostgreSQL** database (Supabase recommended)
- **npm** or **yarn**
- (Optional) **Anthropic API key** for AI features
- (Optional) **Firebase project** for real-time chat

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/saarbyrne/Simpleamapp.git
cd Simpleamapp

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see Configuration section)

# 4. Generate Prisma Client
npm run db:generate

# 5. Apply database schema
npm run db:push
# OR run migrations: npm run db:migrate

# 6. Start development server
npm run dev
# Open http://localhost:3000
```

### First-Time Setup

1. **Create Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and keys

2. **Configure Environment Variables**
   ```bash
   # Required: Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=postgresql://... (Transaction pooler)
   DIRECT_URL=postgresql://... (Direct connection)

   # Optional: AI Features
   ANTHROPIC_API_KEY=sk-ant-api03-...

   # Optional: Firebase Chat
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

3. **Initialize Database**
   ```bash
   # Push schema to Supabase
   npm run db:push

   # (Optional) Open Prisma Studio to view data
   npm run db:studio
   ```

4. **Create First User**
   - Navigate to http://localhost:3000
   - Sign up with email
   - Verify email via Supabase inbox
   - Log in and create your first organization

---

## 📁 Project Structure

```
Simpleamapp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (marketing)/              # Landing pages
│   ├── dashboard/                # Main application
│   │   ├── ai/                   # AI Assistant
│   │   ├── ai-workspace/         # AI Workspace (artifacts)
│   │   ├── calendar/             # Calendar & events
│   │   ├── canvas/               # Tactical whiteboard
│   │   ├── chat/                 # Team messaging
│   │   ├── data-management/      # Spreadsheets & tables
│   │   ├── files/                # File management
│   │   ├── forms/                # Form builder
│   │   ├── notes/                # Note-taking
│   │   ├── planner/              # Long-term planning
│   │   ├── players/              # Athlete management
│   │   ├── reports/              # Report builder
│   │   ├── spreadsheets/         # Spreadsheet interface
│   │   ├── templates/            # Template marketplace
│   │   └── system-settings/      # System configuration
│   ├── api/                      # API routes
│   └── actions/                  # Server Actions
├── components/                   # React components
│   ├── ui/                       # Base UI (64 shadcn components)
│   ├── ai-workspace/             # AI Workspace UI (17 components)
│   ├── calendar/                 # Calendar components
│   ├── canvas/                   # Canvas UI
│   ├── data-management/          # Data table components
│   └── ...                       # Feature-specific components
├── lib/                          # Utilities & libraries
│   ├── ai/                       # AI utilities
│   ├── auth/                     # Authentication (cached sessions)
│   ├── db/                       # Database client
│   ├── permissions/              # Feature access & route protection
│   ├── supabase/                 # Supabase client & middleware
│   └── utils/                    # General utilities
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema (11 migrations)
├── public/                       # Static assets
├── messages/                     # i18n translations (8 languages)
├── docs/                         # Documentation
│   ├── features/                 # Feature documentation
│   └── setup/                    # Setup guides
├── next.config.js                # Next.js configuration
├── middleware.ts                 # Auth & request validation
└── package.json                  # Dependencies & scripts
```

---

## 🔧 Configuration

### Required Environment Variables

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."          # Transaction pooler
DIRECT_URL="postgresql://..."            # Direct connection for migrations

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Your app URL
NODE_ENV="development"                       # development | production
```

### Optional Environment Variables

```bash
# AI Features (Anthropic)
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Firebase (Real-time Chat)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Analytics (All Free Tier)
NEXT_PUBLIC_SENTRY_DSN="https://..."         # Error tracking
SENTRY_ORG="..."
SENTRY_PROJECT="..."
SENTRY_AUTH_TOKEN="..."
NEXT_PUBLIC_POSTHOG_KEY="..."                # Product analytics
NEXT_PUBLIC_POSTHOG_HOST="..."

# Billing (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO="price_..."
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE="price_..."

# Storage
NEXT_PUBLIC_STORAGE_BUCKET="files"
```

See `.env.example` for detailed descriptions of all variables.

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:status        # Check database status
npm run db:test          # Test database connection
npm run db:studio        # Open Prisma Studio

# Testing
npm test                 # Run unit tests (Vitest)
npm run test:unit        # Unit tests
npm run test:e2e         # End-to-end tests (Playwright)
npm run test:visual      # Visual regression tests
npm run test:a11y        # Accessibility tests
npm run test:perf        # Performance tests (Lighthouse)

# Internationalization
npm run i18n:audit       # Audit translations
npm run i18n:sync        # Sync translation files
npm run i18n:translate   # Auto-translate missing keys
npm run i18n:cleanup     # Remove unused translations

# RTL Support
npm run rtl:scan         # Scan for RTL issues
npm run rtl:fix          # Fix RTL issues (dry run)
npm run rtl:fix:apply    # Apply RTL fixes

# Quality Assurance
npm run qa:prep          # Pre-deployment checks
npm run qa:full          # Full QA suite
npm run design:lint      # Design system validation

# Analysis
npm run analyze          # Bundle size analysis

# Storybook
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook
```

### Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 14 | App Router, Server Components |
| **Language** | TypeScript 5.6 | Type safety |
| **Database** | PostgreSQL (Supabase) | Primary database |
| **ORM** | Prisma 6.18 | Type-safe queries |
| **Auth** | Supabase Auth | Authentication & sessions |
| **Storage** | Supabase Storage | File uploads |
| **AI** | Anthropic Claude | Sonnet 4.5 with Extended Thinking |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui + Radix | Accessible component library |
| **State** | Zustand + React Query | Global & server state |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **Charts** | Recharts | Data visualization |
| **Calendar** | react-big-calendar | Event scheduling |
| **Whiteboard** | Excalidraw | Tactical diagrams |
| **Rich Text** | Tiptap | Note editor |
| **Tables** | TanStack Table | Data grids |
| **i18n** | next-intl | 8 languages, RTL support |
| **Testing** | Vitest + Playwright | Unit & E2E tests |
| **Analytics** | Sentry + PostHog + Vercel | Error tracking & product analytics |
| **Deployment** | Vercel | Production hosting |

---

## 🗄️ Database Schema

SimpleAM uses PostgreSQL with Prisma ORM. Key entities:

### Core Models
- **Organization** - Teams/clubs (multi-tenancy)
- **User** - Staff members with authentication
- **Person** - Player/staff profiles (can belong to multiple orgs)
- **OrganizationRole** - Custom roles per org
- **UserRole** - Role assignments

### Data Collection
- **Form** - Custom forms with conditional logic
- **FormResponse** - Form submissions
- **Note** - Rich text notes with privacy levels
- **File** - File storage with versioning

### Calendar
- **Event** - Training, matches, meetings
- **EventAttendance** - Attendance tracking

### Data Management
- **Spreadsheet** - Flexible data tables
- **SpreadsheetVersion** - Version history
- **DataChangeLog** - Row-level audit trail
- **TrashItem** - Soft delete with 30-day recovery

### Tactical & Planning
- **Drawing** - Tactical whiteboards (Excalidraw)
- **Plan** - Long-term development plans
- **Milestone** - Plan milestones with progress tracking

### Reports
- **Report** - Custom analytics reports
- **ReportSchedule** - Automated report delivery

### AI Features
- **AIWorkspace** - AI-generated artifacts
- **AIConversation** - AI Assistant conversations
- **AIInsight** - Proactive insights
- **AICostTracking** - Token usage tracking

### Billing
- **Subscription** - Organization subscriptions (Stripe)
- **OrganizationFeatures** - Feature toggles

All tables include:
- Comprehensive indexing
- Row Level Security (RLS)
- Full-text search support
- Soft delete pattern
- Audit trails

See `prisma/schema.prisma` for complete schema.

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Add environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... add all required env vars

# 4. Deploy
vercel --prod
```

### Docker

```bash
# Build
docker build -t simpleam .

# Run
docker run -p 3000:3000 --env-file .env.local simpleam
```

### Standalone

The app is configured for standalone output, suitable for custom hosting:

```bash
npm run build
npm start
```

---

## 🧪 Testing

### Unit Tests (Vitest)
```bash
npm test
# or with coverage
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Install Playwright browsers (first time)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e -- --ui
```

### Visual Regression Tests
```bash
npm run test:visual
```

### Accessibility Tests
```bash
npm run test:a11y
```

### Performance Tests
```bash
npm run test:perf
```

---

## 📚 Documentation

Comprehensive documentation available in the `/docs` directory:

- **[Project Overview](./PROJECT_OVERVIEW.md)** - Architecture and stack
- **[Quick Start](./QUICK_START.md)** - Feature-specific guides
- **[AI Workspace](./AI_WORKSPACE_OVERVIEW.md)** - AI Workspace documentation
- **[Performance Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)** - 65-90% performance improvements
- **[Data Management](./DATA_MANAGEMENT_PROGRESS.md)** - Spreadsheet implementation
- **[Feature Docs](./docs/features/)** - Individual feature guides
- **[Experience Charter](./docs/experience-charter.md)** - UX principles

---

## 🎨 Design System

SimpleAM uses a comprehensive design system built on shadcn/ui and Radix primitives:

- **64 UI Components** - Accessible, composable components
- **Tailwind CSS v4** - Utility-first styling
- **Dark/Light Mode** - Full theme support
- **Responsive Design** - Mobile-first approach
- **Design Tokens** - Centralized design values
- **Storybook** - Component documentation and testing

Run Storybook:
```bash
npm run storybook
```

---

## 🌐 Internationalization

SimpleAM supports **8 languages** with full RTL support:

| Language | Code | RTL |
|----------|------|-----|
| English | en | No |
| Spanish | es | No |
| French | fr | No |
| German | de | No |
| Portuguese | pt | No |
| Italian | it | No |
| Japanese | ja | No |
| Arabic | ar | Yes |

**Adding Translations:**
```bash
# 1. Add translations to /messages/{locale}.json
# 2. Sync translation files
npm run i18n:sync

# 3. Auto-translate missing keys (requires API key)
npm run i18n:translate

# 4. Test RTL layout
npm run rtl:scan
```

---

## 🔒 Security

SimpleAM implements comprehensive security measures:

- **Row Level Security (RLS)** - PostgreSQL policies on all tables
- **Granular Privacy Levels** - Public, Medical, Coaches, Private
- **Input Validation** - Zod schemas for all inputs
- **Rate Limiting** - API rate limits
- **Security Headers** - CSP, HSTS, X-Frame-Options
- **PII Scrubbing** - Analytics data sanitization
- **Audit Logging** - Track all data access
- **Soft Delete** - 30-day recovery window

---

## 📊 Performance

SimpleAM is optimized for production performance:

### Documented Improvements
- **65-90% faster navigation** (see PERFORMANCE_OPTIMIZATIONS.md)
- **Request-level caching** with React cache()
- **Data caching** with Next.js unstable_cache
- **Virtualized tables** - 1000+ rows at 60 FPS
- **Code splitting** - Lazy load heavy components
- **Optimized bundles** - Tree shaking and minification

### Core Web Vitals Targets
- **LCP** ≤ 2.5s (Largest Contentful Paint)
- **INP** ≤ 200ms (Interaction to Next Paint)
- **CLS** ≤ 0.1 (Cumulative Layout Shift)

### Performance Monitoring
- **Vercel Analytics** - Web vitals tracking
- **Vercel Speed Insights** - Real user monitoring
- **Lighthouse CI** - Automated performance testing

---

## 🤝 Contributing

This is a proprietary project. If you have access:

1. Create a feature branch from `main`
2. Make your changes
3. Run quality checks: `npm run qa:prep`
4. Submit a pull request

### Development Workflow
```bash
# 1. Create branch
git checkout -b feature/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: your feature description"

# 3. Run checks before pushing
npm run lint
npm run typecheck
npm test

# 4. Push and create PR
git push origin feature/your-feature
```

---

## 📄 License

This project is **proprietary and confidential**. All rights reserved.

---

## 🆘 Support & Resources

- **Documentation**: See `/docs` directory
- **Issues**: Contact the development team
- **Design**: [Figma Design](https://www.figma.com/design/5oEpqcdnfjW9BTPo5ch9Jw/simpleam.app)

---

## 🎯 Roadmap

### Current Status
- ✅ Core platform complete
- ✅ AI Workspace with artifact generation
- ✅ Multi-language support (8 languages)
- ✅ Performance optimizations (65-90% improvements)
- ⚠️ AI features showing sample data (real integration in progress)
- ⚠️ Real-time collaboration (chat only, not editing)

### Upcoming Features
- Real data integration for AI Workspace
- Multi-user collaborative editing
- Advanced filtering with saved configurations
- React Query client-side caching
- Plugin system for custom visualizations
- Webhook integrations
- Mobile app (React Native)

---

## 📈 Stats

- **Lines of Code**: 50,000+ (TypeScript)
- **Components**: 200+ React components
- **Database Tables**: 30+ with full RLS
- **Supported Languages**: 8 with RTL
- **Test Coverage**: Unit, E2E, Visual, A11y, Performance
- **Performance**: 65-90% faster than v1

---

**Built with ❤️ for coaches, athletes, and sports organizations**

[Original Design](https://www.figma.com/design/5oEpqcdnfjW9BTPo5ch9Jw/simpleam.app) • [Documentation](./docs/) • [Project Overview](./PROJECT_OVERVIEW.md)
