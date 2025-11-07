import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@/design-system/tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const meta: Meta = {
  title: 'Foundation/Responsive Design',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

/**
 * Breakpoints define responsive viewport sizes
 */
export const Breakpoints: Story = {
  render: () => {
    const { breakpoints, breakpointValues } = tokens.breakpoints;

    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Responsive Breakpoints</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Mobile-first breakpoints for building responsive layouts. Styles apply from each
            breakpoint size upward.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(breakpoints).map(([name, value]) => {
            const numValue = breakpointValues[name as keyof typeof breakpointValues];
            const description =
              name === 'xs'
                ? 'Mobile phones (portrait) - Default, no prefix needed'
                : name === 'sm'
                ? 'Mobile phones (landscape), small tablets - Use sm: prefix'
                : name === 'md'
                ? 'Tablets (portrait), large phones - Use md: prefix'
                : name === 'lg'
                ? 'Tablets (landscape), small desktops - Use lg: prefix'
                : name === 'xl'
                ? 'Desktops, large screens - Use xl: prefix'
                : 'Large desktops, wide screens - Use 2xl: prefix';

            return (
              <Card key={name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">{name.toUpperCase()}</span>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {value} ({numValue}px)
                    </code>
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Tailwind prefix:</span>
                      <code className="ml-2 text-sm font-mono bg-muted px-2 py-1 rounded">
                        {name === 'xs' ? '(default)' : `${name}:`}
                      </code>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Media query:</span>
                      <code className="ml-2 text-sm font-mono bg-muted px-2 py-1 rounded text-xs">
                        @media (min-width: {value})
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
            <CardDescription>
              Apply different styles at each breakpoint using responsive prefixes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`{/* Mobile-first approach */}
<div className="
  grid-cols-1       {/* Mobile: 1 column */}
  sm:grid-cols-2    {/* Tablet: 2 columns */}
  md:grid-cols-3    {/* Desktop: 3 columns */}
  lg:grid-cols-4    {/* Large: 4 columns */}
  gap-4
  p-4
  md:p-6
  lg:p-8
">
  {/* Content */}
</div>`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};

/**
 * Grid system for responsive layouts
 */
export const GridSystem: Story = {
  render: () => {
    const { gridColumns, gridGutters, gridTemplates } = tokens.grid;

    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Grid System</h1>
          <p className="text-muted-foreground text-lg mb-6">
            12-column responsive grid system with flexible gutters and pre-defined layouts.
          </p>
        </div>

        {/* 12-column grid visualization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>12-Column Grid</CardTitle>
            <CardDescription>
              Our grid system is based on 12 columns for maximum flexibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2 mb-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-primary/20 border border-primary p-4 text-center text-xs">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Each column is 1/12 of the total width
            </div>
          </CardContent>
        </Card>

        {/* Column spans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Column Spans</CardTitle>
            <CardDescription>Pre-defined spans for common layouts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(gridColumns.spans).map(([name, cols]) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {cols}/{gridColumns.total} columns ({Math.round((cols / gridColumns.total) * 100)}%)
                  </code>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 ${
                        i < cols ? 'bg-primary' : 'bg-muted'
                      } border border-border`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Grid templates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pre-defined Grid Templates</CardTitle>
            <CardDescription>Common layout patterns ready to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(gridTemplates).map(([name, template]) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-sm text-muted-foreground">{template.description}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  {Object.entries(template)
                    .filter(([k]) => k !== 'description')
                    .map(([key, cols]) => (
                      <div
                        key={key}
                        style={{ gridColumn: `span ${cols}` }}
                        className="bg-primary/20 border-2 border-primary p-4 text-center text-sm font-medium"
                      >
                        {key} ({cols} cols)
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gutters */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Gutters</CardTitle>
            <CardDescription>
              Gap sizes that increase with viewport size for optimal spacing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(gridGutters).map(([breakpoint, size]) => (
                <div key={breakpoint} className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">{breakpoint.toUpperCase()}</span>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{size}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

/**
 * Live responsive demo
 */
export const ResponsiveDemo: Story = {
  render: () => {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Responsive Layout Demo</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Resize your browser window to see the layout adapt at different breakpoints
          </p>
        </div>

        {/* Responsive card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">Card {i + 1}</CardTitle>
                <CardDescription>
                  {/* Show different text at different breakpoints */}
                  <span className="sm:hidden">Mobile (1 col)</span>
                  <span className="hidden sm:block lg:hidden">Tablet (2 cols)</span>
                  <span className="hidden lg:block xl:hidden">Desktop (3 cols)</span>
                  <span className="hidden xl:block">Wide (4 cols)</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  This card adapts to viewport size using responsive grid columns
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Responsive text sizes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Responsive Typography</CardTitle>
            <CardDescription>Text scales with viewport size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm md:text-base lg:text-lg">
                <strong>Body text:</strong> Increases from sm → base → lg
              </div>
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold">
                <strong>Heading:</strong> Scales from lg → xl → 2xl → 3xl
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive padding */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Spacing</CardTitle>
            <CardDescription>Padding and margins adapt to screen size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-2 md:p-4 lg:p-6 xl:p-8 bg-muted rounded-lg">
              <div className="bg-background p-4 rounded">
                This box has responsive padding: p-2 → p-4 → p-6 → p-8
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakpoint indicator */}
        <div className="fixed bottom-4 right-4 bg-background border-2 border-primary rounded-lg p-4 shadow-lg">
          <div className="text-sm font-medium mb-2">Current Breakpoint:</div>
          <div className="text-2xl font-bold">
            <span className="sm:hidden">XS</span>
            <span className="hidden sm:block md:hidden">SM</span>
            <span className="hidden md:block lg:hidden">MD</span>
            <span className="hidden lg:block xl:hidden">LG</span>
            <span className="hidden xl:block 2xl:hidden">XL</span>
            <span className="hidden 2xl:block">2XL</span>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Container widths
 */
export const Containers: Story = {
  render: () => {
    const { containerMaxWidths, containerPadding } = tokens.grid;

    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-4">Container System</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Max-width containers with responsive padding prevent content from becoming too wide
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(containerMaxWidths).map(([name, width]) => (
            <div key={name}>
              <div className="max-w-6xl mx-auto mb-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold uppercase">{name}</span>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{width}</code>
                </div>
              </div>
              <div
                style={{ maxWidth: width }}
                className="mx-auto bg-primary/10 border-2 border-primary p-4 rounded"
              >
                <div className="text-sm text-muted-foreground">
                  This container has a max-width of {width}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card className="max-w-6xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Responsive Padding</CardTitle>
            <CardDescription>
              Containers have responsive padding to maintain comfortable margins on all devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(containerPadding).map(([breakpoint, padding]) => (
                <div key={breakpoint} className="flex items-center justify-between p-4 border rounded">
                  <span className="font-medium">{breakpoint.toUpperCase()}</span>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{padding}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

/**
 * Best practices for responsive design
 */
export const BestPractices: Story = {
  render: () => {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Responsive Design Best Practices</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Guidelines for creating effective responsive layouts
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Mobile-First Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Start with mobile styles and progressively enhance for larger screens:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{`{/* ✅ Good: Mobile-first */}
<div className="text-sm md:text-base lg:text-lg">

{/* ❌ Avoid: Desktop-first */}
<div className="text-lg md:text-base sm:text-sm">`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use Semantic Breakpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Choose breakpoints based on content needs, not specific devices:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Use sm: for small tablets and landscape phones</li>
                <li>Use md: when content needs more breathing room</li>
                <li>Use lg: for desktop-optimized layouts</li>
                <li>Use xl: and 2xl: for large displays only when necessary</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Test at All Breakpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Ensure layouts work well at every breakpoint:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Test at 375px (mobile), 768px (tablet), 1280px (desktop)</li>
                <li>Check between breakpoints (e.g., 700px, 900px)</li>
                <li>Verify touch targets are at least 44x44px on mobile</li>
                <li>Ensure text remains readable at all sizes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Optimize for Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Make interactive elements touch-friendly on mobile:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Minimum 44x44px touch targets</li>
                <li>Add spacing between clickable elements</li>
                <li>Use larger padding on mobile buttons</li>
                <li>Avoid hover-only interactions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Consider Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Optimize assets and loading for mobile devices:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Use responsive images (srcset, sizes)</li>
                <li>Load larger assets only on desktop</li>
                <li>Minimize initial bundle size</li>
                <li>Consider reduced motion preferences</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};
