# AI Workspace: Technical Infrastructure

> Codebase, Database, and Agent Knowledge Documentation for SAM-41

This document defines the technical infrastructure required for AI Workspace's multi-agent system to perform optimally. It covers three critical areas:

1. **Codebase structure** - how code should be organised for agent access
2. **Database design** - what context data agents need
3. **Agent knowledge files** - domain documentation that dramatically improves accuracy

---

## 1. Codebase Structure

Agents perform better when they have access to structured type definitions, enums, and schemas. This tells them what's *possible* in your system—what metrics exist, what chart types are supported, what user roles mean.

### 1.1 Recommended Directory Structure

```
lib/
├── ai-workspace/
│   ├── types.ts                    # Core TypeScript interfaces
│   ├── constants.ts                # Enums, allowed values
│   ├── context.ts                  # getOrgContext() function
│   ├── prompt-enhancement.ts       # Orchestrator function
│   ├── agents/
│   │   ├── intent-classifier.ts    # Haiku agent
│   │   ├── entity-extractor.ts     # Haiku agent
│   │   └── prompt-enhancer.ts      # Sonnet agent
│   ├── knowledge/                  # Agent knowledge files
│   │   ├── domain-glossary.json    # Sports/medical terms
│   │   ├── entity-catalog.json     # Metrics, chart types, etc.
│   │   ├── examples.json           # Few-shot examples
│   │   └── org-schema.json         # Org context structure
│   └── prompts/                    # System prompts (version controlled)
│       ├── intent-classifier.txt
│       ├── entity-extractor.txt
│       └── prompt-enhancer.txt
```

### 1.2 Core Type Definitions

Create a single source of truth for all types. Agents will reference these to understand what values are valid.

#### `types.ts`

```typescript
// Artifact types the system can generate
export type ArtifactType = 'report' | 'tactics' | 'uiPage' | 'plan';

// All metrics available in the system
export type MetricKey = 
  | 'rpe'              // Rate of Perceived Exertion (1-10)
  | 'wellness_score'   // Composite wellness (0-100)
  | 'sleep_quality'    // Sleep rating (1-5)
  | 'mood'             // Mood score (1-10)
  | 'stress'           // Stress level (1-10)
  | 'load'             // Training load (AU)
  | 'fatigue'          // Fatigue index (1-10)
  | 'soreness'         // Muscle soreness (1-10)
  | 'hrv'              // Heart rate variability (ms)
  | 'sleep_duration';  // Hours slept

// Visualisation options
export type ChartType = 'bar' | 'line' | 'pie' | 'heatmap' | 'table' | 'scatter';

// Time period presets
export type TimePeriod = 
  | 'last_7_days' | 'last_14_days' | 'last_30_days'
  | 'this_week' | 'last_week' | 'this_month' | 'last_month'
  | 'this_season' | 'custom';

// Position groups in football/soccer
export type PositionGroup = 
  | 'goalkeepers' | 'defenders' | 'midfielders' | 'forwards' | 'all';

// User roles in the organisation
export type UserRole = 
  | 'head_coach' | 'assistant_coach' | 'goalkeeper_coach' | 'fitness_coach'
  | 'head_of_performance' | 'sports_scientist' | 'analyst'
  | 'physio' | 'doctor' | 'nutritionist' | 'psychologist'
  | 'manager' | 'director' | 'admin';
```

#### `constants.ts`

```typescript
import { MetricKey } from './types';

// Human-readable labels for metrics
export const METRIC_LABELS: Record<MetricKey, string> = {
  rpe: 'Rate of Perceived Exertion',
  wellness_score: 'Wellness Score',
  sleep_quality: 'Sleep Quality',
  mood: 'Mood',
  stress: 'Stress Level',
  load: 'Training Load',
  fatigue: 'Fatigue',
  soreness: 'Muscle Soreness',
  hrv: 'Heart Rate Variability',
  sleep_duration: 'Sleep Duration'
};

// Semantic mappings: user terms → system metrics
export const SEMANTIC_METRIC_MAP: Record<string, MetricKey[]> = {
  'mental': ['rpe', 'mood', 'stress', 'wellness_score'],
  'physical': ['load', 'fatigue', 'soreness', 'hrv'],
  'recovery': ['sleep_quality', 'sleep_duration', 'hrv', 'fatigue'],
  'readiness': ['wellness_score', 'fatigue', 'soreness', 'sleep_quality'],
  'fitness': ['load', 'hrv'],
  'wellbeing': ['wellness_score', 'mood', 'stress']
};

// Role abbreviations for display
export const ROLE_ABBREVIATIONS: Record<string, string> = {
  head_of_performance: 'HOP',
  sports_scientist: 'SS',
  head_coach: 'HC',
  assistant_coach: 'AC',
  fitness_coach: 'FC',
  physio: 'PT',
  doctor: 'MD',
  analyst: 'AN'
};
```

