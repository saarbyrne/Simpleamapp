import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@/design-system/tokens/colors';

/**
 * Design System Colors
 *
 * All colors are defined using OKLCH color space for better perceptual uniformity.
 * Colors automatically adapt to light and dark modes.
 */
const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const ColorSwatch = ({ name, cssVar, description }: { name: string; cssVar: string; description?: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
    <div
      className="w-16 h-16 rounded-lg shadow-sm border border-border"
      style={{ backgroundColor: `hsl(var(--${cssVar}))` }}
    />
    <div className="flex-1">
      <h4 className="font-semibold text-sm">{name}</h4>
      <code className="text-xs text-muted-foreground">--{cssVar}</code>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
    <button
      onClick={() => navigator.clipboard.writeText(`var(--${cssVar})`)}
      className="px-3 py-1 text-xs bg-secondary hover:bg-secondary-hover rounded-md"
    >
      Copy
    </button>
  </div>
);

export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Semantic Colors</h2>
        <p className="text-muted-foreground mb-6">
          Core semantic colors that define the visual hierarchy and meaning throughout the application.
        </p>
      </div>

      <div className="grid gap-4">
        <ColorSwatch
          name="Primary"
          cssVar="primary"
          description="Main brand color for primary actions and emphasis"
        />
        <ColorSwatch
          name="Primary Foreground"
          cssVar="primary-foreground"
          description="Text color on primary backgrounds"
        />
        <ColorSwatch
          name="Secondary"
          cssVar="secondary"
          description="Secondary UI elements and subtle accents"
        />
        <ColorSwatch
          name="Secondary Foreground"
          cssVar="secondary-foreground"
          description="Text color on secondary backgrounds"
        />
        <ColorSwatch
          name="Destructive"
          cssVar="destructive"
          description="Dangerous or destructive actions (delete, remove)"
        />
        <ColorSwatch
          name="Destructive Foreground"
          cssVar="destructive-foreground"
          description="Text color on destructive backgrounds"
        />
        <ColorSwatch
          name="Success"
          cssVar="success"
          description="Successful states and positive actions"
        />
        <ColorSwatch
          name="Warning"
          cssVar="warning"
          description="Warning states and cautionary messages"
        />
        <ColorSwatch
          name="Info"
          cssVar="info"
          description="Informational states and neutral messages"
        />
      </div>
    </div>
  ),
};

export const UIColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">UI Colors</h2>
        <p className="text-muted-foreground mb-6">
          Foundation colors for backgrounds, text, and borders.
        </p>
      </div>

      <div className="grid gap-4">
        <ColorSwatch
          name="Background"
          cssVar="background"
          description="Main page background"
        />
        <ColorSwatch
          name="Foreground"
          cssVar="foreground"
          description="Main text color"
        />
        <ColorSwatch
          name="Card"
          cssVar="card"
          description="Card and panel backgrounds"
        />
        <ColorSwatch
          name="Card Foreground"
          cssVar="card-foreground"
          description="Text on cards"
        />
        <ColorSwatch
          name="Muted"
          cssVar="muted"
          description="Subtle backgrounds for secondary content"
        />
        <ColorSwatch
          name="Muted Foreground"
          cssVar="muted-foreground"
          description="Dimmed text for less important content"
        />
        <ColorSwatch
          name="Border"
          cssVar="border"
          description="Border and divider color"
        />
        <ColorSwatch
          name="Input"
          cssVar="input"
          description="Input field borders"
        />
        <ColorSwatch
          name="Ring"
          cssVar="ring"
          description="Focus ring color"
        />
      </div>
    </div>
  ),
};

export const MarketingColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Marketing Brand Colors</h2>
        <p className="text-muted-foreground mb-6">
          Brand colors specifically for marketing pages and external-facing content.
        </p>
      </div>

      <div className="grid gap-4">
        <ColorSwatch
          name="Brand Primary"
          cssVar="marketing-brand-primary"
          description="Deep blue brand color (#142978)"
        />
        <ColorSwatch
          name="Brand Dark"
          cssVar="marketing-brand-dark"
          description="Dark text and backgrounds (#1E1E1E)"
        />
        <ColorSwatch
          name="Brand Light"
          cssVar="marketing-brand-light"
          description="Light gray backgrounds (#F5F5F5)"
        />
        <ColorSwatch
          name="Brand Accent"
          cssVar="marketing-brand-accent"
          description="Orange accent color (#FF6A1F)"
        />
      </div>

      <div className="mt-8 p-6 rounded-lg bg-marketing-brand-light">
        <p className="text-marketing-brand-dark font-semibold mb-2">Example Usage:</p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-marketing-brand-primary text-white rounded-md font-semibold hover:opacity-90">
            Get Started
          </button>
          <button className="px-6 py-3 bg-marketing-brand-accent text-white rounded-md font-semibold hover:opacity-90">
            Learn More
          </button>
        </div>
      </div>
    </div>
  ),
};

export const ColorUsageGuide: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Color Usage Guide</h2>
        <p className="text-muted-foreground">
          Best practices for using design system colors.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-lg border border-success bg-success/10">
          <h3 className="font-semibold text-success mb-2">✅ Do</h3>
          <ul className="space-y-2 text-sm">
            <li>• Use semantic color classes: <code className="bg-background px-1 rounded">bg-primary</code>, <code className="bg-background px-1 rounded">text-foreground</code></li>
            <li>• Always pair colors with their foreground variants for proper contrast</li>
            <li>• Use marketing colors only on marketing pages</li>
            <li>• Test colors in both light and dark modes</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
          <h3 className="font-semibold text-destructive mb-2">❌ Don't</h3>
          <ul className="space-y-2 text-sm">
            <li>• Never hardcode hex colors: <code className="bg-background px-1 rounded line-through">bg-[#142978]</code></li>
            <li>• Don't use Tailwind color scale: <code className="bg-background px-1 rounded line-through">bg-blue-500</code></li>
            <li>• Avoid mixing marketing and app UI colors</li>
            <li>• Don't use inline styles for colors</li>
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-muted">
        <h3 className="font-semibold mb-4">Example: Proper Color Usage</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="p-3 bg-background rounded">
            <span className="text-muted-foreground">// ✅ Good</span><br />
            <span className="text-foreground">&lt;Button className="</span>
            <span className="text-primary">bg-primary text-primary-foreground</span>
            <span className="text-foreground">"&gt;</span>
          </div>
          <div className="p-3 bg-background rounded">
            <span className="text-muted-foreground">// ❌ Bad</span><br />
            <span className="text-foreground">&lt;Button className="</span>
            <span className="text-destructive line-through">bg-[#FF0000] text-white</span>
            <span className="text-foreground">"&gt;</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
