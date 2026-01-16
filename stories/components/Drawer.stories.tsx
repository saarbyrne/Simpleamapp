import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Player Quick Actions</DrawerTitle>
          <DrawerDescription>
            Perform common actions for this player.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          <Button className="w-full" variant="outline">View Full Profile</Button>
          <Button className="w-full" variant="outline">Edit Information</Button>
          <Button className="w-full" variant="outline">View Statistics</Button>
          <Button className="w-full" variant="destructive">Remove from Team</Button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Add New Player</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Player to Roster</DrawerTitle>
          <DrawerDescription>
            Enter the player's information below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drawer-name">Full Name</Label>
            <Input id="drawer-name" placeholder="John Smith" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drawer-jersey">Jersey Number</Label>
            <Input id="drawer-jersey" type="number" placeholder="23" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drawer-position">Position</Label>
            <Input id="drawer-position" placeholder="Forward" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Add Player</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const GameScore: Story = {
  render: () => {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Update Score</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Live Score Update</DrawerTitle>
            <DrawerDescription>
              Update the score for the current game.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <p className="text-sm text-muted-foreground mb-2">Home Team</p>
                <p className="text-4xl font-bold">{homeScore}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => setHomeScore(homeScore + 1)}>+1</Button>
                  <Button size="sm" variant="outline" onClick={() => setHomeScore(Math.max(0, homeScore - 1))}>-1</Button>
                </div>
              </div>
              <div className="text-2xl font-bold text-muted-foreground px-4">:</div>
              <div className="flex flex-col items-center flex-1">
                <p className="text-sm text-muted-foreground mb-2">Away Team</p>
                <p className="text-4xl font-bold">{awayScore}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => setAwayScore(awayScore + 1)}>+1</Button>
                  <Button size="sm" variant="outline" onClick={() => setAwayScore(Math.max(0, awayScore - 1))}>-1</Button>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Save Score</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

export const TeamSelection: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Select Team</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Choose Your Team</DrawerTitle>
          <DrawerDescription>
            Select the team you want to manage.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          <button className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors">
            <p className="font-semibold">Eagles FC</p>
            <p className="text-sm text-muted-foreground">Premier Division</p>
          </button>
          <button className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors">
            <p className="font-semibold">Thunder United</p>
            <p className="text-sm text-muted-foreground">Championship</p>
          </button>
          <button className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors">
            <p className="font-semibold">Storm Athletic</p>
            <p className="text-sm text-muted-foreground">First Division</p>
          </button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const MatchDetails: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>View Match Details</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Match Details</DrawerTitle>
          <DrawerDescription>
            Eagles FC vs Thunder United - January 15, 2026
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-3">Final Score</h3>
            <div className="flex justify-around items-center py-4 border rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Eagles FC</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <p className="text-2xl font-bold">-</p>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Thunder United</p>
                <p className="text-3xl font-bold">2</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Goal Scorers</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-2 border rounded">
                <span className="text-sm">John Smith (15', 67')</span>
                <span className="text-sm font-medium">Eagles FC</span>
              </div>
              <div className="flex justify-between p-2 border rounded">
                <span className="text-sm">Sarah Williams (43')</span>
                <span className="text-sm font-medium">Eagles FC</span>
              </div>
              <div className="flex justify-between p-2 border rounded">
                <span className="text-sm">Mike Brown (28', 55')</span>
                <span className="text-sm font-medium">Thunder United</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Match Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Possession</span>
                <span className="text-sm font-medium">58% - 42%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shots on Target</span>
                <span className="text-sm font-medium">8 - 6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Corners</span>
                <span className="text-sm font-medium">7 - 4</span>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button>Download Report</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Controlled Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Controlled Drawer</DrawerTitle>
              <DrawerDescription>
                This drawer is controlled by state.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                The drawer state is managed programmatically, allowing you to
                open and close it from your code.
              </p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};