---

## 2. Database Structure

The Entity Extractor agent needs queryable context about the user's organisation. This includes: who the user reports to, what data sources are available, player rosters, and historical patterns.

### 2.1 Organisation Context Tables

#### `users` table

| Column | Type | Purpose for Agents |
|--------|------|-------------------|
| `id` | uuid | Unique identifier for referencing |
| `name` | string | Display in enhanced prompt |
| `email` | string | For user lookup |
| `role` | enum | Resolve 'my boss', 'medical team', etc. |
| `reports_to` | uuid (FK) | **Critical for resolving 'my boss'** |
| `role_abbreviation` | string | For display: 'John Jones (HOP)' |
| `org_id` | uuid (FK) | Organisation reference |

**Role enum values:**

```
head_coach | assistant_coach | goalkeeper_coach | fitness_coach |
head_of_performance | sports_scientist | analyst |
physio | doctor | nutritionist | psychologist |
manager | director | admin
```

#### `org_data_sources` table

Tracks which data sources each organisation has access to. Agents need this to know what data can be queried.

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `org_id` | uuid (FK) | Organisation reference |
| `source_type` | enum | wellness \| gps \| medical \| match_stats \| video |
| `available_metrics` | string[] | Which metrics this source provides |
| `is_active` | boolean | Only show active sources to agents |

#### `players` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `name` | string | Player name |
| `position` | string | GK, CB, CM, ST, etc. |
| `position_group` | enum | goalkeepers \| defenders \| midfielders \| forwards |
| `squad_number` | integer | Jersey number |
| `org_id` | uuid (FK) | Organisation reference |

### 2.2 Context Query Function

Create a single function that fetches all context an agent needs. This gets injected into system prompts.

```typescript
// lib/ai-workspace/context.ts

import { db } from '@/lib/db';

export interface OrgContext {
  currentUser: {
    id: string;
    name: string;
    role: string;
    boss: {
      id: string;
      name: string;
      role: string;
      displayName: string;
    } | null;
  };
  colleagues: Array<{
    id: string;
    name: string;
    role: string;
    displayName: string;
  }>;
  availableMetrics: string[];
  dataSources: string[];
  players: Array<{
    id: string;
    name: string;
    position: string;
    positionGroup: string;
  }>;
  positionGroups: string[];
}

export async function getOrgContext(orgId: string, userId: string): Promise<OrgContext> {
  const [currentUser, colleagues, dataSources, players] = await Promise.all([
    db.users.findUnique({ 
      where: { id: userId }, 
      include: { reportsTo: true } 
    }),
    db.users.findMany({ 
      where: { orgId }, 
      select: { id: true, name: true, role: true, roleAbbreviation: true } 
    }),
    db.orgDataSources.findMany({ 
      where: { orgId, isActive: true } 
    }),
    db.players.findMany({ 
      where: { orgId }, 
      select: { id: true, name: true, position: true, positionGroup: true } 
    })
  ]);

  return {
    currentUser: {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
      boss: currentUser.reportsTo ? {
        id: currentUser.reportsTo.id,
        name: currentUser.reportsTo.name,
        role: currentUser.reportsTo.role,
        displayName: `${currentUser.reportsTo.name} (${currentUser.reportsTo.roleAbbreviation})`
      } : null
    },
    colleagues: colleagues.map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      displayName: `${u.name} (${u.roleAbbreviation})`
    })),
    availableMetrics: [...new Set(dataSources.flatMap(ds => ds.availableMetrics))],
    dataSources: dataSources.map(ds => ds.sourceType),
    players: players,
    positionGroups: ['goalkeepers', 'defenders', 'midfielders', 'forwards']
  };
}
```

---

## 3. Agent Knowledge Files

This is the most impactful section. Knowledge files are pre-computed documentation that gets injected into agent system prompts. They dramatically improve accuracy and reduce hallucination by giving agents explicit domain knowledge.

