# Project Overview: SimpleAM App

## 1. Project Identity

- **Name**: SimpleAM App (`simpleam.app`)
- **Purpose**: A comprehensive sports management and analytics platform designed for coaches, athletes, and organizations. It integrates team management, performance tracking, tactical planning, and AI-driven insights.
- **Core Value Proposition**: Unifying fragmented sports management tools (spreadsheets, chat, whiteboards, video) into a single, intelligent workspace.

## 2. Technology Stack

### Core

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI primitives), Lucide Icons
- **State Management**: Zustand, React Query (`@tanstack/react-query`)
- **Forms**: React Hook Form, Zod

### Backend & Data

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Server-Sent Events (SSE) for AI streaming
- **External Services**: Firebase (likely for specific integrations or legacy support), Anthropic Claude API (AI)

### Key Libraries

- **Calendar**: `react-big-calendar`, `rrule`
- **Whiteboard**: `@excalidraw/excalidraw`
- **Editor**: Tiptap (Rich text)
- **Drag & Drop**: `@dnd-kit`
- **Charts**: Recharts
- **Date Handling**: `date-fns`

## 3. Architecture

- **App Router**: Uses Next.js App Router structure (`app/` directory).
- **Server Actions**: Heavy use of Server Actions for data mutations (`app/actions/`).
- **API Routes**: Used for specific endpoints like AI streaming (`app/api/`).
- **Middleware**: `middleware.ts` handles authentication and routing protection.
- **Internationalization**: `next-intl` for multi-language support.

## 4. Directory Structure

- **`app/`**: Main application routes and pages.
  - `(auth)/`: Authentication routes.
  - `dashboard/`: Main authenticated user interface.
  - `api/`: Backend API endpoints.
  - `actions/`: Server actions for data mutations.
- **`components/`**: Reusable UI components.
  - `ui/`: Base UI components (buttons, inputs, etc.).
  - `dashboard/`: Dashboard-specific components.
  - `ai-workspace/`: Components for the AI features.
- **`lib/`**: Utility functions, hooks, and shared logic.
- **`prisma/`**: Database schema (`schema.prisma`) and migrations.
- **`public/`**: Static assets (images, icons).
- **`scripts/`**: Maintenance, testing, and migration scripts.

## 5. Data Model (Key Entities)

The database schema is defined in `prisma/schema.prisma`. Key models include:

- **Organization**: The top-level entity grouping users and data.
- **User**: Authenticated accounts (staff, admins).
- **Person**: Profiles for players and staff members (distinct from Users to allow one person to belong to multiple orgs or have no login).
- **PersonOrganization**: Junction table linking Persons to Organizations with roles (player, coach).
- **Event**: Calendar events (training, matches, medical).
- **Form**: Data collection forms (wellness, injury reports).
- **Note**: Rich text notes linked to entities.
- **Plan**: Long-term training or development plans.
- **Drawing**: Tactical whiteboards (Canvas).
- **AIWorkspace**: Stores AI generation sessions and artifacts.

## 6. Key Features

### Dashboard

The central hub for users, providing access to all modules.

### Calendar

Comprehensive scheduling system for training sessions, matches, and meetings. Supports recurring events and attendance tracking.

### Forms & Data Collection

Customizable forms for gathering athlete data (wellness, RPE, medical). Supports templates and recurring schedules.

### Canvas (Tactical Whiteboard)

Integrated Excalidraw-based whiteboard for creating drills, formation setups, and tactical explanations.

### AI Workspace

An intelligent agent system that generates artifacts based on natural language prompts.

- **Artifacts**: Reports, Whiteboards, Plans, UI Pages.
- **Workflow**: Prompt -> Planning -> Configuration -> Validation -> Rendering.
- **Streaming**: Real-time feedback of the AI's "thinking" process.

### Planner

Long-term periodization and development planning tools.

## 7. Development Workflow

- **Dev Server**: `npm run dev`
- **Database Studio**: `npx prisma studio`
- **Linting**: `npm run lint`
- **Testing**: `npm run test` (Vitest), `npm run test:e2e` (Playwright)
