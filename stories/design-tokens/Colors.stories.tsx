import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@/design-system/tokens/colors';
import { useEffect, useState } from 'react';

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

// Hook to get current theme
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    // Initial theme
    setTheme(root.classList.contains('dark') ? 'dark' : 'light');

    return () => observer.disconnect();
  }, []);

  return theme;
};

// Get color value for current theme
const getColorValue = (colorKey: keyof typeof colors, subKey?: string) => {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const colorObj = colors[colorKey];

  if (subKey && typeof colorObj === 'object' && 'light' in colorObj) {
    return colorObj[theme]?.[subKey] || colorObj.light?.[subKey] || colorObj[subKey as keyof typeof colorObj];
  }

  if (typeof colorObj === 'object' && 'light' in colorObj) {
    return colorObj[theme] || colorObj.light;
  }

  return colorObj;
};

const ColorSwatch = ({ name, colorKey, subKey, description }: {
  name: string;
  colorKey: keyof typeof colors;
  subKey?: string;
  description?: string;
}) => {
  const [currentColor, setCurrentColor] = useState('');

  useEffect(() => {
    const updateColor = () => {
      const colorValue = getColorValue(colorKey, subKey);
      setCurrentColor(colorValue);
    };

    updateColor();

    // Listen for theme changes
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [colorKey, subKey]);

  const cssVar = subKey ? `${colorKey}-${subKey}` : colorKey;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
      <div
        className="w-16 h-16 rounded-lg shadow-sm border border-border"
        style={{ backgroundColor: currentColor }}
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
};

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
          colorKey="primary"
          description="Main brand color for primary actions and emphasis"
        />
        <ColorSwatch
          name="Primary Foreground"
          colorKey="primary"
          subKey="foreground"
          description="Text color on primary backgrounds"
        />
        <ColorSwatch
          name="Secondary"
          colorKey="secondary"
          description="Secondary UI elements and subtle accents"
        />
        <ColorSwatch
          name="Secondary Foreground"
          colorKey="secondary"
          subKey="foreground"
          description="Text color on secondary backgrounds"
        />
        <ColorSwatch
          name="Destructive"
          colorKey="destructive"
          description="Dangerous or destructive actions (delete, remove)"
        />
        <ColorSwatch
          name="Destructive Foreground"
          colorKey="destructive"
          subKey="foreground"
          description="Text color on destructive backgrounds"
        />
        <ColorSwatch
          name="Muted"
          colorKey="muted"
          description="Subtle backgrounds for secondary content"
        />
        <ColorSwatch
          name="Muted Foreground"
          colorKey="muted"
          subKey="foreground"
          description="Dimmed text for less important content"
        />
        <ColorSwatch
          name="Accent"
          colorKey="accent"
          description="Accent colors for highlighting"
        />
        <ColorSwatch
          name="Accent Foreground"
          colorKey="accent"
          subKey="foreground"
          description="Text color on accent backgrounds"
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
          colorKey="background"
          description="Main page background"
        />
        <ColorSwatch
          name="Foreground"
          colorKey="foreground"
          description="Main text color"
        />
        <ColorSwatch
          name="Card"
          colorKey="card"
          description="Card and panel backgrounds"
        />
        <ColorSwatch
          name="Card Foreground"
          colorKey="card"
          subKey="foreground"
          description="Text on cards"
        />
        <ColorSwatch
          name="Popover"
          colorKey="popover"
          description="Popover and dropdown backgrounds"
        />
        <ColorSwatch
          name="Popover Foreground"
          colorKey="popover"
          subKey="foreground"
          description="Text on popovers"
        />
        <ColorSwatch
          name="Border"
          colorKey="border"
          description="Border and divider color"
        />
        <ColorSwatch
          name="Input"
          colorKey="input"
          description="Input field borders"
        />
        <ColorSwatch
          name="Ring"
          colorKey="ring"
          description="Focus ring color"
        />
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
            <li>• Use the same design tokens across dashboard and marketing pages</li>
            <li>• Test colors in both light and dark modes</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
          <h3 className="font-semibold text-destructive mb-2">❌ Don't</h3>
          <ul className="space-y-2 text-sm">
            <li>• Never hardcode hex colors: <code className="bg-background px-1 rounded line-through">bg-[#142978]</code></li>
            <li>• Don't use Tailwind color scale: <code className="bg-background px-1 rounded line-through">bg-blue-500</code></li>
            <li>• Don't create separate color systems for different parts of the app</li>
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
