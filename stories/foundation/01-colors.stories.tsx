import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@/design-system/tokens'

/**
 * # Color System
 *
 * Our color system uses semantic naming to ensure consistent, accessible,
 * and themeable color usage across the application.
 *
 * ## Principles
 *
 * - **Semantic naming** - Colors named by purpose, not appearance
 * - **WCAG 2.1 AA compliant** - All text meets contrast requirements
 * - **Dark mode ready** - Colors adapt automatically to theme
 * - **Token-based** - Always use tokens, never hardcode colors
 *
 * ## Usage
 *
 * ```tsx
 * import { tokens } from '@/design-system/tokens'
 *
 * // In inline styles
 * <div style={{ color: tokens.colors.text.primary }}>Text</div>
 *
 * // In Tailwind (use CSS variables)
 * <div className="text-foreground bg-background">Text</div>
 * ```
 */
const meta: Meta = {
  title: 'Foundation/Tokens/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Color tokens for consistent theming and accessibility.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const ColorSwatch = ({
  name,
  value,
  description,
}: {
  name: string
  value: string
  description?: string
}) => (
  <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
    <div
      className="w-16 h-16 rounded-lg border shadow-sm flex-shrink-0"
      style={{ backgroundColor: value }}
    />
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs text-muted-foreground font-mono">{value}</div>
      {description && (
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      )}
    </div>
  </div>
)

const ColorCategory = ({
  title,
  colors,
  description,
}: {
  title: string
  colors: Record<string, string>
  description?: string
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Object.entries(colors).map(([key, value]) => (
        <ColorSwatch key={key} name={key} value={value} />
      ))}
    </div>
  </div>
)

/**
 * Surface colors define backgrounds and containers at different elevations.
 */
export const Surface: Story = {
  render: () => (
    <ColorCategory
      title="Surface Colors"
      description="Use for backgrounds and containers at different elevations"
      colors={{
        'surface.base': tokens.colors.surface.base,
        'surface.elevated': tokens.colors.surface.elevated,
        'surface.overlay': tokens.colors.surface.overlay,
        'surface.sunken': tokens.colors.surface.sunken,
      }}
    />
  ),
}

/**
 * Text colors ensure readable, accessible text across all surfaces.
 * All combinations meet WCAG 2.1 AA contrast requirements.
 */
export const Text: Story = {
  render: () => (
    <ColorCategory
      title="Text Colors"
      description="Semantic text colors with guaranteed accessibility"
      colors={{
        'text.primary': tokens.colors.text.primary,
        'text.secondary': tokens.colors.text.secondary,
        'text.tertiary': tokens.colors.text.tertiary,
        'text.disabled': tokens.colors.text.disabled,
        'text.inverse': tokens.colors.text.inverse,
        'text.link': tokens.colors.text.link,
      }}
    />
  ),
}

/**
 * Border colors for dividers, outlines, and containers.
 */
export const Border: Story = {
  render: () => (
    <ColorCategory
      title="Border Colors"
      description="For dividers, outlines, and container borders"
      colors={{
        'border.default': tokens.colors.border.default,
        'border.subtle': tokens.colors.border.subtle,
        'border.strong': tokens.colors.border.strong,
        'border.disabled': tokens.colors.border.disabled,
      }}
    />
  ),
}

/**
 * Interactive colors for buttons, links, and active states.
 */
export const Interactive: Story = {
  render: () => (
    <div className="space-y-8">
      <ColorCategory
        title="Primary Interactive"
        description="Main interactive elements and CTAs"
        colors={{
          'interactive.primary': tokens.colors.interactive.primary,
          'interactive.primaryHover': tokens.colors.interactive.primaryHover,
          'interactive.primaryActive': tokens.colors.interactive.primaryActive,
          'interactive.primaryDisabled': tokens.colors.interactive.primaryDisabled,
        }}
      />
      <ColorCategory
        title="Secondary Interactive"
        description="Secondary actions and alternative interactions"
        colors={{
          'interactive.secondary': tokens.colors.interactive.secondary,
          'interactive.secondaryHover': tokens.colors.interactive.secondaryHover,
          'interactive.secondaryActive': tokens.colors.interactive.secondaryActive,
        }}
      />
    </div>
  ),
}

