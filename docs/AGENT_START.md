# AGENT_START

Purpose: give coding agents the minimum reliable context to contribute safely without loading large historical documentation.

## 1) Read These First (in order)

1. `README.md` (root): project setup and scripts
2. `docs/architecture/AI_CODING_GUIDE.md`: codebase map and common implementation patterns
3. `docs/architecture/ARCHITECTURE.md`: system boundaries and core flows
4. `docs/setup/QUICK_SETUP.md`: shortest local DB setup path
5. `docs/testing/ai-testing-playbook.md`: test strategy for agent-led changes

If a file conflicts with source code, trust source code and open a docs fix PR.

## 2) Documentation Rules for Agents

- Prefer **canonical docs** over historical reports.
- Avoid loading files in `docs/archive/` unless explicitly needed for context.
- For any changed area, update one canonical doc in the same PR.
- Keep docs concise: TL;DR first, details linked.

## 3) Where to Find Things Quickly

- Routes and pages: `app/`
- Server actions: `app/actions/`
- Shared business logic: `lib/`
- UI components: `components/`
- Data model: `prisma/schema.prisma`

## 4) Canonical Doc Map

- Architecture: `docs/architecture/`
- Setup: `docs/setup/`
- Feature behavior/specs: `docs/features/`
- Deployment runbooks: `docs/deployment/`
- Testing playbooks and checklists: `docs/testing/`
- Documentation governance: `docs/DOCUMENTATION_STRATEGY.md`

## 5) Context Budget Defaults

When starting a task, load only:

- This file
- One architecture file
- One feature/runbook file relevant to the task

Expand context only after code inspection proves it is needed.

## 6) Doc Classes

- `canonical`: current source-of-truth docs for implementation
- `runbook`: operational procedures (deploy, migration, troubleshooting)
- `adr`: architecture decision records
- `historical`: snapshots, handovers, fixed-issue reports, PR drafts

See `docs/DOCUMENTATION_STRATEGY.md` for retention and migration policy.
