import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Player Profile</SheetTitle>
          <SheetDescription>
            View and edit player information here.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Smith" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" defaultValue="Forward" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jersey">Jersey Number</Label>
            <Input id="jersey" type="number" defaultValue="23" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Team Details</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Team Roster</SheetTitle>
          <SheetDescription>
            Current team members and their positions.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-muted-foreground">Forward</p>
              </div>
              <Badge>23</Badge>
            </div>
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div>
                <p className="font-medium">Mike Johnson</p>
                <p className="text-sm text-muted-foreground">Goalkeeper</p>
              </div>
              <Badge>1</Badge>
            </div>
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div>
                <p className="font-medium">Sarah Williams</p>
                <p className="text-sm text-muted-foreground">Midfielder</p>
              </div>
              <Badge>10</Badge>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter Players</SheetTitle>
          <SheetDescription>
            Filter the player list by various criteria.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="position-filter">Position</Label>
            <Input id="position-filter" placeholder="e.g., Forward" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-height">Minimum Height (cm)</Label>
            <Input id="min-height" type="number" placeholder="170" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age-range">Age Range</Label>
            <Input id="age-range" placeholder="18-30" />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Reset</Button>
          <Button>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Notifications</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Recent Updates</SheetTitle>
          <SheetDescription>
            Latest notifications and team updates.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-3 py-4">
          <div className="p-3 border rounded-md">
            <p className="font-medium">Game Scheduled</p>
            <p className="text-sm text-muted-foreground">New game added for January 20, 2026</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="font-medium">Player Added</p>
            <p className="text-sm text-muted-foreground">John Smith joined the team</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Quick Actions</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Frequently used actions for team management.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button variant="outline">Add Player</Button>
          <Button variant="outline">Schedule Game</Button>
          <Button variant="outline">View Reports</Button>
          <Button variant="outline">Team Settings</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Season Statistics</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Season 2025-2026 Statistics</SheetTitle>
          <SheetDescription>
            Comprehensive statistics for the current season.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-semibold mb-3">Team Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Games Played</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Wins</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Draws</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Losses</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Scoring Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Goals For</span>
                <span className="font-medium">68</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Goals Against</span>
                <span className="font-medium">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Goal Difference</span>
                <span className="font-medium">+36</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Top Scorers</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">John Smith</span>
                <span className="font-medium">15 goals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sarah Williams</span>
                <span className="font-medium">12 goals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tom Davis</span>
                <span className="font-medium">8 goals</span>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button>Download Report</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
