# Documentation Index

This directory is organized for **agent-first retrieval**: concise, current, and low-noise.

## Start Here

- **Agent contributors:** `docs/AGENT_START.md`
- **Documentation policy:** `docs/DOCUMENTATION_STRATEGY.md`

## 📁 Directory Structure

### `/architecture`
Canonical architecture docs and design decisions.

### `/setup`
Environment and local setup guides.

### `/features`
Current feature behavior/specs (avoid dated "fix summary" style docs here).

### `/deployment`
Operational runbooks for deployment and production troubleshooting.

### `/testing`
Testing playbooks, reports, and checklists.

### `/archive/history`
Historical snapshots retained for reference only (handover notes, one-off assessments, PR artifacts).

## Doc Classes

- `canonical` — current implementation truth
- `runbook` — operational procedures
- `adr` — architecture decisions and tradeoffs
- `historical` — dated narratives/snapshots

See `docs/DOCUMENTATION_STRATEGY.md` for classification and retention policy.

## Contribution Standards

When creating/updating documentation:

1. Start with a TL;DR section.
2. Keep scope explicit and narrow.
3. Link to source files instead of pasting long code.
4. Move time-bound reports to `docs/archive/history` or wiki.
5. Update at least one canonical doc when behavior changes.
