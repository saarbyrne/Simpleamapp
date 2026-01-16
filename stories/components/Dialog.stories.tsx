import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Player Details</DialogTitle>
          <DialogDescription>
            View and edit player information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Smith" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" defaultValue="Forward" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Player</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the player "John Smith" from your team roster. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add New Player</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Player</DialogTitle>
            <DialogDescription>
              Enter the player's information below to add them to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player-name">Full Name</Label>
              <Input id="player-name" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jersey">Jersey Number</Label>
              <Input id="jersey" type="number" placeholder="23" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="player-position">Position</Label>
              <Input id="player-position" placeholder="Forward" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="185" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Add Player</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const TeamDetailsDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Team Stats</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Team Performance</DialogTitle>
          <DialogDescription>
            Season statistics and key metrics for your team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Games Played</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Win Rate</p>
              <p className="text-2xl font-bold">75%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Goals Scored</p>
              <p className="text-2xl font-bold">68</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Goals Against</p>
              <p className="text-2xl font-bold">32</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button>View Full Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContentDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Game Report</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Report: Team A vs Team B</DialogTitle>
          <DialogDescription>
            Detailed analysis of the game played on January 15, 2026
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">First Half</h3>
            <p className="text-sm text-muted-foreground">
              The game started with high intensity as both teams fought for possession.
              Team A dominated the early stages, creating several scoring opportunities.
              The first goal came in the 15th minute from a well-executed corner kick.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Second Half</h3>
            <p className="text-sm text-muted-foreground">
              Team B came out stronger in the second half, equalizing in the 52nd minute.
              The game remained balanced with both teams creating chances.
              The winning goal came in injury time from a counter-attack.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Key Statistics</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Possession: Team A 55% - Team B 45%</li>
              <li>Shots on target: Team A 8 - Team B 6</li>
              <li>Corners: Team A 7 - Team B 4</li>
              <li>Fouls: Team A 12 - Team B 15</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Player Ratings</h3>
            <p className="text-sm text-muted-foreground">
              Top performers included John Smith (8.5), who scored the winning goal,
              and goalkeeper Mike Johnson (8.0), who made several crucial saves.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Download PDF</Button>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
