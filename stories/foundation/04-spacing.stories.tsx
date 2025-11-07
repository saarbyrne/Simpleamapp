import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@/design-system/tokens'

/**
 * # Spacing System
 *
 * Our spacing system provides consistent, predictable spacing across all
 * components and layouts using a modular scale.
 *
 * ## Principles
 *
 * - **8px base unit** - All spacing is a multiple of 8
 * - **Semantic naming** - Named by use case (gap, padding, margin)
 * - **Consistent rhythm** - Creates visual harmony
 * - **Predictable scale** - Easy to remember and apply
 *
 * ## Usage
 *
 * ```tsx
 * import { tokens } from '@/design-system/tokens'
 *
 * // Padding
 * <div style={{ padding: tokens.spacing.spacing.md }}>Content</div>
 *
 * // Gap
 * <div style={{ gap: tokens.spacing.gap.md }}>Flex items</div>
 *
 * // Margin
 * <div style={{ marginBottom: tokens.spacing.spacing.lg }}>Content</div>
 * ```
 */
const meta: Meta = {
  title: 'Foundation/Tokens/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Spacing tokens for consistent layout and rhythm.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const SpacingDemo = ({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description?: string
}) => (
  <div className="flex items-center gap-4 p-4 border rounded-lg">
    <div className="flex-shrink-0 w-32">
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs text-muted-foreground font-mono">{value}</div>
    </div>
    <div className="flex items-center gap-2 flex-1">
      <div
        className="bg-primary/20 border-2 border-primary rounded"
        style={{ width: value, height: '32px' }}
      />
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </div>
  </div>
)

/**
 * Spacing scale for padding, margin, and gaps.
 */
export const SpacingScale: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Spacing Scale</h2>
        <p className="text-muted-foreground mb-6">
          All spacing values in the system, based on 8px increments
        </p>
      </div>

      <SpacingDemo
        label="xs"
        value={tokens.spacing.spacing.xs}
        description="Tight spacing for compact UIs"
      />
      <SpacingDemo
        label="sm"
        value={tokens.spacing.spacing.sm}
        description="Small spacing for related items"
      />
      <SpacingDemo
        label="md"
        value={tokens.spacing.spacing.md}
        description="Default spacing for most components"
      />
      <SpacingDemo
        label="lg"
        value={tokens.spacing.spacing.lg}
        description="Large spacing for section separation"
      />
      <SpacingDemo
        label="xl"
        value={tokens.spacing.spacing.xl}
        description="Extra large for major sections"
      />
      <SpacingDemo
        label="2xl"
        value={tokens.spacing.spacing['2xl']}
        description="Double extra large for page-level spacing"
      />
      <SpacingDemo
        label="3xl"
        value={tokens.spacing.spacing['3xl']}
        description="Maximum spacing for hero sections"
      />
    </div>
  ),
}

/**
 * Gap spacing for flex and grid layouts.
 */
export const Gaps: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gap Spacing</h2>
        <p className="text-muted-foreground mb-6">
          Spacing between flex and grid items
        </p>
      </div>

      <SpacingDemo label="gap.xs" value={tokens.spacing.gap.xs} />
      <SpacingDemo label="gap.sm" value={tokens.spacing.gap.sm} />
      <SpacingDemo label="gap.md" value={tokens.spacing.gap.md} />
      <SpacingDemo label="gap.lg" value={tokens.spacing.gap.lg} />
      <SpacingDemo label="gap.xl" value={tokens.spacing.gap.xl} />
    </div>
  ),
}