### 3.1 Domain Glossary

Maps user terminology to system concepts. The Entity Extractor uses this to understand what users mean.

**File: `lib/ai-workspace/knowledge/domain-glossary.json`**

```json
{
  "mental_health_terms": {
    "mentally": ["rpe", "mood", "stress", "wellness_score"],
    "psychologically": ["mood", "stress"],
    "stressed": ["stress"],
    "anxious": ["stress", "mood"],
    "tired": ["fatigue", "sleep_quality", "rpe"],
    "exhausted": ["fatigue", "rpe", "load"],
    "fresh": ["wellness_score", "fatigue"],
    "sharp": ["wellness_score", "mood"]
  },
  "physical_terms": {
    "fitness": ["load", "hrv"],
    "physically": ["load", "soreness", "fatigue"],
    "sore": ["soreness"],
    "injured": ["medical_status"],
    "recovering": ["fatigue", "soreness", "sleep_quality"],
    "match fit": ["wellness_score", "load", "fatigue"]
  },
  "time_expressions": {
    "recently": "last_7_days",
    "lately": "last_14_days",
    "this week": "this_week",
    "last week": "last_week",
    "this month": "this_month",
    "last month": "last_month",
    "season": "this_season",
    "past few days": "last_7_days"
  },
  "role_synonyms": {
    "boss": "reports_to",
    "manager": "head_coach",
    "gaffer": "head_coach",
    "physio": "physio",
    "doc": "doctor",
    "strength guy": "fitness_coach",
    "performance team": ["head_of_performance", "sports_scientist", "analyst"],
    "medical team": ["physio", "doctor", "nutritionist"]
  },
  "player_groups": {
    "defenders": "defenders",
    "back line": "defenders",
    "midfielders": "midfielders",
    "midfield": "midfielders",
    "attackers": "forwards",
    "forwards": "forwards",
    "front line": "forwards",
    "keepers": "goalkeepers",
    "goalkeepers": "goalkeepers"
  }
}
```

### 3.2 Entity Catalog

Complete reference of all entities the system understands. Agents use this to validate and suggest alternatives.

**File: `lib/ai-workspace/knowledge/entity-catalog.json`**

