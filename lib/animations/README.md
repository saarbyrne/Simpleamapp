# Animation Utilities

Centralized animation utilities for Framer Motion and other animation libraries.

## File Structure

- **`animations.ts`** - Core animation variants (fadeIn, slideIn, scaleUp, etc.)
- **`animation-utils.ts`** - Animation utility functions and helpers
- **`feedback-animations.ts`** - User feedback animations (success, error, warning)
- **`loading-animations.ts`** - Loading state animations (spinners, skeletons, progress bars)
- **`page-transitions.ts`** - Page transition effects for routing
- **`index.ts`** - Centralized exports for convenience

## Usage

Import animations from the main module:

```typescript
import { fadeIn, slideIn } from '@/lib/animations';
import { shimmer, spinner } from '@/lib/animations';
import { feedbackSuccess } from '@/lib/animations';
```

## Animation Categories

### Core Animations (`animations.ts`)
Basic motion variants for common UI elements.

### Feedback Animations (`feedback-animations.ts`)
Animations for user feedback states:
- Success confirmations
- Error messages
- Warning alerts
- Info notifications

### Loading Animations (`loading-animations.ts`)
Loading state indicators:
- Spinners
- Skeleton loaders
- Progress bars
- Shimmer effects

### Page Transitions (`page-transitions.ts`)
Route-based page transitions for smooth navigation between views.

## Best Practices

1. **Consistency** - Use these standard animations across the app for a cohesive UX
2. **Performance** - Prefer transform and opacity for better performance
3. **Accessibility** - Respect `prefers-reduced-motion` user preferences
4. **Duration** - Keep animations short (150-300ms for micro-interactions, 300-500ms for larger transitions)
