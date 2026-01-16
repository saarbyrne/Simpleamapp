import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-3" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-4" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <span className="text-xs text-muted-foreground">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-12" />
        <span className="text-xs text-muted-foreground">Extra Large</span>
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner />
      <span className="text-sm">Loading...</span>
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>
        <Spinner className="mr-2" />
        Loading
      </Button>
      <Button variant="outline" disabled>
        <Spinner className="mr-2" />
        Please wait
      </Button>
      <Button variant="secondary" disabled>
        <Spinner className="mr-2" />
        Processing
      </Button>
    </div>
  ),
};

export const Centered: Story = {
  render: () => (
    <div className="flex h-[200px] w-[400px] items-center justify-center border rounded-lg">
      <Spinner className="size-8" />
    </div>
  ),
};

export const CenteredWithText: Story = {
  render: () => (
    <div className="flex h-[200px] w-[400px] flex-col items-center justify-center gap-4 border rounded-lg">
      <Spinner className="size-8" />
      <div className="text-center">
        <p className="text-sm font-medium">Loading data</p>
        <p className="text-xs text-muted-foreground">Please wait while we fetch your information</p>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="size-5" />
        <div className="flex-1">
          <p className="text-sm font-medium">Loading players...</p>
          <p className="text-xs text-muted-foreground">Fetching roster data</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="size-5" />
        <div className="flex-1">
          <p className="text-sm font-medium">Processing report...</p>
          <p className="text-xs text-muted-foreground">Analyzing game statistics</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Spinner className="size-5" />
        <div className="flex-1">
          <p className="text-sm font-medium">Syncing teams...</p>
          <p className="text-xs text-muted-foreground">Updating team rosters</p>
        </div>
      </div>
    </div>
  ),
};

export const PageLoading: Story = {
  render: () => (
    <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
      <Spinner className="size-12" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">Loading Dashboard</h3>
        <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
      </div>
    </div>
  ),
};

export const InlineLoading: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="border rounded-lg p-4">
        <h3 className="text-base font-semibold mb-2">Player Statistics</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          <span>Calculating stats...</span>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="text-base font-semibold mb-2">Team Rankings</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          <span>Loading rankings...</span>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="text-base font-semibold mb-2">Recent Games</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          <span>Fetching game history...</span>
        </div>
      </div>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8 text-blue-500" />
        <span className="text-xs text-muted-foreground">Blue</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8 text-green-500" />
        <span className="text-xs text-muted-foreground">Green</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8 text-red-500" />
        <span className="text-xs text-muted-foreground">Red</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8 text-purple-500" />
        <span className="text-xs text-muted-foreground">Purple</span>
      </div>
    </div>
  ),
};

export const CardLoading: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <Spinner className="size-8" />
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FormSubmitting: Story = {
  render: () => (
    <div className="w-[400px] border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">Player Registration</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <input className="w-full p-2 border rounded-md" value="John Doe" disabled />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input className="w-full p-2 border rounded-md" value="john@example.com" disabled />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Team</label>
        <input className="w-full p-2 border rounded-md" value="Team A" disabled />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled>
          Cancel
        </Button>
        <Button disabled>
          <Spinner className="mr-2" />
          Submitting...
        </Button>
      </div>
    </div>
  ),
};

export const OverlayLoading: Story = {
  render: () => (
    <div className="relative w-[500px] h-[300px] border rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dashboard Content</h3>
        <p className="text-sm text-muted-foreground">
          This is some content that appears behind the loading overlay.
        </p>
      </div>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-12" />
          <p className="text-sm font-medium">Refreshing data...</p>
        </div>
      </div>
    </div>
  ),
};