/**
 * Feedback colors communicate status and system responses.
 */
export const Feedback: Story = {
  render: () => (
    <div className="space-y-8">
      <ColorCategory
        title="Success"
        description="Positive outcomes and confirmations"
        colors={{
          'feedback.success': tokens.colors.feedback.success,
          'feedback.successSubtle': tokens.colors.feedback.successSubtle,
        }}
      />
      <ColorCategory
        title="Error"
        description="Errors, failures, and destructive actions"
        colors={{
          'feedback.error': tokens.colors.feedback.error,
          'feedback.errorSubtle': tokens.colors.feedback.errorSubtle,
        }}
      />
      <ColorCategory
        title="Warning"
        description="Warnings and important notices"
        colors={{
          'feedback.warning': tokens.colors.feedback.warning,
          'feedback.warningSubtle': tokens.colors.feedback.warningSubtle,
        }}
      />
      <ColorCategory
        title="Info"
        description="Informational messages and tips"
        colors={{
          'feedback.info': tokens.colors.feedback.info,
          'feedback.infoSubtle': tokens.colors.feedback.infoSubtle,
        }}
      />
    </div>
  ),
}

/**
 * Focus colors for keyboard navigation and accessibility.
 */
export const Focus: Story = {
  render: () => (
    <ColorCategory
      title="Focus Colors"
      description="For keyboard navigation and focus indicators"
      colors={{
        'focus.ring': tokens.colors.focus.ring,
        'focus.outline': tokens.colors.focus.outline,
      }}
    />
  ),
}

/**
 * Complete color palette showing all semantic colors in both light and dark modes.
 */
export const AllColors: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Complete Color System</h2>
        <p className="text-muted-foreground mb-6">
          All semantic color tokens organized by category. Toggle between light
          and dark mode using the toolbar above to see theme adaptation.
        </p>
      </div>

      <ColorCategory
        title="Surface"
        description="Backgrounds and containers"
        colors={{
          'surface.base': tokens.colors.surface.base,
          'surface.elevated': tokens.colors.surface.elevated,
          'surface.overlay': tokens.colors.surface.overlay,
          'surface.sunken': tokens.colors.surface.sunken,
        }}
      />

      <ColorCategory
        title="Text"
        description="Text colors for all hierarchies"
        colors={{
          'text.primary': tokens.colors.text.primary,
          'text.secondary': tokens.colors.text.secondary,
          'text.tertiary': tokens.colors.text.tertiary,
          'text.disabled': tokens.colors.text.disabled,
          'text.inverse': tokens.colors.text.inverse,
          'text.link': tokens.colors.text.link,
        }}
      />

      <ColorCategory
        title="Border"
        description="Dividers and outlines"
        colors={{
          'border.default': tokens.colors.border.default,
          'border.subtle': tokens.colors.border.subtle,
          'border.strong': tokens.colors.border.strong,
          'border.disabled': tokens.colors.border.disabled,
        }}
      />

      <ColorCategory
        title="Interactive"
        description="Interactive element states"
        colors={{
          'interactive.primary': tokens.colors.interactive.primary,
          'interactive.primaryHover': tokens.colors.interactive.primaryHover,
          'interactive.primaryActive': tokens.colors.interactive.primaryActive,
          'interactive.primaryDisabled':
            tokens.colors.interactive.primaryDisabled,
          'interactive.secondary': tokens.colors.interactive.secondary,
          'interactive.secondaryHover':
            tokens.colors.interactive.secondaryHover,
          'interactive.secondaryActive':
            tokens.colors.interactive.secondaryActive,
        }}
      />

      <ColorCategory
        title="Feedback"
        description="Status and system responses"
        colors={{
          'feedback.success': tokens.colors.feedback.success,
          'feedback.successSubtle': tokens.colors.feedback.successSubtle,
          'feedback.error': tokens.colors.feedback.error,
          'feedback.errorSubtle': tokens.colors.feedback.errorSubtle,
          'feedback.warning': tokens.colors.feedback.warning,
          'feedback.warningSubtle': tokens.colors.feedback.warningSubtle,
          'feedback.info': tokens.colors.feedback.info,
          'feedback.infoSubtle': tokens.colors.feedback.infoSubtle,
        }}
      />

      <ColorCategory
        title="Focus"
        description="Keyboard navigation and focus"
        colors={{
          'focus.ring': tokens.colors.focus.ring,
          'focus.outline': tokens.colors.focus.outline,
        }}
      />
    </div>
  ),
}

