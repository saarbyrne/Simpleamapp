# Design Token Audit — SimpleAM
**Date:** 2026-03-11  
**Repo:** `/workspace/Simpleamapp`

## Executive Summary
SimpleAM has a solid token foundation for color, typography, spacing, and motion, with a clear semantic theme layer implemented through CSS variables and Tailwind mappings. Coverage is strong for core UI styling, but token architecture is still partial: radius, elevation, and z-index are not fully systematized, and naming conventions mix semantic kebab-case CSS variables with camelCase TS keys. The biggest scalability risk is continued hardcoded values (especially fixed px widths/heights and literal colors) outside the token layer.

## Token Source Files

| File path | Format | Categories covered |
|---|---|---|
| `app/globals.css` | CSS custom properties + theme overrides | Semantic colors, chart colors, radius base, typography primitives (`--font-*`, `--text-*`), base spacing variable, hover variants, dark mode |
| `tailwind.config.js` | Tailwind theme extension | Semantic color aliases, border radius mapping to `--radius` |
| `design-system/tokens/colors.ts` | TS token object + CSS variable map export | Semantic colors, surface/background colors, sidebar colors, chart colors, dark-mode pairs |
| `design-system/tokens/spacing.ts` | TS token object + semantic utility patterns | Primitive spacing scale (rem), semantic spacing usage patterns |
| `design-system/tokens/typography.ts` | TS token object + semantic text scale | Font family, sizes, weights, line heights, letter spacing, semantic text styles |
| `design-system/tokens/motion.ts` | TS token object | Durations and easing functions |
| `design-system/tokens/index.ts` | TS barrel export | Central token export surface |
| `tests/design-system/tokens.test.ts` | Token validation tests | Structural/token integrity checks for color/spacing/typography/motion |
| `scripts/validate-tokens.js` | Governance script | Lint-like enforcement for hardcoded utility values vs tokenized utilities |
| `scripts/check-tokens.sh` | Shell checker | Additional hardcoded utility scan |

## Category Coverage

| Category | Status | Notes |
|---|---|---|
| Colour | **Exists** | Semantic palette + dark mode defined (`primary`, `secondary`, `destructive`, surfaces, sidebar, chart). No explicit primitive brand ramp (e.g., `blue-50…900`) exposed as first-tier tokens. |
| Typography | **Exists** | Families, sizes, weights, line heights, letter spacing, and semantic text styles (`h1`, `body`, `caption`) present. |
| Spacing | **Partial** | Full numeric scale exists in TS and Tailwind utilities, but semantic aliases are pattern-level classes (`cardPadding`, etc.) rather than cross-platform token aliases. |
| Border & Radius | **Partial** | Radius base token exists (`--radius`) and mapped sizes (`sm/md/lg`). Border widths and a full radius scale (`none/full/xl`) not formalized in token files. |
| Elevation / Shadow | **Missing/Partial** | Component classes use Tailwind `shadow-*`, but no explicit shadow token scale or semantic shadow aliases in token source files. |
| Motion / Animation | **Partial** | Duration and easing tokens exist; named transition tokens (e.g., `transition.emphasized`) are not defined. |
| Z-index | **Missing** | No central z-index token scale/layer map found; `z-*` values appear at component level. |

## Naming Convention Issues

- **Mixed naming tiers and delimiters across token representations**: CSS variables are kebab-case (`--primary-foreground`) while TS token keys often use camelCase (`pageBackground`, `navBackground`, `sidebarPrimaryForeground`). This is manageable but creates translation overhead and room for drift.
- **Primitive vs semantic layering is incomplete**: semantic tokens are strong (`primary`, `muted`, `card`), but there is no explicit primitive palette file/ramp that semantic aliases reference.
- **Abbreviation consistency varies in utility conventions**: codebase mixes full semantic utilities with abbreviated utility fragments (`px`, `py`, `bg`) due to Tailwind class syntax; acceptable in utility-first CSS, but weak for platform-agnostic token naming.

## Hardcoded Value Count

Scanned `app/`, `components/`, `lib/`, `hooks/` (excluding build artifacts). Counts are from repo-wide pattern searches for hardcoded colors, spacing/font CSS declarations, and inline JSX styles.

