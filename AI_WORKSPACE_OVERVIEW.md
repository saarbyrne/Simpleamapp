# AI Workspace - Project Overview

## What is AI Workspace?

AI Workspace is an intelligent artifact generation system that allows users to create sports analytics reports, tactical whiteboards, training plans, and UI pages through natural language prompts. The system uses Claude AI with extended thinking capabilities to generate structured, validated outputs.

## Core Concept

Users describe what they want in plain English, and the AI generates a complete, interactive artifact with visualizations, data, and insights. The system combines conversational AI with structured data inputs to create high-quality, validated outputs.

## Key Features

### 1. Multi-Artifact Support
- **Reports**: Data visualizations with KPIs, charts, and analytics
- **Whiteboards**: Tactical diagrams for sports coaching
- **Plans**: Training and competition schedules
- **UI Pages**: Custom dashboard layouts

### 2. Intelligent Prompt Enhancement
- AI analyzes user prompts and suggests specific criteria (time periods, metrics, visualization types)
- Users can select suggested tags to refine their request
- Tags are converted into structured inputs for better generation quality

### 3. Multi-Step Agentic Generation
The system uses a two-phase approach:
- **Planning Phase**: AI analyzes requirements and plans the structure
- **Configuration Phase**: AI generates validated JSON configuration
- **Validation**: Strict rules ensure output quality before rendering

### 4. Real-Time Streaming
- Server-Sent Events provide live progress updates
- Shows AI "thinking" process for transparency
- Progress indicators for each generation step

### 5. Flexible Input System
- **Free Text**: Natural language descriptions
- **Filters Panel**: Structured inputs for precise control (time periods, player selection, metrics)
- **Hybrid Approach**: Combines both for optimal results

## Architecture

### Frontend Components

```
InitialPromptScreen
├─ Artifact type selection (reports, whiteboards, plans, UI pages)
├─ Natural language prompt input
├─ AI-suggested tags for enhancement
└─ Workspace creation

WorkspaceCanvas (Three-Panel Layout)
├─ Left: Conversation Panel
│   ├─ Message history
│   ├─ AI thinking display
│   ├─ Progress indicators
│   └─ Message input
├─ Center: Canvas Preview
│   └─ Live artifact rendering
└─ Right: Filters Panel (collapsible)
    ├─ Structured input controls
    └─ Apply filters button
```

### Backend Architecture

```
API Routes
├─ /api/ai-workspace/suggest-enhancements
│   └─ Analyzes prompts, returns suggested tags
├─ /api/ai-workspace/generate-agentic
│   └─ Multi-step generation with validation
└─ Server Actions
    ├─ createAIWorkspace()
    ├─ getAIWorkspace()
    ├─ updateAIWorkspace()
    └─ addAIWorkspaceMessage()

AI Agents
├─ BaseAgent (shared functionality)
└─ ReportAgent (specialized for reports)
    ├─ Planning step
    ├─ Configuration step
    └─ Validation step
```

### Data Model

```typescript
AIWorkspace
├─ id: string
├─ userId: string
├─ artifactType: 'reports' | 'whiteboards' | 'plans' | 'uiPages'
├─ status: 'draft' | 'generating' | 'ready' | 'error'
├─ initialPrompt: string
├─ artifactData: JSON (generated configuration)
├─ messages: AIWorkspaceMessage[]
└─ timestamps
```

## How It Works

### User Journey

1. **Initial Screen**
   - User selects artifact type (optional)
   - User enters natural language prompt
   - AI suggests enhancement tags
   - User selects relevant tags (optional)
   - User clicks "Create Workspace"

2. **Generation Phase**
   - Workspace created in database
   - User navigated to canvas view
   - Auto-generation starts immediately
   - AI streams thinking process
   - Progress updates shown in real-time

3. **Result Phase**
   - Validation checks quality
   - Artifact renders in canvas
   - User can iterate with follow-up prompts
   - User can apply structured filters for refinement

### AI Generation Flow

```
User Prompt
    ↓
Extended Thinking (10,000 tokens)
    ↓
Planning Step
    ↓
Configuration Step
    ↓
Validation (9 rules)
    ↓
Success? → Render Artifact
    ↓ No
Error Message → User can retry
```

## Report Generation Specifics

### Validation Rules
1. Clear, descriptive title
2. Valid time period (last7Days, last30Days, last90Days, custom)
3. 1-3 visualizations maximum
4. Each chart has type, title, and series
5. Chart types: line, bar, area, pie, or table
6. Each KPI has label, value, and format
7. KPI labels are descriptive
8. No duplicate chart titles
9. Multiple charts use different types

### Report Configuration Structure