/**
 * Examples of colors in use with proper contrast ratios.
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage Examples</h2>
        <p className="text-muted-foreground mb-6">
          Real-world examples showing proper color usage and contrast.
        </p>
      </div>

      {/* Text on surfaces */}
      <div className="space-y-3">
        <h3 className="font-semibold">Text on Surfaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: tokens.colors.surface.base,
              color: tokens.colors.text.primary,
            }}
          >
            <p className="font-semibold">Primary text on base surface</p>
            <p
              className="text-sm mt-2"
              style={{ color: tokens.colors.text.secondary }}
            >
              Secondary text provides additional context
            </p>
          </div>
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: tokens.colors.surface.elevated,
              color: tokens.colors.text.primary,
            }}
          >
            <p className="font-semibold">Primary text on elevated surface</p>
            <p
              className="text-sm mt-2"
              style={{ color: tokens.colors.text.secondary }}
            >
              Elevated surfaces create visual hierarchy
            </p>
          </div>
        </div>
      </div>

      {/* Feedback states */}
      <div className="space-y-3">
        <h3 className="font-semibold">Feedback Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: tokens.colors.feedback.successSubtle,
              borderLeft: `4px solid ${tokens.colors.feedback.success}`,
            }}
          >
            <p className="font-semibold" style={{ color: tokens.colors.feedback.success }}>
              Success
            </p>
            <p className="text-sm mt-1" style={{ color: tokens.colors.text.secondary }}>
              Player added successfully
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: tokens.colors.feedback.errorSubtle,
              borderLeft: `4px solid ${tokens.colors.feedback.error}`,
            }}
          >
            <p className="font-semibold" style={{ color: tokens.colors.feedback.error }}>
              Error
            </p>
            <p className="text-sm mt-1" style={{ color: tokens.colors.text.secondary }}>
              Email is required. Enter your email address.
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: tokens.colors.feedback.warningSubtle,
              borderLeft: `4px solid ${tokens.colors.feedback.warning}`,
            }}
          >
            <p className="font-semibold" style={{ color: tokens.colors.feedback.warning }}>
              Warning
            </p>
            <p className="text-sm mt-1" style={{ color: tokens.colors.text.secondary }}>
              Unsaved changes will be lost
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: tokens.colors.feedback.infoSubtle,
              borderLeft: `4px solid ${tokens.colors.feedback.info}`,
            }}
          >
            <p className="font-semibold" style={{ color: tokens.colors.feedback.info }}>
              Info
            </p>
            <p className="text-sm mt-1" style={{ color: tokens.colors.text.secondary }}>
              Roster syncs every 5 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Interactive states */}
      <div className="space-y-3">
        <h3 className="font-semibold">Interactive States</h3>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: tokens.colors.interactive.primary,
              color: '#fff',
            }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: tokens.colors.interactive.primaryHover,
              color: '#fff',
            }}
          >
            Primary Hover
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: tokens.colors.interactive.primaryActive,
              color: '#fff',
            }}
          >
            Primary Active
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium cursor-not-allowed"
            style={{
              backgroundColor: tokens.colors.interactive.primaryDisabled,
              color: tokens.colors.text.disabled,
            }}
          >
            Primary Disabled
          </button>
        </div>
      </div>
    </div>
  ),
}
