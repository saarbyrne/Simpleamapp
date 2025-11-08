# Design System Token Validation

This document explains how to validate that your components are using design system tokens instead of hardcoded values.

## Quick Validation

### Using the Shell Script (Recommended)

```bash
bash scripts/check-tokens.sh
```

This script scans all component files and reports any hardcoded Tailwind values that should be using design system tokens.

### Manual Grep Search

Search for common hardcoded patterns:

```bash
# Find hardcoded spacing values (p-4, px-3, gap-2, etc.)
grep -r "p-[0-9]" components/ui/*.tsx | grep -v "ds-"

# Find hardcoded icon sizes (h-4 w-4, etc.)
grep -r "h-[2-5].*w-[2-5]" components/ui/*.tsx | grep -v "ds-"

# Find any non-token spacing
grep -r "className.*\(gap\|space-[xy]\)-[0-9]" components/ui/*.tsx | grep -v "ds-"
```

## Current Status

### ✅ Fully Tokenized Components (22)

These components use design system tokens exclusively:

- AlertDialog
- Avatar
- Badge
- Button
- Card
- Checkbox
- Command
- Context Menu
- Dialog
- Drawer
- Dropdown Menu
- Form Fields (Input, Textarea base styles)
- Menubar
- Navigation Menu
- Popover
- Radio Group
- Sheet
- Tabs
- Textarea (with variant="outline")
- Tooltip

### ⚠️ Partially Tokenized Components

These components have some hardcoded values remaining:

- **Dialog** - Close button positioning (acceptable exception)
- **Textarea** - Variant styles need token update
- **Toggle** - Size variants need tokenization
- **Toggle Group** - Gap values need tokenization

### 📝 Not Yet Tokenized Components

These components use stock shadcn styling:

- Accordion
- Alert
- Breadcrumb
- Calendar
- Carousel
- Chart
- Label
- Pagination
- Progress
- Select
- Separator
- Sidebar
- Slider
- Sonner
- Table

**Note:** Some of these (Calendar, Chart, Sidebar) are complex components with specific sizing requirements that may not need full tokenization.

## Token Mapping Reference

### Spacing Tokens

| Hardcoded | Token | Pixel Value |
|-----------|-------|-------------|
| `p-1` | `p-ds-2xs` | 4px |
| `p-2` | `p-ds-sm` | 8px |
| `p-3` | `p-ds-md` | 12px |
| `p-4` | `p-ds-lg` | 16px |
| `p-6` | `p-ds-2xl` | 24px |
| `gap-1` | `gap-ds-2xs` | 4px |
| `gap-2` | `gap-ds-sm` | 8px |
| `gap-4` | `gap-ds-lg` | 16px |
| `space-y-1.5` | `space-y-ds-xs` | 6px |
| `space-y-2` | `space-y-ds-sm` | 8px |

### Icon Size Tokens

| Hardcoded | Token | Pixel Value |
|-----------|-------|-------------|
| `h-2 w-2` | `h-ds-icon-2xs w-ds-icon-2xs` | 8px |
| `h-3 w-3` | `h-ds-icon-xs w-ds-icon-xs` | 12px |
| `h-4 w-4` | `h-ds-icon-sm w-ds-icon-sm` | 16px |
| `h-5 w-5` | `h-ds-icon-md w-ds-icon-md` | 20px |

### Component Size Tokens

| Hardcoded | Token | Pixel Value |
|-----------|-------|-------------|
| `h-8 w-8` | `h-ds-3xl w-ds-3xl` | 32px |
| `h-10 w-10` | `h-ds-4xl w-ds-4xl` | 40px |
| `h-12 w-12` | `h-ds-5xl w-ds-5xl` | 48px |
| `max-w-md` | `max-w-ds-dialog-md` | 448px |
| `max-w-lg` | `max-w-ds-dialog-lg` | 512px |

## Adding Token Validation to CI/CD

### GitHub Actions

Add to `.github/workflows/ci.yml`:

```yaml
- name: Validate Design System Tokens
  run: bash scripts/check-tokens.sh
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
bash scripts/check-tokens.sh || {
  echo "❌ Token validation failed. Please use design system tokens."
  exit 1
}
```

## Testing Token Changes

### Visual Regression Testing

When you modify token values in `app/design-system-tokens.css`, visually verify:

1. **Run Storybook:**
   ```bash
   npm run storybook
   ```

2. **Check these stories:**
   - Button variants (spacing consistency)
   - Dialog/AlertDialog (max-width)
   - Command palette (padding, gaps)
   - Menu components (item spacing)
   - Card layouts (padding)

### Manual Verification

Test that tokens are being applied:

```bash
# 1. Start dev server
npm run dev

# 2. In browser DevTools, inspect a component
# 3. Look for CSS custom properties:
#    Should see: var(--ds-spacing-md)
#    Not: 12px directly

# 4. Modify a token value in design-system-tokens.css
#    Example: Change --ds-spacing-md from 0.75rem to 1rem
# 5. Verify the change propagates to all components
```

## Acceptable Exceptions

Some hardcoded values are intentionally allowed:

### Structural Values
- `h-10`, `h-11`, `h-9` - Standard button/input heights
- `w-full`, `h-full` - Full width/height utilities
- `h-px` - 1px borders/dividers

### Positioning Values
- `top-[50%]`, `left-[50%]` - Centering values
- `top-[1px]` - Fine positioning adjustments

### Component-Specific
- `w-72` - Popover default width
- `w-3/4` - Fractional widths for responsive layouts

## How to Fix Violations

### Example 1: Spacing

**Before:**
```tsx
<div className="flex gap-2 p-4">
```

**After:**
```tsx
<div className="flex gap-ds-sm p-ds-lg">
```

### Example 2: Icon Sizing

**Before:**
```tsx
<Icon className="h-4 w-4" />
```

**After:**
```tsx
<Icon className="h-ds-icon-sm w-ds-icon-sm" />
```

### Example 3: Component Padding

**Before:**
```tsx
const CardHeader = ({ className }) => (
  <div className={cn("p-6 space-y-1.5", className)} />
)
```

**After:**
```tsx
const CardHeader = ({ className }) => (
  <div className={cn("p-ds-2xl space-y-ds-xs", className)} />
)
```

## Next Steps

### Priority Refactoring

If you want to tokenize more components, prioritize these:

1. **Toggle & Toggle Group** - Simple, frequently used
2. **Select** - Important form component
3. **Alert** - Common feedback component
4. **Breadcrumb** - Navigation component

### Token System Expansion

If you need additional token values:

1. Add to `app/design-system-tokens.css`:
   ```css
   --ds-spacing-custom: 1.5rem;
   ```

2. Extend `tailwind.config.js`:
   ```js
   spacing: {
     'ds-custom': 'var(--ds-spacing-custom)',
   }
   ```

3. Use in components:
   ```tsx
   className="p-ds-custom"
   ```

## Troubleshooting

### Script Shows False Positives

The script may flag acceptable exceptions. Review each violation manually:

```bash
# Check a specific file
grep -n "p-4" components/ui/dialog.tsx
```

### Tokens Not Applying

1. Verify the token exists in `design-system-tokens.css`
2. Check it's mapped in `tailwind.config.js`
3. Rebuild Tailwind: `npm run dev` (restart)
4. Clear browser cache

### Token Value Not Updating

1. Stop dev server
2. Delete `.next` directory: `rm -rf .next`
3. Restart: `npm run dev`

## Resources

- Design tokens: `/app/design-system-tokens.css`
- Tailwind config: `/tailwind.config.js`
- Token patterns: `/design-system/tokens/`
- Validation script: `/scripts/check-tokens.sh`