```json
{
  "metrics": {
    "rpe": {
      "name": "Rate of Perceived Exertion",
      "abbreviation": "RPE",
      "range": "1-10",
      "category": "subjective",
      "description": "Player-reported training difficulty",
      "related": ["load", "fatigue"],
      "good_for": ["training_load_monitoring", "mental_state", "session_intensity"]
    },
    "wellness_score": {
      "name": "Wellness Score",
      "range": "0-100",
      "category": "composite",
      "description": "Combined score from multiple wellness inputs",
      "components": ["sleep", "stress", "fatigue", "soreness", "mood"],
      "good_for": ["readiness", "recovery_monitoring", "executive_reports"]
    },
    "load": {
      "name": "Training Load",
      "abbreviation": "TL",
      "unit": "AU (arbitrary units)",
      "category": "objective",
      "description": "Accumulated training stress from GPS/HR data",
      "related": ["rpe", "fatigue"],
      "good_for": ["periodisation", "load_management", "injury_prevention"]
    },
    "hrv": {
      "name": "Heart Rate Variability",
      "abbreviation": "HRV",
      "unit": "ms",
      "category": "objective",
      "description": "Measure of autonomic nervous system recovery",
      "good_for": ["recovery_status", "readiness", "overtraining_detection"]
    },
    "sleep_quality": {
      "name": "Sleep Quality",
      "range": "1-5",
      "category": "subjective",
      "description": "Player-reported sleep rating",
      "good_for": ["recovery", "wellness_tracking"]
    },
    "fatigue": {
      "name": "Fatigue",
      "range": "1-10",
      "category": "subjective",
      "description": "Player-reported tiredness level",
      "related": ["load", "sleep_quality", "rpe"],
      "good_for": ["recovery_monitoring", "load_adjustment"]
    },
    "soreness": {
      "name": "Muscle Soreness",
      "range": "1-10",
      "category": "subjective",
      "description": "Player-reported muscle pain/discomfort",
      "good_for": ["injury_prevention", "recovery_monitoring"]
    },
    "mood": {
      "name": "Mood",
      "range": "1-10",
      "category": "subjective",
      "description": "Player-reported emotional state",
      "good_for": ["mental_health_monitoring", "team_atmosphere"]
    },
    "stress": {
      "name": "Stress Level",
      "range": "1-10",
      "category": "subjective",
      "description": "Player-reported stress/anxiety",
      "good_for": ["mental_health_monitoring", "workload_management"]
    }
  },
  "chart_types": {
    "bar": {
      "best_for": ["comparing_players", "comparing_periods", "single_metric", "categorical_data"],
      "avoid_for": ["time_series", "correlations"],
      "example_use": "Compare RPE across position groups"
    },
    "line": {
      "best_for": ["trends_over_time", "multiple_metrics", "individual_player_tracking"],
      "avoid_for": ["comparing_many_players", "categorical_data"],
      "example_use": "Track wellness score over the past month"
    },
    "heatmap": {
      "best_for": ["squad_overview", "weekly_patterns", "position_group_comparison", "multi_dimensional"],
      "avoid_for": ["single_player", "precise_values"],
      "example_use": "Squad wellness overview for the week"
    },
    "table": {
      "best_for": ["detailed_data", "exact_values", "multiple_attributes", "exports"],
      "avoid_for": ["quick_insights", "presentations"],
      "example_use": "Full wellness data for all players"
    },
    "scatter": {
      "best_for": ["correlations", "relationships_between_metrics"],
      "avoid_for": ["time_series", "categorical_data"],
      "example_use": "Load vs fatigue relationship"
    }
  },
  "artifact_templates": {
    "report": {
      "typical_components": ["kpi_cards", "charts", "summary_text", "recommendations"],
      "audiences": ["executive", "coaching_staff", "medical_team", "players"],
      "default_metrics": ["wellness_score", "load", "fatigue"],
      "common_requests": [
        "Weekly wellness report",
        "Match readiness assessment",
        "Training load summary",
        "Recovery status report"
      ]
    },
    "tactics": {
      "typical_components": ["pitch_diagram", "player_positions", "movement_arrows", "notes"],
      "formations": ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "3-4-3", "5-3-2"],
      "common_requests": [
        "Set piece diagrams",
        "Pressing triggers",
        "Build-up patterns",
        "Defensive shape"
      ]
    },
    "plan": {
      "typical_components": ["calendar_view", "session_blocks", "load_targets", "recovery_windows"],
      "timeframes": ["daily", "weekly", "microcycle", "mesocycle"],
      "common_requests": [
        "Weekly training plan",
        "Match week periodisation",
        "Recovery protocol",
        "Pre-season plan"
      ]
    },
    "uiPage": {
      "typical_components": ["data_inputs", "visualisations", "filters", "actions"],
      "page_types": ["dashboard", "data_entry", "player_profile", "comparison_view"],
      "common_requests": [
        "Player wellness input form",
        "Squad dashboard",
        "Individual player profile",
        "Match day checklist"
      ]
    }
  }
}
```

### 3.3 Few-Shot Examples

Critical for agent accuracy. Provide 3-5 examples of ideal input→output pairs for each agent.

**File: `lib/ai-workspace/knowledge/examples.json`**

