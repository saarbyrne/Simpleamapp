import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const SpacingSwatch = ({ value, label }: { value: string; label: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-lg border border-border mb-3">
    <div className="flex items-center gap-2 flex-1">
      <div className="bg-primary h-8" style={{ width: `${value}` }} />
      <span className="font-mono text-sm">{value}</span>
    </div>
    <code className="text-sm text-muted-foreground">{label}</code>
  </div>
);

export const SpacingScale: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Spacing Scale</h2>
      <p className="text-muted-foreground mb-6">
        Use Tailwind spacing scale (p-, m-, gap-) for consistent spacing.
      </p>

      <SpacingSwatch value="0.25rem" label="p-1 / m-1 / gap-1" />
      <SpacingSwatch value="0.5rem" label="p-2 / m-2 / gap-2" />
      <SpacingSwatch value="0.75rem" label="p-3 / m-3 / gap-3" />
      <SpacingSwatch value="1rem" label="p-4 / m-4 / gap-4" />
      <SpacingSwatch value="1.5rem" label="p-6 / m-6 / gap-6" />
      <SpacingSwatch value="2rem" label="p-8 / m-8 / gap-8" />
      <SpacingSwatch value="3rem" label="p-12 / m-12 / gap-12" />
      <SpacingSwatch value="4rem" label="p-16 / m-16 / gap-16" />
    </div>
  ),
};

export const SpacingPatterns: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Common Spacing Patterns</h2>

      <div className="p-6 rounded-lg bg-muted">
        <h3 className="font-semibold mb-4">Card Padding</h3>
        <div className="p-4 bg-card border border-border rounded-lg">
          <code>p-4</code> - Standard card padding
        </div>
      </div>

      <div className="p-6 rounded-lg bg-muted">
        <h3 className="font-semibold mb-4">Stack Spacing</h3>
        <div className="space-y-4 bg-card border border-border rounded-lg p-4">
          <div className="p-3 bg-muted rounded">Item 1</div>
          <div className="p-3 bg-muted rounded">Item 2</div>
          <div className="p-3 bg-muted rounded">Item 3</div>
        </div>
        <code className="block mt-2">space-y-4</code>
      </div>

      <div className="p-6 rounded-lg bg-muted">
        <h3 className="font-semibold mb-4">Grid Gap</h3>
        <div className="grid grid-cols-3 gap-4 bg-card border border-border rounded-lg p-4">
          <div className="p-3 bg-muted rounded">1</div>
          <div className="p-3 bg-muted rounded">2</div>
          <div className="p-3 bg-muted rounded">3</div>
        </div>
        <code className="block mt-2">gap-4</code>
      </div>
    </div>
  ),
};
