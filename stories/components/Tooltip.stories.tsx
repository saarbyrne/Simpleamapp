import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Info, Trash2, Edit, Eye, Download, Settings } from 'lucide-react';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Player information and statistics</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const ActionButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View player details</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit player information</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export player statistics</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove from team</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const PlayerCard: Story = {
  render: () => (
    <div className="p-4 border rounded-lg w-64">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">John Smith</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View full player profile</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Position</span>
          <span>Forward</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Jersey</span>
          <span>#23</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Goals</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">15</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>15 goals in 24 games</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};

export const TeamStats: Story = {
  render: () => (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        Team Statistics
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Statistics for the 2025-2026 season</p>
          </TooltipContent>
        </Tooltip>
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-3 border rounded cursor-help">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">75%</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>18 wins out of 24 games</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-3 border rounded cursor-help">
              <p className="text-sm text-muted-foreground">Goals/Game</p>
              <p className="text-2xl font-bold">2.8</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Average goals scored per game</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const FormLabels: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <label htmlFor="player-name" className="text-sm font-medium">
            Player Name
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter the player's full legal name</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          id="player-name"
          type="text"
          placeholder="John Smith"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <label htmlFor="jersey-number" className="text-sm font-medium">
            Jersey Number
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Must be unique within the team (1-99)</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          id="jersey-number"
          type="number"
          placeholder="23"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  ),
};

export const SettingsMenu: Story = {
  render: () => (
    <div className="p-4 border rounded-lg w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Settings</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Advanced settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Notifications</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <input type="checkbox" className="cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Receive email notifications for game updates</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Auto-save</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <input type="checkbox" defaultChecked className="cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Automatically save changes to player data</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};
