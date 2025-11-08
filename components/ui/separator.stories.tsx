import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['ref', 'asChild'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-20 items-center justify-center space-x-4">
      <span>Item 1</span>
      <Separator {...args} />
      <span>Item 2</span>
      <Separator {...args} />
      <span>Item 3</span>
    </div>
  ),
};

export const InCard: Story = {
  render: (args) => (
    <div className="w-[350px] rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences
        </p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>
        <Separator {...args} />
        <div className="space-y-1">
          <p className="text-sm font-medium">Plan</p>
          <p className="text-sm text-muted-foreground">Pro Plan</p>
        </div>
      </div>
    </div>
  ),
};

export const InList: Story = {
  render: (args) => (
    <div className="w-[300px] space-y-0 rounded-md border">
      <div className="p-4">
        <p className="text-sm">Item 1</p>
      </div>
      <Separator {...args} />
      <div className="p-4">
        <p className="text-sm">Item 2</p>
      </div>
      <Separator {...args} />
      <div className="p-4">
        <p className="text-sm">Item 3</p>
      </div>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Profile Information</h4>
          <p className="text-sm text-muted-foreground">
            Your personal details
          </p>
        </div>

        <div className="relative">
          <Separator />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
            <span className="text-xs text-muted-foreground">OR</span>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Privacy Settings</h4>
          <p className="text-sm text-muted-foreground">
            Control who can see your information
          </p>
        </div>
      </div>
    </div>
  ),
};

export const BothOrientations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium">Horizontal Separator</p>
        <div className="w-[300px]">
          <p className="text-sm text-muted-foreground">Content above</p>
          <Separator orientation="horizontal" className="my-4" />
          <p className="text-sm text-muted-foreground">Content below</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Vertical Separator</p>
        <div className="flex h-16 items-center">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" className="mx-4" />
          <span className="text-sm">Center</span>
          <Separator orientation="vertical" className="mx-4" />
          <span className="text-sm">Right</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { exclude: ['orientation'] },
  },
};
