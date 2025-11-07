import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@/design-system/tokens'

/**
 * # Typography System
 *
 * Our typography system provides a consistent type scale for all text across
 * the application, from headings to body copy to captions.
 *
 * ## Principles
 *
 * - **Modular scale** - Harmonious size relationships
 * - **Semantic naming** - Named by purpose, not appearance
 * - **Accessibility** - Readable line heights and spacing
 * - **Responsive** - Adapts to screen sizes
 *
 * ## Usage
 *
 * ```tsx
 * import { tokens } from '@/design-system/tokens'
 *
 * // In inline styles
 * <h1 style={{
 *   fontSize: tokens.typography.heading.h1.fontSize,
 *   fontWeight: tokens.typography.heading.h1.fontWeight,
 *   lineHeight: tokens.typography.heading.h1.lineHeight,
 * }}>
 *   Heading
 * </h1>
 *
 * // In Tailwind
 * <h1 className="text-4xl font-bold leading-tight">Heading</h1>
 * ```
 */
const meta: Meta = {
  title: 'Foundation/Tokens/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography tokens for consistent, accessible text.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const TypeSample = ({
  label,
  sample = 'The quick brown fox jumps over the lazy dog',
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
}: {
  label: string
  sample?: string
  fontSize: string
  fontWeight?: number | string
  lineHeight: string
  letterSpacing?: string
}) => (
  <div className="space-y-2 p-4 border rounded-lg">
    <div className="flex items-baseline justify-between gap-4 text-xs text-muted-foreground">
      <span className="font-semibold">{label}</span>
      <span className="font-mono">
        {fontSize} / {lineHeight}
        {fontWeight && ` / ${fontWeight}`}
      </span>
    </div>
    <div
      style={{
        fontSize,
        fontWeight: fontWeight || 400,
        lineHeight,
        letterSpacing: letterSpacing || 'normal',
      }}
    >
      {sample}
    </div>
  </div>
)

/**
 * Heading styles for page titles, section headers, and hierarchical content.
 */
export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Headings</h2>
        <p className="text-muted-foreground mb-6">
          Six levels of headings for semantic hierarchy
        </p>
      </div>

      <TypeSample
        label="H1 - Page Title"
        sample="Deliver world-class player wellness"
        fontSize={tokens.typography.heading.h1.fontSize}
        fontWeight={tokens.typography.heading.h1.fontWeight}
        lineHeight={tokens.typography.heading.h1.lineHeight}
      />

      <TypeSample
        label="H2 - Section Header"
        sample="Manage your roster with confidence"
        fontSize={tokens.typography.heading.h2.fontSize}
        fontWeight={tokens.typography.heading.h2.fontWeight}
        lineHeight={tokens.typography.heading.h2.lineHeight}
      />

      <TypeSample
        label="H3 - Subsection"
        sample="Player wellness monitoring"
        fontSize={tokens.typography.heading.h3.fontSize}
        fontWeight={tokens.typography.heading.h3.fontWeight}
        lineHeight={tokens.typography.heading.h3.lineHeight}
      />

      <TypeSample
        label="H4 - Group Heading"
        sample="Recent activity"
        fontSize={tokens.typography.heading.h4.fontSize}
        fontWeight={tokens.typography.heading.h4.fontWeight}
        lineHeight={tokens.typography.heading.h4.lineHeight}
      />

      <TypeSample
        label="H5 - Card Title"
        sample="Jordan Smith"
        fontSize={tokens.typography.heading.h5.fontSize}
        fontWeight={tokens.typography.heading.h5.fontWeight}
        lineHeight={tokens.typography.heading.h5.lineHeight}
      />

      <TypeSample
        label="H6 - Small Heading"
        sample="Position: Midfielder"
        fontSize={tokens.typography.heading.h6.fontSize}
        fontWeight={tokens.typography.heading.h6.fontWeight}
        lineHeight={tokens.typography.heading.h6.lineHeight}
      />
    </div>
  ),
}

