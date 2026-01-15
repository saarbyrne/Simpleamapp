# SimpleAM Storybook

Interactive design system documentation for SimpleAM.

## Running Storybook

```bash
npm run storybook
```

Storybook will start on http://localhost:6006

## Building Storybook

```bash
npm run build-storybook
```

## What's Included

### Design Tokens
- **Colors** - Semantic color system with marketing brand colors
- **Typography** - Type scale and font weights
- **Spacing** - Spacing scale and patterns
- **Status Colors** - Centralized status color definitions

### Components
- **Button** - All variants and sizes
- **Card** - Card layouts and patterns
- **Badge** - Status badges and variants
- **Input** - Form inputs with examples
- More components coming soon!

### Addons Installed

- **@storybook/addon-essentials** - Core addons (controls, docs, viewport, etc.)
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-interactions** - Interaction testing
- **@geometricpanda/storybook-addon-badges** - Component status badges
- **storybook-addon-pseudo-states** - Test hover, focus, active states

## Features

- ✅ Light/Dark mode switcher in toolbar
- ✅ Responsive viewport testing
- ✅ Accessibility checks
- ✅ Component documentation
- ✅ Interactive controls
- ✅ Code examples

## Configuration

- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.tsx` - Preview configuration and global decorators
- `.storybook/decorators/ThemeDecorator.tsx` - Dark mode support

## Adding New Stories

Create a new `.stories.tsx` file in the `stories/` directory:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from '@/components/YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // your props here
  },
};
```

## Notes

- All stories use the SimpleAM design system
- Components automatically support dark mode
- Stories respect semantic color tokens
