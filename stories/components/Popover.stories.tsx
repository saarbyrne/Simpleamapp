import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Player Information</h4>
          <p className="text-sm text-muted-foreground">
            Quick view of player stats and details.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Quick Add Player</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add Player</h4>
            <p className="text-sm text-muted-foreground">
              Enter basic player information.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="popover-name">Name</Label>
              <Input id="popover-name" placeholder="John Smith" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="popover-jersey">Jersey Number</Label>
              <Input id="popover-jersey" type="number" placeholder="23" />
            </div>
            <Button className="w-full">Add Player</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const PlayerStats: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Player Stats</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium">John Smith</h4>
            <p className="text-sm text-muted-foreground">Forward • #23</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Games Played</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Goals</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assists</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">8.5</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const TeamInfo: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">Team Details</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">Eagles FC</h4>
            <p className="text-sm text-muted-foreground">Premier Division</p>
          </div>
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Founded</span>
              <span>1995</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stadium</span>
              <span>Eagle Arena</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capacity</span>
              <span>25,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Manager</span>
              <span>John Doe</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const ScheduleGame: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Game
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Schedule New Game</h4>
            <p className="text-sm text-muted-foreground">
              Set up a new game for your team.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="opponent">Opponent</Label>
              <Input id="opponent" placeholder="Thunder United" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="Home Stadium" />
            </div>
            <Button className="w-full">Create Game</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">This popover appears on top</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">This popover appears on the right</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">This popover appears on the bottom</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">This popover appears on the left</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const FilterOptions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filter Players</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Filter Options</h4>
            <p className="text-sm text-muted-foreground">
              Refine the player list with filters.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="position-filter">Position</Label>
              <Input id="position-filter" placeholder="Forward, Midfielder..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="age-filter">Age Range</Label>
              <div className="flex gap-2">
                <Input id="age-filter" type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Reset</Button>
              <Button className="flex-1">Apply</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