```json
{
  "intent_classification": [
    {
      "input": "Show me how the squad is recovering after the match",
      "output": {
        "artifactType": "report",
        "confidence": 0.9,
        "reasoning": "Asking about recovery data implies analytical output"
      }
    },
    {
      "input": "I need to plan our pressing triggers for Saturday",
      "output": {
        "artifactType": "tactics",
        "confidence": 0.95,
        "reasoning": "Pressing triggers are tactical concepts, likely needs pitch diagram"
      }
    },
    {
      "input": "Build me a dashboard where players can log their wellness",
      "output": {
        "artifactType": "uiPage",
        "confidence": 0.9,
        "reasoning": "Explicitly asks for a page/interface for data entry"
      }
    },
    {
      "input": "Map out next week's training based on the match schedule",
      "output": {
        "artifactType": "plan",
        "confidence": 0.85,
        "reasoning": "Training schedule is a temporal plan"
      }
    },
    {
      "input": "Compare the midfielders' load this week",
      "output": {
        "artifactType": "report",
        "confidence": 0.9,
        "reasoning": "Comparing data across players is analytical"
      }
    }
  ],
  "entity_extraction": [
    {
      "input": "Report for my boss on mental state",
      "context_note": "User reports to John Jones (Head of Performance)",
      "entities": [
        {
          "key": "recipient",
          "originalText": "my boss",
          "resolvedValue": { "lookup": "reports_to" },
          "displayText": "John Jones (HOP)",
          "confidence": 0.95,
          "alternatives": [
            { "displayText": "Coaching Staff", "value": { "group": "coaches" } }
          ]
        },
        {
          "key": "metric",
          "originalText": "mental state",
          "resolvedValue": ["rpe", "mood", "stress"],
          "displayText": "RPE, Mood, and Stress",
          "confidence": 0.8,
          "alternatives": ["wellness_score"]
        }
      ]
    },
    {
      "input": "How did the midfielders do physically last week?",
      "entities": [
        {
          "key": "playerGroup",
          "originalText": "midfielders",
          "resolvedValue": "position:midfielders",
          "displayText": "Midfielders",
          "confidence": 0.95
        },
        {
          "key": "metric",
          "originalText": "physically",
          "resolvedValue": ["load", "soreness", "fatigue"],
          "displayText": "Load, Soreness, and Fatigue",
          "confidence": 0.85
        },
        {
          "key": "timeRange",
          "originalText": "last week",
          "resolvedValue": "last_week",
          "displayText": "Last Week",
          "confidence": 0.95
        }
      ]
    },
    {
      "input": "I want to see recovery trends for the whole squad",
      "entities": [
        {
          "key": "metric",
          "originalText": "recovery",
          "resolvedValue": ["sleep_quality", "fatigue", "soreness", "hrv"],
          "displayText": "Recovery metrics (Sleep, Fatigue, Soreness, HRV)",
          "confidence": 0.85
        },
        {
          "key": "playerGroup",
          "originalText": "whole squad",
          "resolvedValue": "all",
          "displayText": "All Players",
          "confidence": 0.95
        },
        {
          "key": "visualisation",
          "originalText": "trends",
          "resolvedValue": "line",
          "displayText": "Line Chart",
          "confidence": 0.8
        }
      ]
    }
  ],
  "prompt_enhancement": [
    {
      "input": "Report on mental state",
      "classification": { "artifactType": "report" },
      "entities": [{ "key": "metric", "value": ["rpe", "mood"] }],
      "output": {
        "enhancedPrompt": "Create a report showing player mental state using {metrics} for {timeRange}, visualised as {chartType}.",
        "variables": [
          {
            "key": "metrics",
            "displayText": "RPE and Mood scores",
            "value": ["rpe", "mood"],
            "source": "inferred",
            "removable": true
          },
          {
            "key": "timeRange",
            "displayText": "the past 7 days",
            "value": "last_7_days",
            "source": "default",
            "removable": true
          },
          {
            "key": "chartType",
            "displayText": "a line chart",
            "value": "line",
            "source": "inferred",
            "removable": true
          }
        ],
        "suggestions": [
          { "label": "Compare to last month", "category": "comparison" },
          { "label": "Split by position group", "category": "scope" },
          { "label": "Add wellness score", "category": "metric" }
        ]
      }
    }
  ]
}
```

### 3.4 Injecting Knowledge into Prompts

Load knowledge files at startup and inject into system prompts. This is where everything comes together.

```typescript
// lib/ai-workspace/agents/entity-extractor.ts

import domainGlossary from '../knowledge/domain-glossary.json';
import entityCatalog from '../knowledge/entity-catalog.json';
import examples from '../knowledge/examples.json';
import { OrgContext } from '../context';

export function buildEntityExtractorPrompt(orgContext: OrgContext): string {
  return `
You are an entity extractor for SimpleAM, a sports management platform.

## Domain Knowledge
Use this glossary to map user terms to system concepts:
${JSON.stringify(domainGlossary, null, 2)}

## Available Metrics
${JSON.stringify(entityCatalog.metrics, null, 2)}

## Organisation Context
${JSON.stringify(orgContext, null, 2)}

## Examples
Here are examples of correct entity extraction:
${JSON.stringify(examples.entity_extraction, null, 2)}

## Output Format
Respond with ONLY a JSON object matching this structure:
{
  "entities": [
    {
      "key": "string",
      "originalText": "string",
      "resolvedValue": any,
      "displayText": "string",
      "confidence": 0.0-1.0,
      "alternatives": []
    }
  ]
}
`.trim();
}
```