/**
 * Usage examples showing spacing in real layouts.
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage Examples</h2>
        <p className="text-muted-foreground mb-6">
          Spacing in common UI patterns
        </p>
      </div>

      {/* Card with padding */}
      <div>
        <h3 className="font-semibold mb-3">Card Padding</h3>
        <div
          className="border rounded-lg bg-card"
          style={{ padding: tokens.spacing.spacing.lg }}
        >
          <div
            className="text-lg font-semibold"
            style={{ marginBottom: tokens.spacing.spacing.sm }}
          >
            Player Wellness Report
          </div>
          <p className="text-muted-foreground text-sm">
            Weekly summary of team wellness metrics and recommendations
          </p>
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          padding: {tokens.spacing.spacing.lg}
        </div>
      </div>

      {/* Stack with gaps */}
      <div>
        <h3 className="font-semibold mb-3">Vertical Stack (Gap SM)</h3>
        <div
          className="flex flex-col border rounded-lg p-4"
          style={{ gap: tokens.spacing.gap.sm }}
        >
          <div className="p-3 bg-muted rounded">Item 1</div>
          <div className="p-3 bg-muted rounded">Item 2</div>
          <div className="p-3 bg-muted rounded">Item 3</div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          gap: {tokens.spacing.gap.sm}
        </div>
      </div>

      {/* Grid with gap */}
      <div>
        <h3 className="font-semibold mb-3">Grid Layout (Gap MD)</h3>
        <div
          className="grid grid-cols-3 border rounded-lg p-4"
          style={{ gap: tokens.spacing.gap.md }}
        >
          <div className="p-4 bg-muted rounded text-center">1</div>
          <div className="p-4 bg-muted rounded text-center">2</div>
          <div className="p-4 bg-muted rounded text-center">3</div>
          <div className="p-4 bg-muted rounded text-center">4</div>
          <div className="p-4 bg-muted rounded text-center">5</div>
          <div className="p-4 bg-muted rounded text-center">6</div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          gap: {tokens.spacing.gap.md}
        </div>
      </div>

      {/* Button group */}
      <div>
        <h3 className="font-semibold mb-3">Button Group (Gap SM)</h3>
        <div
          className="flex border rounded-lg p-4"
          style={{ gap: tokens.spacing.gap.sm }}
        >
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Save
          </button>
          <button className="px-4 py-2 border rounded">Cancel</button>
          <button className="px-4 py-2 border rounded">Reset</button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          gap: {tokens.spacing.gap.sm}
        </div>
      </div>

      {/* Section spacing */}
      <div>
        <h3 className="font-semibold mb-3">Section Spacing</h3>
        <div className="border rounded-lg p-4 space-y-6">
          <div>
            <div
              className="text-lg font-semibold"
              style={{ marginBottom: tokens.spacing.spacing.md }}
            >
              Section 1
            </div>
            <p className="text-muted-foreground">
              Content with medium bottom margin
            </p>
          </div>
          <div
            style={{ borderTop: '1px solid var(--border)' }}
            className="pt-6"
          >
            <div
              className="text-lg font-semibold"
              style={{ marginBottom: tokens.spacing.spacing.md }}
            >
              Section 2
            </div>
            <p className="text-muted-foreground">
              Separated by 2xl (3rem) spacing
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-mono">
          gap between sections: {tokens.spacing.spacing['2xl']}
        </div>
      </div>

      {/* Form fields */}
      <div>
        <h3 className="font-semibold mb-3">Form Field Spacing</h3>
        <div className="border rounded-lg p-6">
          <div style={{ marginBottom: tokens.spacing.spacing.md }}>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ marginBottom: tokens.spacing.spacing.xs }}
            >
              Player Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter name"
            />
          </div>
          <div style={{ marginBottom: tokens.spacing.spacing.md }}>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ marginBottom: tokens.spacing.spacing.xs }}
            >
              Position
            </label>
            <select className="w-full px-3 py-2 border rounded">
              <option>Goalkeeper</option>
              <option>Defender</option>
              <option>Midfielder</option>
              <option>Forward</option>
            </select>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            field margin: {tokens.spacing.spacing.md}
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Spacing guidelines and best practices.
 */
export const Guidelines: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Spacing Guidelines</h2>
        <p className="text-muted-foreground mb-6">
          Best practices for using spacing tokens
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Use tokens, not hardcoded values</h3>
          <div className="space-y-2 text-sm mt-3">
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded font-mono text-xs">
              ✅ padding: tokens.spacing.spacing.md
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950 rounded font-mono text-xs">
              ❌ padding: '16px'
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">
            ✅ Use consistent spacing within components
          </h3>
          <p className="text-sm text-muted-foreground">
            All items in a list or grid should use the same gap value for
            visual consistency.
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">
            ✅ Increase spacing between unrelated sections
          </h3>
          <p className="text-sm text-muted-foreground">
            Use larger spacing (lg, xl, 2xl) to separate distinct sections and
            create clear visual hierarchy.
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">
            ✅ Use gap for flex/grid, margin for block spacing
          </h3>
          <p className="text-sm text-muted-foreground">
            Gap tokens for flex and grid layouts. Spacing tokens for padding
            and margin.
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">
            ✅ Maintain optical balance, not mathematical precision
          </h3>
          <p className="text-sm text-muted-foreground">
            Sometimes you need to adjust spacing visually. Use the closest
            token value that looks right.
          </p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Quick reference showing all spacing values.
 */
export const QuickReference: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground mb-6">
          All spacing tokens at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold">Spacing (Padding & Margin)</h3>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="pb-2">Token</th>
                <th className="pb-2">Value</th>
                <th className="pb-2">Pixels</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2">spacing.xs</td>
                <td>{tokens.spacing.spacing.xs}</td>
                <td className="text-muted-foreground">8px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">spacing.sm</td>
                <td>{tokens.spacing.spacing.sm}</td>
                <td className="text-muted-foreground">12px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">spacing.md</td>
                <td>{tokens.spacing.spacing.md}</td>
                <td className="text-muted-foreground">16px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">spacing.lg</td>
                <td>{tokens.spacing.spacing.lg}</td>
                <td className="text-muted-foreground">24px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">spacing.xl</td>
                <td>{tokens.spacing.spacing.xl}</td>
                <td className="text-muted-foreground">32px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">spacing.2xl</td>
                <td>{tokens.spacing.spacing['2xl']}</td>
                <td className="text-muted-foreground">48px</td>
              </tr>
              <tr>
                <td className="py-2">spacing.3xl</td>
                <td>{tokens.spacing.spacing['3xl']}</td>
                <td className="text-muted-foreground">64px</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Gap (Flex & Grid)</h3>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="pb-2">Token</th>
                <th className="pb-2">Value</th>
                <th className="pb-2">Pixels</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2">gap.xs</td>
                <td>{tokens.spacing.gap.xs}</td>
                <td className="text-muted-foreground">4px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">gap.sm</td>
                <td>{tokens.spacing.gap.sm}</td>
                <td className="text-muted-foreground">8px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">gap.md</td>
                <td>{tokens.spacing.gap.md}</td>
                <td className="text-muted-foreground">12px</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">gap.lg</td>
                <td>{tokens.spacing.gap.lg}</td>
                <td className="text-muted-foreground">16px</td>
              </tr>
              <tr>
                <td className="py-2">gap.xl</td>
                <td>{tokens.spacing.gap.xl}</td>
                <td className="text-muted-foreground">24px</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
}
