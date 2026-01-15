import type { Meta, StoryObj } from '@storybook/react';

/**
 * Design System Typography
 *
 * Typography scale and font family definitions for consistent text styling across the application.
 */
const meta: Meta = {
  title: 'Design Tokens/Typography',
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const TypeSample = ({ className, label, cssClass }: { className: string; label: string; cssClass: string }) => (
  <div className="p-6 rounded-lg border border-border mb-4">
    <div className={className}>
      The quick brown fox jumps over the lazy dog
    </div>
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span className="font-medium">{label}</span>
      <code className="bg-muted px-2 py-1 rounded text-xs">{cssClass}</code>
    </div>
  </div>
);

export const TextScale: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Text Scale</h2>
        <p className="text-muted-foreground mb-6">
          Typographic scale using Tailwind text classes for consistent sizing.
        </p>
      </div>

      <TypeSample
        className="text-xs"
        label="Extra Small"
        cssClass="text-xs"
      />
      <TypeSample
        className="text-sm"
        label="Small"
        cssClass="text-sm"
      />
      <TypeSample
        className="text-base"
        label="Base (Default)"
        cssClass="text-base"
      />
      <TypeSample
        className="text-lg"
        label="Large"
        cssClass="text-lg"
      />
      <TypeSample
        className="text-xl"
        label="Extra Large"
        cssClass="text-xl"
      />
      <TypeSample
        className="text-2xl"
        label="2X Large"
        cssClass="text-2xl"
      />
      <TypeSample
        className="text-3xl"
        label="3X Large"
        cssClass="text-3xl"
      />
      <TypeSample
        className="text-4xl"
        label="4X Large"
        cssClass="text-4xl"
      />
      <TypeSample
        className="text-5xl"
        label="5X Large"
        cssClass="text-5xl"
      />
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Font Weights</h2>
        <p className="text-muted-foreground mb-6">
          Font weight variations for different levels of emphasis.
        </p>
      </div>

      <TypeSample
        className="text-xl font-normal"
        label="Normal (400)"
        cssClass="font-normal"
      />
      <TypeSample
        className="text-xl font-medium"
        label="Medium (500)"
        cssClass="font-medium"
      />
      <TypeSample
        className="text-xl font-semibold"
        label="Semibold (600)"
        cssClass="font-semibold"
      />
      <TypeSample
        className="text-xl font-bold"
        label="Bold (700)"
        cssClass="font-bold"
      />
      <TypeSample
        className="text-xl font-extrabold"
        label="Extra Bold (800)"
        cssClass="font-extrabold"
      />
    </div>
  ),
};

export const HeadingExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Heading Hierarchy</h2>
        <p className="text-muted-foreground mb-6">
          Recommended heading styles for content hierarchy.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-lg bg-muted">
          <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
          <code className="text-sm">text-4xl font-bold</code>
          <p className="mt-4 text-muted-foreground">Used for page titles and main headings</p>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <h2 className="text-3xl font-bold mb-2">Heading 2</h2>
          <code className="text-sm">text-3xl font-bold</code>
          <p className="mt-4 text-muted-foreground">Used for section headings</p>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
          <code className="text-sm">text-2xl font-semibold</code>
          <p className="mt-4 text-muted-foreground">Used for subsection headings</p>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <h4 className="text-xl font-semibold mb-2">Heading 4</h4>
          <code className="text-sm">text-xl font-semibold</code>
          <p className="mt-4 text-muted-foreground">Used for card titles and component headings</p>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <h5 className="text-lg font-medium mb-2">Heading 5</h5>
          <code className="text-sm">text-lg font-medium</code>
          <p className="mt-4 text-muted-foreground">Used for small headings and labels</p>
        </div>
      </div>
    </div>
  ),
};

export const BodyText: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Body Text</h2>
        <p className="text-muted-foreground mb-6">
          Standard text styles for body content.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-muted">
          <p className="text-lg mb-4">
            Large body text is used for introductory paragraphs or important content that needs emphasis. It provides better readability for key information.
          </p>
          <code className="text-sm">text-lg</code>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <p className="text-base mb-4">
            Base (default) body text is the standard text size used throughout the application. It offers optimal readability for most content while maintaining a comfortable reading experience.
          </p>
          <code className="text-sm">text-base (default)</code>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <p className="text-sm mb-4">
            Small text is used for secondary information, captions, or metadata. It should be used sparingly and only when space is limited or the information is supplementary.
          </p>
          <code className="text-sm">text-sm</code>
        </div>

        <div className="p-6 rounded-lg bg-muted">
          <p className="text-xs mb-4">
            Extra small text is reserved for timestamps, helper text, or extremely compact interfaces. Use with caution as it may impact accessibility.
          </p>
          <code className="text-sm">text-xs</code>
        </div>
      </div>
    </div>
  ),
};

export const TextColors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Text Colors</h2>
        <p className="text-muted-foreground mb-6">
          Semantic text color utilities for different contexts.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-lg border border-border">
          <p className="text-foreground text-lg font-medium mb-2">Primary Text</p>
          <code className="text-sm text-muted-foreground">text-foreground</code>
        </div>

        <div className="p-6 rounded-lg border border-border">
          <p className="text-muted-foreground text-lg font-medium mb-2">Muted Text</p>
          <code className="text-sm text-muted-foreground">text-muted-foreground</code>
        </div>

        <div className="p-6 rounded-lg border border-border">
          <p className="text-primary text-lg font-medium mb-2">Primary Brand Text</p>
          <code className="text-sm text-muted-foreground">text-primary</code>
        </div>

        <div className="p-6 rounded-lg border border-border">
          <p className="text-destructive text-lg font-medium mb-2">Destructive Text</p>
          <code className="text-sm text-muted-foreground">text-destructive</code>
        </div>

        <div className="p-6 rounded-lg border border-border">
          <p className="text-success text-lg font-medium mb-2">Success Text</p>
          <code className="text-sm text-muted-foreground">text-success</code>
        </div>

        <div className="p-6 rounded-lg border border-border">
          <p className="text-warning text-lg font-medium mb-2">Warning Text</p>
          <code className="text-sm text-muted-foreground">text-warning</code>
        </div>
      </div>
    </div>
  ),
};

export const TypographyUsageGuide: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography Usage Guide</h2>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-lg border border-success bg-success/10">
          <h3 className="font-semibold text-success mb-2">✅ Do</h3>
          <ul className="space-y-2 text-sm">
            <li>• Use Tailwind text classes for all typography</li>
            <li>• Maintain consistent heading hierarchy (h1 → h2 → h3)</li>
            <li>• Use semantic text colors (text-foreground, text-muted-foreground)</li>
            <li>• Consider line-height for better readability (leading- utilities)</li>
            <li>• Test text contrast ratios for accessibility</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
          <h3 className="font-semibold text-destructive mb-2">❌ Don't</h3>
          <ul className="space-y-2 text-sm">
            <li>• Never hardcode font sizes: <code className="bg-background px-1 rounded line-through">fontSize: '14px'</code></li>
            <li>• Don't skip heading levels (h1 → h3)</li>
            <li>• Avoid using too many font weights in one interface</li>
            <li>• Don't use text smaller than text-xs for body content</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
