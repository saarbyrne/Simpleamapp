import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@/components/ui/separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    decorative: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-muted-foreground">This is the first section.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-muted-foreground">This is the second section.</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <div className="text-sm">
        <p className="font-semibold">Item 1</p>
        <p className="text-muted-foreground">Description</p>
      </div>
      <Separator orientation="vertical" />
      <div className="text-sm">
        <p className="font-semibold">Item 2</p>
        <p className="text-muted-foreground">Description</p>
      </div>
      <Separator orientation="vertical" />
      <div className="text-sm">
        <p className="font-semibold">Item 3</p>
        <p className="text-muted-foreground">Description</p>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-full max-w-md border rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">Card subtitle or description</p>
      </div>
      <Separator />
      <div className="space-y-2">
        <p className="text-sm">This is the main content area of the card.</p>
        <p className="text-sm text-muted-foreground">Additional information can go here.</p>
      </div>
      <Separator />
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 text-sm rounded-md border">Cancel</button>
        <button className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground">Save</button>
      </div>
    </div>
  ),
};

export const MenuDivider: Story = {
  render: () => (
    <div className="w-56 border rounded-lg p-2">
      <div className="px-2 py-1.5 text-sm hover:bg-muted rounded cursor-pointer">Profile</div>
      <div className="px-2 py-1.5 text-sm hover:bg-muted rounded cursor-pointer">Settings</div>
      <div className="px-2 py-1.5 text-sm hover:bg-muted rounded cursor-pointer">Team</div>
      <Separator className="my-2" />
      <div className="px-2 py-1.5 text-sm hover:bg-muted rounded cursor-pointer">Help</div>
      <div className="px-2 py-1.5 text-sm hover:bg-muted rounded cursor-pointer">Feedback</div>
      <Separator className="my-2" />
      <div className="px-2 py-1.5 text-sm text-destructive hover:bg-muted rounded cursor-pointer">
        Log out
      </div>
    </div>
  ),
};

export const PlayerDetails: Story = {
  render: () => (
    <div className="w-full max-w-2xl border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">John Doe</h2>
        <p className="text-sm text-muted-foreground">Forward - Team A</p>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Personal Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Age:</span> 25</p>
            <p><span className="text-muted-foreground">Height:</span> 6&apos;2&quot;</p>
            <p><span className="text-muted-foreground">Weight:</span> 185 lbs</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Contact</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Email:</span> john@example.com</p>
            <p><span className="text-muted-foreground">Phone:</span> (555) 123-4567</p>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold mb-2">Season Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">23</p>
            <p className="text-xs text-muted-foreground">Games</p>
          </div>
          <div>
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
          <div>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Assists</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SidebarLayout: Story = {
  render: () => (
    <div className="flex h-[300px] w-full max-w-3xl border rounded-lg">
      <div className="w-48 p-4 space-y-2">
        <h3 className="font-semibold mb-4">Navigation</h3>
        <div className="text-sm space-y-1">
          <div className="px-2 py-1.5 bg-muted rounded cursor-pointer">Dashboard</div>
          <div className="px-2 py-1.5 hover:bg-muted rounded cursor-pointer">Players</div>
          <div className="px-2 py-1.5 hover:bg-muted rounded cursor-pointer">Teams</div>
          <div className="px-2 py-1.5 hover:bg-muted rounded cursor-pointer">Reports</div>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Main Content</h2>
        <p className="text-sm text-muted-foreground">
          This is the main content area separated from the sidebar by a vertical separator.
        </p>
      </div>
    </div>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <div className="w-full max-w-2xl border rounded-lg">
      <div className="flex items-center gap-2 p-2">
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Bold</button>
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Italic</button>
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Underline</button>
        <Separator orientation="vertical" className="h-6" />
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Left</button>
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Center</button>
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Right</button>
        <Separator orientation="vertical" className="h-6" />
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Link</button>
        <button className="px-3 py-1.5 text-sm hover:bg-muted rounded">Image</button>
      </div>
      <Separator />
      <div className="p-4 min-h-[200px]">
        <p className="text-sm text-muted-foreground">Content area</p>
      </div>
    </div>
  ),
};

export const ListItems: Story = {
  render: () => (
    <div className="w-full max-w-md border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Team Members</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Forward</p>
          </div>
          <span className="text-sm">23 Games</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Sarah Miller</p>
            <p className="text-xs text-muted-foreground">Midfielder</p>
          </div>
          <span className="text-sm">20 Games</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Robert Johnson</p>
            <p className="text-xs text-muted-foreground">Defender</p>
          </div>
          <span className="text-sm">22 Games</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Emily Wilson</p>
            <p className="text-xs text-muted-foreground">Goalkeeper</p>
          </div>
          <span className="text-sm">21 Games</span>
        </div>
      </div>
    </div>
  ),
};
