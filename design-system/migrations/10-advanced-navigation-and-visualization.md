# Migration 10: Advanced Navigation & Visualization Components

**Date:** 2024-05-20  
**Scope:** Calendar, Chart, Carousel, Collapsible, Breadcrumb, Avatar, Input OTP  
**Owner:** Design System Guild

## Summary

This migration completes the navigation + visualization batch highlighted in the Phase 3 plan. The affected components now consume the unified token surface, have Storybook coverage, and document any remaining risks for follow-up (primarily dark mode validation and data viz accessibility).

## Components Updated

### Calendar (`components/ui/calendar.tsx`)
- Replaced tailwind color classes with token-driven inline styles and CSS variable shims.
- Added controlled styling for range states, navigation buttons, and typography.
- Story: `components/ui/calendar.stories.tsx` exercises single-date selection.
- **Follow-up:** run dark mode sweep once token inversion utilities land.

### Chart (`components/ui/chart.tsx`)
- Centralized chart surface variables (`--muted`, `--chart-cursor`, etc.) with tokens.
- Eliminated tailwind color utilities inside tooltip/legend content in favor of explicit token styles.
- Story: `components/ui/chart.stories.tsx` using `AreaChart` with dual series and legend.
- **Follow-up:** document guidance for supplying semantic colors via `ChartConfig` in docs site backlog.

### Carousel (`components/ui/carousel.tsx`)
- Tokenized spacing, control positioning, and button sizing.
- Removed hard-coded negative offsets; now uses spacing scale.
- Story: `components/ui/carousel.stories.tsx` covering horizontal flow.
- **Follow-up:** add vertical example in visual QA sprint.

### Collapsible (`components/ui/collapsible.tsx`)
- No token gaps; added Storybook scenario to demonstrate integration with `Button` + copy deck.

### Breadcrumb (`components/ui/breadcrumb.tsx`)
- Reinforced token usage for gaps, text hierarchy, and ellipsis sizing.
- Story: `components/ui/breadcrumb.stories.tsx`.

### Avatar (`components/ui/avatar.tsx`)
- Ensured fallback surface + text colors pull from tokens; added story for visual regression.

### Input OTP (`components/ui/input-otp.tsx`)
- Injected focus ring/destructive CSS variables from the design system.
- Added subtle elevation token on active slot for clarity.
- Story: `components/ui/input-otp.stories.tsx` verifying grouped slots + separator.

## Testing
- `npm run lint`
- `npm run storybook -- --smoke-test --quiet`

## Open Items
1. Dark theme variables for `Calendar` and `Chart` require revisit once palette inversion utilities ship.
2. Add Playwright smoke for OTP input to ensure caret animation does not break SSR.
3. Chart docs to call out `ChartConfig` expectations (color tokens vs raw hex).
