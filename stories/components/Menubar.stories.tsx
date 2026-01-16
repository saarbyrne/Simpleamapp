import type { Meta, StoryObj } from '@storybook/react';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Components/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Player</MenubarItem>
          <MenubarItem>New Team</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Export</MenubarItem>
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Dashboard</MenubarItem>
          <MenubarItem>Players</MenubarItem>
          <MenubarItem>Teams</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Player <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Team <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Export <MenubarShortcut>⌘E</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithCheckboxes: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Status Bar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Full Screen</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Display</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Player Stats</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Team Rankings</MenubarCheckboxItem>
          <MenubarCheckboxItem>Match History</MenubarCheckboxItem>
          <MenubarCheckboxItem>Upcoming Events</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithRadioGroups: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Dashboard</MenubarItem>
          <MenubarSeparator />
          <MenubarRadioGroup value="list">
            <MenubarRadioItem value="list">List View</MenubarRadioItem>
            <MenubarRadioItem value="grid">Grid View</MenubarRadioItem>
            <MenubarRadioItem value="compact">Compact View</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Sort By</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="name">
            <MenubarRadioItem value="name">Name</MenubarRadioItem>
            <MenubarRadioItem value="date">Date Added</MenubarRadioItem>
            <MenubarRadioItem value="goals">Goals</MenubarRadioItem>
            <MenubarRadioItem value="assists">Assists</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithSubmenus: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>New Player</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Forward</MenubarItem>
              <MenubarItem>Midfielder</MenubarItem>
              <MenubarItem>Defender</MenubarItem>
              <MenubarItem>Goalkeeper</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Export as PDF</MenubarItem>
              <MenubarItem>Export as CSV</MenubarItem>
              <MenubarItem>Export as Excel</MenubarItem>
              <MenubarItem>Export as JSON</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Reports</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Player Reports</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Performance Summary</MenubarItem>
              <MenubarItem>Statistics Report</MenubarItem>
              <MenubarItem>Injury Report</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>Team Reports</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Season Summary</MenubarItem>
              <MenubarItem>Match Analysis</MenubarItem>
              <MenubarItem>Squad Overview</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const SportsManagement: Story = {
  render: () => (
    <Menubar className="w-full">
      <MenubarMenu>
        <MenubarTrigger>Players</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            View All Players <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Add New Player <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Filter by Position</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Forwards</MenubarItem>
              <MenubarItem>Midfielders</MenubarItem>
              <MenubarItem>Defenders</MenubarItem>
              <MenubarItem>Goalkeepers</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>Export Players</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Export as CSV</MenubarItem>
              <MenubarItem>Export as PDF</MenubarItem>
              <MenubarItem>Export Statistics</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Teams</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>View All Teams</MenubarItem>
          <MenubarItem>Add New Team</MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Show Inactive Teams</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Team Statistics</MenubarItem>
          <MenubarItem>Team Rankings</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Matches</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Schedule Match</MenubarItem>
          <MenubarItem>View Schedule</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Match Results</MenubarItem>
          <MenubarItem>Live Matches</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="comfortable">
            <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
            <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Quick Stats</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
