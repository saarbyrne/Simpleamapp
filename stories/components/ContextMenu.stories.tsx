import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { Eye, Edit, Trash2, Copy, Download, Share2, Star } from 'lucide-react';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[350px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          View
        </ContextMenuItem>
        <ContextMenuItem inset>
          Edit
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[350px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click for player actions
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Player</span>
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Export Stats</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Profile</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Remove from Team</span>
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const PlayerCard: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-80 rounded-lg border p-4 cursor-context-menu">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              JS
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">John Smith</h4>
              <p className="text-sm text-muted-foreground">Forward • #23</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
            <div>
              <p className="font-bold">24</p>
              <p className="text-xs text-muted-foreground">Games</p>
            </div>
            <div>
              <p className="font-bold">15</p>
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
            <div>
              <p className="font-bold">8</p>
              <p className="text-xs text-muted-foreground">Assists</p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Full Profile</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Information</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Star className="mr-2 h-4 w-4" />
          <span>Add to Favorites</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download Statistics</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Remove from Roster</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[350px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click for team actions
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Team</span>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Team Details</ContextMenuItem>
            <ContextMenuItem>Roster</ContextMenuItem>
            <ContextMenuItem>Schedule</ContextMenuItem>
            <ContextMenuItem>Settings</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Export as PDF</ContextMenuItem>
            <ContextMenuItem>Export as CSV</ContextMenuItem>
            <ContextMenuItem>Export as Excel</ContextMenuItem>
            <ContextMenuItem>Export Statistics</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Team</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[350px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click for display options
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Display Settings</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Player Photos
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked>
          Show Statistics
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Show Position
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Show Jersey Number
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Columns</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Goals
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked>
          Assists
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Yellow Cards
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Red Cards
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithRadioGroup: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[350px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click to sort
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Sort Players By</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="name">
          <ContextMenuRadioItem value="name">
            Name (A-Z)
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="position">
            Position
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="jersey">
            Jersey Number
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="goals">
            Goals (High to Low)
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="assists">
            Assists (High to Low)
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="rating">
            Rating (High to Low)
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const GameScheduleItem: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-96 rounded-lg border p-4 cursor-context-menu">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">Eagles FC vs Thunder United</p>
              <p className="text-sm text-muted-foreground mt-1">January 20, 2026 • 7:00 PM</p>
              <p className="text-sm text-muted-foreground">Eagle Arena</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-secondary px-2 py-1 rounded">Upcoming</span>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Game Details</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Game</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Share Link</ContextMenuItem>
            <ContextMenuItem>Email Details</ContextMenuItem>
            <ContextMenuItem>Export to Calendar</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          <span>Download Game Info</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Cancel Game</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const TeamStatsCard: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-80 rounded-lg border p-4 cursor-context-menu">
          <h4 className="font-semibold mb-4">Season Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Games</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">75%</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Goals</p>
              <p className="text-2xl font-bold">68</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm text-muted-foreground">Clean Sheets</p>
              <p className="text-2xl font-bold">10</p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Detailed Stats</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Statistics</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Export as PDF</ContextMenuItem>
            <ContextMenuItem>Export as CSV</ContextMenuItem>
            <ContextMenuItem>Export as Image</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Stats</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Display Options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Percentages
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked>
          Show Comparisons
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Show Trends
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