| Category | Count | Top offenders |
|---|---:|---|
| Hex colors (`#...`) | 92 | `#ffffff` (12), `#142978` (7), `#ff4444` (7) |
| RGB/RGBA | 6 | `rgba(...)` usages are low-frequency, mostly bespoke visual logic |
| Hardcoded spacing in CSS (`margin/padding/gap/top/...` without var) | 58 | frequent fixed values in CSS + component-level layout rules |
| Hardcoded font-size in CSS (`font-size` without var) | 23 | mostly prose/editor styling blocks |
| Inline JSX styles (`style={{ ... }}`) | 44 | often for dynamic width/position/color |

Top repeated literal values worth tokenizing first:
1. `1px` (17)
2. `400px` (14)
3. `600px` (13)
4. `#ffffff` (12)
5. `300px` (11)
6. `8px` (11)
7. `200px` (11)
8. `80px` (10)
9. `500px` (9)
10. `0px` (8)

## Component Token Adoption

Representative components audited: `button`, `input`, `card`, `dialog`, `badge`.

| Component | Tokens used | Hardcoded values | Adoption % |
|---|---:|---:|---:|
| `components/ui/button.tsx` | 33 | 2 (`text-white`, `ring-[3px]`) | 94.3% |
| `components/ui/input.tsx` | 20 | 1 (`ring-[3px]`) | 95.2% |
| `components/ui/card.tsx` | 9 | 0 | 100% |
| `components/ui/dialog.tsx` | 20 | 1 (`bg-black/80`) | 95.2% |
| `components/ui/badge.tsx` | 18 | 0 | 100% |

Lowest adoption in this sample: **Button**, due to explicit white text + arbitrary ring width.

## Architecture Assessment

| Criterion | Score | Notes |
|---|---|---|
| Single source of truth | ⚠️ partial | Canonical values are split across `app/globals.css`, `tailwind.config.js`, and TS token files (aligned but duplicated). |
| Two-tier system | ⚠️ partial | Strong semantic layer; primitive layer not fully explicit/referenced as independent tier. |
| Platform-agnostic format | ⚠️ partial | TS objects are portable for code, but no canonical JSON/Style Dictionary source of record. |
| Theming capability | ✅ solid | Light/dark tokens are implemented and swappable via class-based theme variables. |
| Token documentation | ✅ solid | `docs/design-system/DESIGN_SYSTEM.md` provides broad token guidance. |
| Tooling | ⚠️ partial | Validation scripts/tests exist, but no end-to-end token build/sync pipeline (e.g., Style Dictionary export) found. |

Overall architecture quality is **good but not yet mature**. It supports day-to-day consistency and theme variants, but long-term scale would benefit from consolidating token authoring into one canonical source, formalizing primitive-to-semantic mapping, and introducing cross-platform export/sync tooling.

## Figma Alignment

Figma link exists in `README.md`, but no automated sync pipeline (Tokens Studio/Style Dictionary bridge) was found in repo tooling. Alignment appears manual; code-level token names are mostly semantic and likely mappable, but no explicit mapping artifact exists.

## Recommended Actions

### P0 — Critical
- Define and enforce semantic aliases for repeated fixed dimensions (`400px`, `600px`, `300px`, `200px`) in shared layout/dialog/table tokens.
- Replace recurring literal colors (`#ffffff`, bespoke brand hexes) in product UI with semantic color tokens where possible.
- Expand token-lint scope beyond `components/ui/*` to include feature modules under `app/` and `components/*`.

### P1 — Important
- Introduce explicit primitive token tier (e.g., base palettes/scales) and map semantic tokens to primitives.
- Standardize naming transformation rules between CSS vars and TS exports (documented conversion pattern).
- Add tokenized state/interaction coverage for hover/focus/disabled/active beyond current primary/secondary/destructive hover vars.

### P2 — Nice to Have
- Add z-index token scale and semantic layer names (`dropdown`, `modal`, `toast`, `tooltip`).
- Add shadow/elevation token scale and semantic aliases (`card`, `overlay`, `popover`).
- Introduce platform-agnostic token pipeline (e.g., Style Dictionary JSON source + generated CSS/TS outputs).
- Create explicit Figma↔code token mapping doc (or automated sync) to reduce drift.