/**
 * Body text styles for paragraphs, lists, and general content.
 */
export const Body: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Body Text</h2>
        <p className="text-muted-foreground mb-6">
          Three sizes for different contexts and hierarchies
        </p>
      </div>

      <TypeSample
        label="Large - Introductory text"
        sample="Track wellness metrics, manage player data, and generate comprehensive reports for your entire roster. Our platform helps you make data-driven decisions."
        fontSize={tokens.typography.body.lg.fontSize}
        fontWeight={tokens.typography.body.lg.fontWeight}
        lineHeight={tokens.typography.body.lg.lineHeight}
      />

      <TypeSample
        label="Medium - Default body"
        sample="Monitor daily wellness scores, training loads, and recovery metrics. Get instant notifications when players need attention or risk factors emerge."
        fontSize={tokens.typography.body.md.fontSize}
        fontWeight={tokens.typography.body.md.fontWeight}
        lineHeight={tokens.typography.body.md.lineHeight}
      />

      <TypeSample
        label="Small - Supporting text"
        sample="View detailed player profiles with comprehensive wellness history, injury records, and performance analytics all in one place."
        fontSize={tokens.typography.body.sm.fontSize}
        fontWeight={tokens.typography.body.sm.fontWeight}
        lineHeight={tokens.typography.body.sm.lineHeight}
      />

      <TypeSample
        label="Extra Small - Metadata"
        sample="Last updated: 2 minutes ago • Created by: Coach Smith"
        fontSize={tokens.typography.body.xs.fontSize}
        fontWeight={tokens.typography.body.xs.fontWeight}
        lineHeight={tokens.typography.body.xs.lineHeight}
      />
    </div>
  ),
}

/**
 * Font weights for emphasis and hierarchy.
 */
export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Font Weights</h2>
        <p className="text-muted-foreground mb-6">
          Four weights for different levels of emphasis
        </p>
      </div>

      <TypeSample
        label="Regular (400)"
        sample="Regular weight for body text and general content"
        fontSize={tokens.typography.body.md.fontSize}
        fontWeight={tokens.typography.fontWeight.regular}
        lineHeight={tokens.typography.body.md.lineHeight}
      />

      <TypeSample
        label="Medium (500)"
        sample="Medium weight for subtle emphasis and labels"
        fontSize={tokens.typography.body.md.fontSize}
        fontWeight={tokens.typography.fontWeight.medium}
        lineHeight={tokens.typography.body.md.lineHeight}
      />

      <TypeSample
        label="Semibold (600)"
        sample="Semibold for UI elements and navigation"
        fontSize={tokens.typography.body.md.fontSize}
        fontWeight={tokens.typography.fontWeight.semibold}
        lineHeight={tokens.typography.body.md.lineHeight}
      />

      <TypeSample
        label="Bold (700)"
        sample="Bold for headings and strong emphasis"
        fontSize={tokens.typography.body.md.fontSize}
        fontWeight={tokens.typography.fontWeight.bold}
        lineHeight={tokens.typography.body.md.lineHeight}
      />
    </div>
  ),
}

/**
 * Complete type scale showing all styles in context.
 */
