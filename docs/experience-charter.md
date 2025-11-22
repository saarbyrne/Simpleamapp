# Simpleam Experience Charter

## Purpose
Establish the non-negotiable user experiences that Simpleam must preserve as the product evolves. This charter guides automated scripts, AI-assisted testing, and designer-led manual checks.

## Personas
- **Creator:** configures automations and templates.
- **Collaborator:** reviews, edits, and approves shared content.
- **Viewer:** consumes published material or dashboards.

## Critical Journeys
1. **Create Automation:** sign in, create a new automation, configure trigger + action, save, and confirm success toast.
2. **Edit Automation:** open existing automation, adjust logic using drag-and-drop, validate preview updates, and save.
3. **Dashboard Insight:** load analytics dashboard, apply filters, and view refreshed charts without errors.
4. **Collaboration Workflow:** invite teammate, assign role, leave comment/annotation, and ensure notification delivered.
5. **Template Publish:** duplicate template, customize copy/media, preview, and publish publicly.
6. **Mobile Review:** open mobile viewport, review automation summary, toggle activation state, and confirm persisted.
7. **Theme Toggle:** switch between light/dark themes from any page with visuals updating cleanly.
8. **Notification Settings:** adjust personal notifications and confirm preference persists after refresh.
9. **Auth Session:** handle expired session by re-authenticating without losing unsaved work.
10. **Help & Support:** access help resources and submit feedback without navigation dead-ends.

## Quality Guardrails
- **Accessibility:** WCAG 2.1 AA, focus management, keyboard access, ARIA labels from design-system tokens.
- **Visual Consistency:** follow design system tokens for spacing, typography, and brand colors; all diffs approved by designer.
- **Performance:** LCP ≤ 2.5s on desktop, ≤ 3.0s on mobile for primary dashboard; INP ≤ 200ms.
- **Resilience:** graceful fallbacks for Supabase/network issues with informative messaging.
- **AI Usage:** AI-generated code/tests require automated validation and manual UX review before release.

## Release Gates
- All GitHub Action checks green (lint, typecheck, unit, e2e, visual, a11y, performance).
- Manual charter checklist completed for affected journeys.
- No critical accessibility violations in axe scans.
- Visual diffs reviewed and approved.
- Release journal entry created summarizing risks, mitigations, and outstanding debts.

## Review Cadence
- Revisit this charter monthly or when major product directions shift.
- Update personas and critical journeys as new functionality ships.
- Status: Initial charter drafted (2024-11-14). Next review due 2024-12-14.
