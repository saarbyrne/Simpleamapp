import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';
import {
  statusColors,
  passwordStrengthColors,
  featureStatusColors,
  billingStatusColors,
} from '@/design-system/tokens/status-colors';

const meta: Meta = {
  title: 'Design Tokens/Status Colors',
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const PlayerStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Player Status Colors</h2>
      <p className="text-muted-foreground mb-6">
        Centralized status colors for player availability states.
      </p>

      <div className="grid gap-4">
        {Object.entries(statusColors).map(([status, classes]) => (
          <div key={status} className="flex items-center gap-4 p-4 rounded-lg border border-border">
            <Badge className={classes}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <code className="text-sm text-muted-foreground flex-1">{classes}</code>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-lg bg-muted">
        <h3 className="font-semibold mb-4">Usage Example</h3>
        <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto">
{`import { statusColors } from '@/design-system/tokens/status-colors'

<Badge className={statusColors.active}>Active</Badge>
<Badge className={statusColors.injured}>Injured</Badge>`}
        </pre>
      </div>
    </div>
  ),
};

export const PasswordStrength: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Password Strength Colors</h2>
      <p className="text-muted-foreground mb-6">
        Semantic colors for password strength indicators.
      </p>

      <div className="grid gap-4">
        {Object.entries(passwordStrengthColors).map(([strength, colors]) => (
          <div key={strength} className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-4 mb-3">
              <span className="font-semibold capitalize">{strength}</span>
              <span className={`${colors.text} text-sm`}>
                {strength.charAt(0).toUpperCase() + strength.slice(1)} Password
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bg}`}
                style={{ width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }}
              />
            </div>
            <code className="text-xs text-muted-foreground mt-2 block">
              text: {colors.text}, bg: {colors.bg}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FeatureStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Feature Status Colors</h2>
      <p className="text-muted-foreground mb-6">
        Colors for feature toggle states in admin interfaces.
      </p>

      <div className="grid gap-4">
        {Object.entries(featureStatusColors).map(([status, colorClass]) => (
          <div key={status} className="flex items-center gap-4 p-4 rounded-lg border border-border">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
              {status === 'enabled' ? '✓' : status === 'disabled' ? '✗' : status === 'beta' ? 'β' : '!'}
            </div>
            <div className="flex-1">
              <span className="font-semibold capitalize">{status}</span>
            </div>
            <code className="text-sm text-muted-foreground">{colorClass}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const BillingStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Billing Status Colors</h2>
      <p className="text-muted-foreground mb-6">
        Status colors for subscription and billing states.
      </p>

      <div className="grid gap-4">
        {Object.entries(billingStatusColors).map(([status, classes]) => (
          <div key={status} className="p-6 rounded-lg border">
            <div className={`inline-block px-4 py-2 rounded-lg ${classes}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)} Subscription
            </div>
            <code className="text-sm text-muted-foreground block mt-3">{classes}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const UsageGuide: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Status Colors Usage Guide</h2>

      <div className="p-6 rounded-lg border border-success bg-success/10">
        <h3 className="font-semibold text-success mb-2">✅ Do</h3>
        <ul className="space-y-2 text-sm">
          <li>• Import status colors from <code className="bg-background px-1 rounded">@/design-system/tokens/status-colors</code></li>
          <li>• Use semantic names that describe meaning, not appearance</li>
          <li>• Keep status colors consistent across similar contexts</li>
          <li>• Test color combinations for accessibility</li>
        </ul>
      </div>

      <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
        <h3 className="font-semibold text-destructive mb-2">❌ Don't</h3>
        <ul className="space-y-2 text-sm">
          <li>• Don't hardcode status colors inline</li>
          <li>• Don't duplicate status color definitions</li>
          <li>• Don't use status colors inconsistently</li>
          <li>• Don't forget to update both light and dark mode variants</li>
        </ul>
      </div>
    </div>
  ),
};