---

## 4. Performance Optimisation

### 4.1 Caching Strategy

| Data | Cache Duration | Invalidation Trigger |
|------|---------------|---------------------|
| Organisation context | 5 minutes | User or roster change |
| Knowledge files | Until deploy | Code deployment |
| Player roster | 1 hour | Roster mutation |
| System prompts | Until deploy | Prompt file change |

### 4.2 Prompt Size Management

Knowledge files can get large. Use these strategies to keep prompts efficient:

1. **Lazy loading**: Only inject relevant glossary sections based on detected terms in user input
2. **Tiered examples**: Start with 2 examples, expand to 5 if first attempt has low confidence
3. **Context windowing**: Only include players/colleagues likely relevant (same team, same department)
4. **Compression**: Remove whitespace from JSON in production prompts

```typescript
// Example: Lazy loading relevant glossary sections
function getRelevantGlossary(userPrompt: string): Partial<typeof domainGlossary> {
  const prompt = userPrompt.toLowerCase();
  const relevant: any = {};
  
  if (prompt.match(/mental|stress|mood|anxious|tired/)) {
    relevant.mental_health_terms = domainGlossary.mental_health_terms;
  }
  if (prompt.match(/physical|sore|fitness|load/)) {
    relevant.physical_terms = domainGlossary.physical_terms;
  }
  if (prompt.match(/week|month|recent|lately/)) {
    relevant.time_expressions = domainGlossary.time_expressions;
  }
  
  return relevant;
}
```

---

## 5. Implementation Checklist

### 5.1 Codebase Setup

- [ ] Create `lib/ai-workspace/types.ts` with all type definitions
- [ ] Create `lib/ai-workspace/constants.ts` with enums and mappings
- [ ] Create `lib/ai-workspace/context.ts` with `getOrgContext()` function
- [ ] Set up `lib/ai-workspace/agents/` directory structure
- [ ] Create `lib/ai-workspace/knowledge/` directory for JSON files
- [ ] Set up `lib/ai-workspace/prompts/` for version-controlled system prompts

### 5.2 Database Setup

- [ ] Add `reports_to` column to users table (FK to users.id)
- [ ] Add `role_abbreviation` column to users table
- [ ] Create `org_data_sources` table
- [ ] Populate role enum with all staff roles
- [ ] Create indexes on `org_id` and `reports_to` for performance
- [ ] Add caching layer for context queries (Redis or in-memory)

### 5.3 Knowledge Files

- [ ] Create `domain-glossary.json` with sports/medical terminology
- [ ] Create `entity-catalog.json` with all metrics, chart types, artifact templates
- [ ] Create `examples.json` with 3-5 examples per agent
- [ ] Create system prompt files for each agent
- [ ] Test prompts with real user inputs, iterate on examples

### 5.4 Testing

- [ ] Unit tests for `getOrgContext()` function
- [ ] Integration tests for each agent with mocked responses
- [ ] End-to-end test for full prompt enhancement flow
- [ ] Performance benchmark: target <2.5s total latency
- [ ] Accuracy testing with 20+ real user prompts

---

## 6. Monitoring & Iteration

### 6.1 Metrics to Track

| Metric | Target | Action if Missed |
|--------|--------|-----------------|
| Total latency | <2.5s | Check Haiku parallelisation, reduce prompt size |
| Intent classification accuracy | >90% | Add more examples, refine artifact type definitions |
| Entity extraction accuracy | >85% | Expand glossary, add edge case examples |
| User acceptance rate | >70% | Review rejected prompts, improve suggestions |

### 6.2 Feedback Loop

1. Log all prompts and agent outputs
2. Track when users click "Use Original" (rejection signal)
3. Track which variables users edit (inference quality signal)
4. Weekly review of low-confidence extractions
5. Monthly update of knowledge files based on patterns

---

## Related Resources

- **Linear Issue**: [SAM-41 - AI Workspace: Intent Capture Flow](https://linear.app/saar-byrne/issue/SAM-41)
- **Figma Design**: [Intent Capture Flow (node-id=147-1227)](https://www.figma.com/file/k8fg5qQFBfxT2Rr8ordnsy/simpleam.app?node-id=147-1227)
- **Shape of AI Patterns**: [shapeof.ai](https://www.shapeof.ai/)

---

*Document version 1.0 | November 2025*