export const TypeScale: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Complete Type Scale</h2>
        <p className="text-muted-foreground mb-6">
          All typography tokens with samples and specifications
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Headings</h3>
          <div className="space-y-2">
            <TypeSample
              label="H1"
              sample="Page Title"
              fontSize={tokens.typography.heading.h1.fontSize}
              fontWeight={tokens.typography.heading.h1.fontWeight}
              lineHeight={tokens.typography.heading.h1.lineHeight}
            />
            <TypeSample
              label="H2"
              sample="Section Header"
              fontSize={tokens.typography.heading.h2.fontSize}
              fontWeight={tokens.typography.heading.h2.fontWeight}
              lineHeight={tokens.typography.heading.h2.lineHeight}
            />
            <TypeSample
              label="H3"
              sample="Subsection"
              fontSize={tokens.typography.heading.h3.fontSize}
              fontWeight={tokens.typography.heading.h3.fontWeight}
              lineHeight={tokens.typography.heading.h3.lineHeight}
            />
            <TypeSample
              label="H4"
              sample="Group Heading"
              fontSize={tokens.typography.heading.h4.fontSize}
              fontWeight={tokens.typography.heading.h4.fontWeight}
              lineHeight={tokens.typography.heading.h4.lineHeight}
            />
            <TypeSample
              label="H5"
              sample="Card Title"
              fontSize={tokens.typography.heading.h5.fontSize}
              fontWeight={tokens.typography.heading.h5.fontWeight}
              lineHeight={tokens.typography.heading.h5.lineHeight}
            />
            <TypeSample
              label="H6"
              sample="Small Heading"
              fontSize={tokens.typography.heading.h6.fontSize}
              fontWeight={tokens.typography.heading.h6.fontWeight}
              lineHeight={tokens.typography.heading.h6.lineHeight}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Body</h3>
          <div className="space-y-2">
            <TypeSample
              label="Large"
              fontSize={tokens.typography.body.lg.fontSize}
              fontWeight={tokens.typography.body.lg.fontWeight}
              lineHeight={tokens.typography.body.lg.lineHeight}
            />
            <TypeSample
              label="Medium (default)"
              fontSize={tokens.typography.body.md.fontSize}
              fontWeight={tokens.typography.body.md.fontWeight}
              lineHeight={tokens.typography.body.md.lineHeight}
            />
            <TypeSample
              label="Small"
              fontSize={tokens.typography.body.sm.fontSize}
              fontWeight={tokens.typography.body.sm.fontWeight}
              lineHeight={tokens.typography.body.sm.lineHeight}
            />
            <TypeSample
              label="Extra Small"
              fontSize={tokens.typography.body.xs.fontSize}
              fontWeight={tokens.typography.body.xs.fontWeight}
              lineHeight={tokens.typography.body.xs.lineHeight}
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Real-world usage examples showing typography in context.
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage Examples</h2>
        <p className="text-muted-foreground mb-6">
          Typography in common UI patterns
        </p>
      </div>

      {/* Article/Blog Post */}
      <div className="p-6 border rounded-lg space-y-4">
        <div
          style={{
            fontSize: tokens.typography.heading.h2.fontSize,
            fontWeight: tokens.typography.heading.h2.fontWeight,
            lineHeight: tokens.typography.heading.h2.lineHeight,
          }}
        >
          Player Wellness Best Practices
        </div>
        <div
          className="text-muted-foreground"
          style={{
            fontSize: tokens.typography.body.lg.fontSize,
            lineHeight: tokens.typography.body.lg.lineHeight,
          }}
        >
          A comprehensive guide to monitoring and improving player wellness
          throughout the season.
        </div>
        <div
          style={{
            fontSize: tokens.typography.body.md.fontSize,
            lineHeight: tokens.typography.body.md.lineHeight,
          }}
        >
          Regular wellness monitoring helps identify potential issues before
          they become serious problems. By tracking key metrics daily, coaches
          can make informed decisions about training loads and recovery needs.
        </div>
        <div
          className="text-muted-foreground"
          style={{
            fontSize: tokens.typography.body.xs.fontSize,
            lineHeight: tokens.typography.body.xs.lineHeight,
          }}
        >
          Published November 5, 2024 • 5 min read
        </div>
      </div>

      {/* Card */}
      <div className="p-6 border rounded-lg space-y-3">
        <div
          style={{
            fontSize: tokens.typography.heading.h4.fontSize,
            fontWeight: tokens.typography.heading.h4.fontWeight,
            lineHeight: tokens.typography.heading.h4.lineHeight,
          }}
        >
          Jordan Smith
        </div>
        <div
          className="flex items-center gap-2 text-muted-foreground"
          style={{
            fontSize: tokens.typography.body.sm.fontSize,
            lineHeight: tokens.typography.body.sm.lineHeight,
          }}
        >
          <span>Midfielder</span>
          <span>•</span>
          <span>#10</span>
        </div>
        <div
          style={{
            fontSize: tokens.typography.body.md.fontSize,
            lineHeight: tokens.typography.body.md.lineHeight,
          }}
        >
          Wellness Score: <span className="font-semibold">87</span>
        </div>
        <div
          className="text-muted-foreground"
          style={{
            fontSize: tokens.typography.body.xs.fontSize,
            lineHeight: tokens.typography.body.xs.lineHeight,
          }}
        >
          Last updated 2 hours ago
        </div>
      </div>

      {/* Form */}
      <div className="p-6 border rounded-lg space-y-4">
        <div
          style={{
            fontSize: tokens.typography.heading.h3.fontSize,
            fontWeight: tokens.typography.heading.h3.fontWeight,
            lineHeight: tokens.typography.heading.h3.lineHeight,
          }}
        >
          Add New Player
        </div>
        <div className="space-y-2">
          <label
            className="block"
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              fontWeight: tokens.typography.fontWeight.medium,
            }}
          >
            Player Name
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full px-3 py-2 border rounded-lg"
            style={{
              fontSize: tokens.typography.body.md.fontSize,
            }}
          />
          <div
            className="text-muted-foreground"
            style={{
              fontSize: tokens.typography.body.xs.fontSize,
            }}
          >
            Enter the player's full legal name
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th
                className="px-4 py-3 text-left"
                style={{
                  fontSize: tokens.typography.body.sm.fontSize,
                  fontWeight: tokens.typography.fontWeight.semibold,
                }}
              >
                Player
              </th>
              <th
                className="px-4 py-3 text-left"
                style={{
                  fontSize: tokens.typography.body.sm.fontSize,
                  fontWeight: tokens.typography.fontWeight.semibold,
                }}
              >
                Position
              </th>
              <th
                className="px-4 py-3 text-left"
                style={{
                  fontSize: tokens.typography.body.sm.fontSize,
                  fontWeight: tokens.typography.fontWeight.semibold,
                }}
              >
                Wellness
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td
                className="px-4 py-3"
                style={{
                  fontSize: tokens.typography.body.md.fontSize,
                  fontWeight: tokens.typography.fontWeight.medium,
                }}
              >
                Jordan Smith
              </td>
              <td
                className="px-4 py-3 text-muted-foreground"
                style={{
                  fontSize: tokens.typography.body.md.fontSize,
                }}
              >
                Midfielder
              </td>
              <td
                className="px-4 py-3"
                style={{
                  fontSize: tokens.typography.body.md.fontSize,
                  fontWeight: tokens.typography.fontWeight.semibold,
                }}
              >
                87
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
}

/**
 * Accessibility guidelines for typography.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Accessibility Guidelines</h2>
        <p className="text-muted-foreground mb-6">
          Our typography system is designed for maximum readability
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Line Height</h3>
          <p className="text-sm text-muted-foreground">
            All body text uses a minimum line-height of 1.5 (WCAG 2.1 AA
            requirement). Headings use 1.2-1.3 for better visual hierarchy.
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Font Size</h3>
          <p className="text-sm text-muted-foreground">
            Base body text is 16px (1rem) for optimal readability. Smaller text
            is used sparingly and only for metadata or captions.
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Contrast</h3>
          <p className="text-sm text-muted-foreground">
            All text colors meet WCAG 2.1 AA contrast requirements (4.5:1 for
            normal text, 3:1 for large text).
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Semantic HTML</h3>
          <p className="text-sm text-muted-foreground">
            Always use proper heading hierarchy (h1 → h2 → h3) for screen
            readers and SEO. Don't skip levels.
          </p>
        </div>
      </div>
    </div>
  ),
}
