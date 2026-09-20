# Documentation Strategy (Agent-First)

## Goals

1. Keep repository docs small, current, and high-signal for coding agents.
2. Move time-bound narratives (handover/fix/status reports) out of core paths.
3. Preserve important history without polluting default retrieval context.

## Documentation Classes

### 1) Canonical
Current implementation truth: architecture, setup, feature behavior, constraints.

- Location: `docs/architecture`, `docs/setup`, selected files in `docs/features`
- Retention: indefinite
- Quality bar: must be kept in sync with code

### 2) Runbook
Operational instructions for deployment, migration, and troubleshooting.

- Location: `docs/deployment` and selected `docs/setup`
- Retention: indefinite, reviewed per release

### 3) ADR (Architecture Decision Record)
Decision history with context/alternatives/consequences.

- Proposed location: `docs/architecture/adr/`
- Retention: indefinite

### 4) Historical
Dated fix summaries, handovers, PR descriptions, one-off assessments.

- Location: `docs/archive/history/` or external wiki
- Retention: optional in repo; prefer wiki for long narratives

## Repository Policy

- Keep only canonical/runbook/ADR docs in primary paths.
- Move dated snapshots to `docs/archive/history/` (or wiki) within 1 release cycle.
- New docs must start with a TL;DR section and link to deeper references.

## Proposed Information Architecture

- `docs/AGENT_START.md` — short entrypoint for agent contributors
- `docs/architecture/` — architecture + ADRs
- `docs/setup/` — local and environment setup
- `docs/features/` — current behavior/specs (no "fixed" narratives)
- `docs/deployment/` — production runbooks
- `docs/testing/` — test playbooks/checklists
- `docs/archive/history/` — historical snapshots

## Initial Classification (Phase 1)

### Keep as canonical/runbook

- `docs/architecture/AI_CODING_GUIDE.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/setup/QUICK_SETUP.md`
- `docs/testing/ai-testing-playbook.md`

### Moved to historical (or wiki) — done September 2026

The dated reports that sat in `docs/` root and in the root of the repository now live in `docs/archive/history/`: `HANDOVER.md`, `REPORTS_LOADING_FIX.md`, `REPORTS_LOADING_UX_FIX.md`, `PERFORMANCE_AUDIT_REPORT.md`, `PERFORMANCE_IMPROVEMENTS_IMPLEMENTED.md`, the `REPORTS_*` reports, `TRANSLATION_ISSUES_FOUND.md`, `CHAMPIONSHIP_DATA_SEEDED.md`, `QUICK_START_TESTING_REPORTS.md`, and the root `QUICK_START.md`.

### Still to review for consolidation

- Feature quickstarts named `*QUICKSTART*.md` should be merged into durable feature docs when possible

## Authoring Standards

Every new canonical doc should include:

- `## TL;DR`
- `## Scope`
- `## Source of truth`
- `## Last verified` (date)

Keep examples minimal; link to source files rather than pasting long code blocks.
