/** @type {import('tailwindcss').Config} */

/**
 * The design tokens in `app/globals.css` are complete oklch colours, e.g.
 * `--primary: oklch(0.646 0.222 41.116)`. They are consumed two ways:
 *
 *   1. directly, as `var(--primary)`, by ~200 rules in globals.css
 *   2. here, to generate the semantic Tailwind utilities
 *
 * `color-mix` satisfies both. Wrapping the token in `hsl()` (as this file used
 * to) produced `hsl(oklch(...))` — invalid CSS, silently dropped — which is why
 * `border-primary`, `bg-primary/*`, `bg-destructive/*` and `ring-primary`
 * rendered no colour at all. Substituting Tailwind's `<alpha-value>` into the
 * mix percentage keeps the opacity modifiers (`bg-primary/50`) working; with no
 * modifier Tailwind substitutes `1`, yielding the unmodified colour.
 *
 * Do not reintroduce a colour-space wrapper here. The tokens already carry one.
 */
const token = (name) =>
  `color-mix(in oklab, var(--${name}) calc(<alpha-value> * 100%), transparent)`

module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './i18n/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        background: token('background'),
        foreground: token('foreground'),
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: token('secondary'),
          foreground: token('secondary-foreground'),
          hover: 'var(--secondary-hover)',
        },
        destructive: {
          DEFAULT: token('destructive'),
          foreground: token('destructive-foreground'),
          hover: 'var(--destructive-hover)',
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
        },
        popover: {
          DEFAULT: token('popover'),
          foreground: token('popover-foreground'),
        },
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        sidebar: {
          DEFAULT: token('sidebar'),
          foreground: token('sidebar-foreground'),
          primary: token('sidebar-primary'),
          'primary-foreground': token('sidebar-primary-foreground'),
          accent: token('sidebar-accent'),
          'accent-foreground': token('sidebar-accent-foreground'),
          border: token('sidebar-border'),
          ring: token('sidebar-ring'),
        },
        'page-background': token('page-background'),
        'nav-background': token('nav-background'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
