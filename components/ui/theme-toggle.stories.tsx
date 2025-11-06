import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from '../theme-provider';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Theme Toggle with Dropdown</p>
        <ThemeToggle />
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Click the button above to switch between light, dark, and system themes.
          The current theme will be saved to localStorage.
        </p>
      </div>
    </div>
  ),
};

export const InNavigation: Story = {
  render: () => (
    <div className="w-full">
      <nav className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">App Name</h1>
          <div className="flex gap-4">
            <a href="#" className="text-sm hover:underline">Home</a>
            <a href="#" className="text-sm hover:underline">About</a>
            <a href="#" className="text-sm hover:underline">Contact</a>
          </div>
        </div>
        <ThemeToggle />
      </nav>
      <div className="p-8">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold">Theme Toggle in Navigation</h2>
          <p className="text-sm text-muted-foreground">
            The theme toggle is commonly placed in the navigation bar for easy access.
            Try switching themes to see how the entire interface updates.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const ShowcaseThemes: Story = {
  render: () => (
    <div className="grid gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Design System Showcase</h2>
        <ThemeToggle />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Surface Colors</h3>
          <div className="space-y-3">
            <div className="rounded bg-background p-3 text-sm">Background</div>
            <div className="rounded bg-card p-3 text-sm">Card</div>
            <div className="rounded bg-muted p-3 text-sm">Muted</div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Text Colors</h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground">Primary text</p>
            <p className="text-sm text-muted-foreground">Secondary text</p>
            <p className="text-sm text-primary">Link/accent text</p>
            <p className="text-sm text-destructive">Error text</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Interactive Elements</h3>
          <div className="flex gap-2">
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Primary
            </button>
            <button className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium">
              Secondary
            </button>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground">
              Destructive
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Borders & Dividers</h3>
          <div className="space-y-4">
            <div className="border-b pb-2">Default border</div>
            <div className="border-l-4 border-primary pl-3">Accent border</div>
            <div className="rounded-md border p-3">Bordered container</div>
          </div>
        </div>
      </div>
    </div>
  ),
};
