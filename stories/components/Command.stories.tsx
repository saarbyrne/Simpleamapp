import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, Settings, BarChart, Trophy, Search } from 'lucide-react';

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Players</span>
          </CommandItem>
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Games</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Reports</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[450px]">
      <CommandInput placeholder="Search teams, players, games..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Team Management">
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <span>View All Players</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Add New Player</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Trophy className="mr-2 h-4 w-4" />
            <span>Team Statistics</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Schedule">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>View Schedule</span>
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Add New Game</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Reports">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Season Report</span>
          </CommandItem>
          <CommandItem>
            <BarChart className="mr-2 h-4 w-4" />
            <span>Player Analytics</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const DialogVariant: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>
          <Search className="mr-2 h-4 w-4" />
          Open Command Menu
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => setOpen(false)}>
                <Users className="mr-2 h-4 w-4" />
                <span>View Players</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule Game</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Generate Report</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};

export const PlayerSearch: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[450px]">
      <CommandInput placeholder="Search players..." />
      <CommandList>
        <CommandEmpty>No players found.</CommandEmpty>
        <CommandGroup heading="Players">
          <CommandItem>
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                JS
              </div>
              <div className="flex-1">
                <p className="font-medium">John Smith</p>
                <p className="text-xs text-muted-foreground">Forward • #23</p>
              </div>
            </div>
          </CommandItem>
          <CommandItem>
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                SW
              </div>
              <div className="flex-1">
                <p className="font-medium">Sarah Williams</p>
                <p className="text-xs text-muted-foreground">Midfielder • #10</p>
              </div>
            </div>
          </CommandItem>
          <CommandItem>
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                MJ
              </div>
              <div className="flex-1">
                <p className="font-medium">Mike Johnson</p>
                <p className="text-xs text-muted-foreground">Goalkeeper • #1</p>
              </div>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const GameActions: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[450px]">
      <CommandInput placeholder="Search game actions..." />
      <CommandList>
        <CommandEmpty>No actions found.</CommandEmpty>
        <CommandGroup heading="Upcoming Games">
          <CommandItem>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <span className="font-medium">Eagles FC vs Thunder United</span>
                <span className="text-xs text-muted-foreground">Jan 20</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Eagle Arena • 7:00 PM</p>
            </div>
          </CommandItem>
          <CommandItem>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <span className="font-medium">Storm Athletic vs Eagles FC</span>
                <span className="text-xs text-muted-foreground">Jan 25</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Storm Stadium • 3:00 PM</p>
            </div>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent Results">
          <CommandItem>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <span className="font-medium">Eagles FC 3 - 2 Thunder United</span>
                <span className="text-xs text-muted-foreground">Jan 15</span>
              </div>
            </div>
          </CommandItem>
          <CommandItem>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <span className="font-medium">Lightning FC 1 - 4 Eagles FC</span>
                <span className="text-xs text-muted-foreground">Jan 10</span>
              </div>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const NavigationMenu: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Quick Navigation
          <CommandShortcut className="ml-2">⌘K</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Where do you want to go?" />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            <CommandGroup heading="Main Pages">
              <CommandItem onSelect={() => setOpen(false)}>
                <Users className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Users className="mr-2 h-4 w-4" />
                <span>Players</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule</span>
                <CommandShortcut>⌘G</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Trophy className="mr-2 h-4 w-4" />
                <span>Standings</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Analytics">
              <CommandItem onSelect={() => setOpen(false)}>
                <BarChart className="mr-2 h-4 w-4" />
                <span>Team Statistics</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <BarChart className="mr-2 h-4 w-4" />
                <span>Player Analytics</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Season Reports</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem onSelect={() => setOpen(false)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Team Settings</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>User Preferences</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};

export const ReportsSearch: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[500px]">
      <CommandInput placeholder="Search reports and documents..." />
      <CommandList>
        <CommandEmpty>No reports found.</CommandEmpty>
        <CommandGroup heading="Season Reports">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">2025-2026 Season Summary</p>
              <p className="text-xs text-muted-foreground">Updated Jan 15, 2026</p>
            </div>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">Mid-Season Performance Review</p>
              <p className="text-xs text-muted-foreground">Updated Dec 20, 2025</p>
            </div>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Player Reports">
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">John Smith - Season Statistics</p>
              <p className="text-xs text-muted-foreground">15 goals, 8 assists</p>
            </div>
          </CommandItem>
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">Sarah Williams - Performance Analysis</p>
              <p className="text-xs text-muted-foreground">12 goals, 10 assists</p>
            </div>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Match Reports">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">Eagles FC vs Thunder United</p>
              <p className="text-xs text-muted-foreground">Jan 15, 2026 • 3-2 Win</p>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
