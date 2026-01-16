import type { Meta, StoryObj } from '@storybook/react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[400px] max-w-4xl rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Player List</h3>
            <p className="text-sm text-muted-foreground">
              View all players in your team roster
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Player Details</h3>
            <p className="text-sm text-muted-foreground">
              Detailed statistics and information
            </p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup direction="vertical" className="min-h-[600px] max-w-4xl rounded-lg border">
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Game Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Upcoming and past games
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Game Details</h3>
            <p className="text-sm text-muted-foreground">
              Match statistics and player performance
            </p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[400px] max-w-4xl rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Team Stats</h3>
            <p className="text-sm text-muted-foreground">
              Season performance metrics
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Player Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Individual player statistics
            </p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[400px] max-w-4xl rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Navigation</h3>
            <p className="text-sm text-muted-foreground">
              Team menu
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Main Content</h3>
            <p className="text-sm text-muted-foreground">
              Player roster and game schedule
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Sidebar</h3>
            <p className="text-sm text-muted-foreground">
              Quick stats
            </p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const NestedPanels: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px] max-w-4xl rounded-lg border">
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Players</h3>
            <p className="text-sm text-muted-foreground">
              Browse team roster
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">Player Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Personal information and position
                </p>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">Statistics</h3>
                <p className="text-sm text-muted-foreground">
                  Goals, assists, and performance data
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const TeamDashboard: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px] max-w-6xl rounded-lg border">
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="h-full bg-muted/50 p-4">
          <h3 className="font-semibold mb-4">Team Menu</h3>
          <div className="space-y-2">
            <div className="p-2 rounded hover:bg-accent cursor-pointer">Dashboard</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer">Players</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer">Games</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer">Statistics</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer">Reports</div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full items-center justify-center p-6 bg-background">
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">Team Overview</h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
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
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full items-center justify-center p-6 bg-background">
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">Recent Games</h3>
                <p className="text-sm text-muted-foreground">
                  Match results and upcoming fixtures
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="h-full bg-muted/50 p-4">
          <h3 className="font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Top Scorer</p>
              <p className="text-sm font-medium">John Smith (15)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Most Assists</p>
              <p className="text-sm font-medium">Sarah Williams (10)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Clean Sheets</p>
              <p className="text-sm font-medium">10</p>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const GameAnalysis: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[500px] max-w-5xl rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6 bg-background">
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">Match Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Key events and moments
                </p>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6 bg-background">
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">Player Ratings</h3>
                <p className="text-sm text-muted-foreground">
                  Performance scores
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-background">
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Match Statistics</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 max-w-md">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Possession</span>
                  <span className="text-sm font-medium">58%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Shots</span>
                  <span className="text-sm font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">On Target</span>
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Corners</span>
                  <span className="text-sm font-medium">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fouls</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Offsides</span>
                  <span className="text-sm font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