```json
{
  "title": "Team Wellness Analysis - Last 7 Days",
  "timePeriod": "last7Days",
  "players": ["all"],
  "metrics": ["wellness", "trainingLoad", "recovery"],
  "charts": [
    {
      "type": "line",
      "title": "Wellness Trend Over Time",
      "xAxis": "date",
      "yAxis": "score",
      "series": ["wellness", "fatigue"]
    },
    {
      "type": "bar",
      "title": "Player Training Load Comparison",
      "xAxis": "player",
      "yAxis": "load",
      "series": ["trainingLoad"]
    }
  ],
  "kpis": [
    {
      "label": "Average Wellness Score",
      "value": "7.2",
      "format": "number",
      "trend": "up",
      "description": "Team average wellness for the period"
    }
  ]
}
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks (useState, useRef, useEffect)
- **Routing**: Next.js navigation with server/client components

### Backend
- **Runtime**: Node.js
- **API**: Next.js API routes with streaming support
- **Database**: PostgreSQL via Prisma ORM
- **AI Provider**: Anthropic Claude API
- **Model**: Claude Sonnet 4.5 with Extended Thinking

### Key Libraries
- `@anthropic-ai/sdk` - Claude API integration
- `recharts` - Data visualization
- `next-intl` - Internationalization
- `sonner` - Toast notifications
- `zod` - Schema validation (for future typing)

## System Prompts

The AI uses carefully crafted system prompts that include:
- Role definition (sports analytics expert)
- Critical requirements (exact constraints)
- Examples (good vs bad configurations)
- Output format specification (JSON schema)
- Validation guidelines

## Performance Characteristics

- **Initial Prompt Analysis**: 1-2 seconds
- **Full Report Generation**: 10-30 seconds (depending on complexity)
- **Thinking Budget**: 10,000 tokens for complex reasoning
- **Streaming Latency**: Real-time (SSE with minimal buffering)
- **Validation Overhead**: < 100ms

## Future Capabilities

### Planned Enhancements
- Real data integration (connect to player databases)
- Multi-user collaboration
- Report templates and presets
- Export to PDF/PNG
- Version history and rollback
- Advanced filtering with saved configurations

### Extensibility
The architecture supports:
- New artifact types (easily add new agents)
- Custom validation rules per type
- Additional AI providers
- Plugin system for custom visualizations
- Webhook integrations

## Security & Privacy

- User workspaces are isolated by userId
- AI prompts are not logged beyond session
- No PII sent to AI unless explicitly in prompt
- Database access controlled by Prisma middleware
- API routes protected by authentication

## Deployment

- **Environment**: Vercel (recommended) or any Node.js host
- **Database**: PostgreSQL (Neon, Supabase, or self-hosted)
- **AI API Key**: Anthropic Claude API key required
- **Environment Variables**:
  - `ANTHROPIC_API_KEY`
  - `DATABASE_URL`
  - `DIRECT_URL` (for Prisma migrations)

## Development Workflow

1. User enters prompt → Suggestion API called
2. User creates workspace → Server action saves to DB
3. Canvas loads → Auto-generation triggered
4. Agent executes → Streams progress via SSE
5. Validation runs → Either success or error
6. Artifact renders → User sees result in real-time

## Key Design Decisions

### Why Three-Panel Layout?
Separates concerns: conversation history (left), preview (center), controls (right). Users can focus on one area while referencing others.

### Why Server-Sent Events?
Provides real-time streaming without WebSocket complexity. Works well with serverless environments.

### Why Multi-Step Generation?
Allows AI to think deeply before committing to a structure. Reduces errors and improves output quality.

### Why Extended Thinking?
Complex reports require reasoning about data relationships, chart types, and narrative structure. Extended thinking provides that capacity.

### Why Validation Layer?
Ensures consistent, high-quality outputs. Catches common AI mistakes before they reach the user.

## Success Metrics

A good AI Workspace experience means:
- ✅ Tags appear on initial screen (before canvas)
- ✅ Generation starts automatically after workspace creation
- ✅ Thinking process visible in real-time
- ✅ Validation catches errors before rendering
- ✅ Reports have 1-3 varied chart types
- ✅ KPIs are meaningful and specific
- ✅ User can refine with filters or follow-up prompts

## Limitations

- Currently shows sample/mock data (no real player data integration)
- Reports only support predefined chart types
- No collaborative editing yet
- Single AI provider (Anthropic only)
- English language only (internationalization partial)

## Summary

AI Workspace is a production-ready system for generating sports analytics artifacts through conversational AI. It combines natural language understanding, structured data inputs, multi-step reasoning, and strict validation to produce high-quality, interactive outputs. The architecture is modular, extensible, and designed for both user experience and developer maintainability.



## Possible structure
Use a supervisor agent: Design a supervisor agent to handle the overall goal and delegate tasks to specialized sub-agents, ensuring each sub-agent focuses on a single, specific responsibility.
Decompose tasks: Break down high-level goals into smaller, manageable tasks. For example, instead of one request for a whole document, assign tasks like "create outline," "research market conditions," and "refine the plan" to different agents.
Establish clear communication: Ensure the supervisor agent checks the work after each sub-agent completes its task and that there is clear communication about what each agent is doing.
Persist intermediate artifacts: Store raw research, summaries, and final outputs to allow for auditing, debugging, and reusing data.
Use parallel execution: Identify independent tasks and run them simultaneously to improve performance. For example, launch 5-10 independent agents in parallel. 