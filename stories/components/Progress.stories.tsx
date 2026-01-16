import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@/components/ui/progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-md">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span className="text-muted-foreground">65%</span>
      </div>
      <Progress value={65} />
    </div>
  ),
};

export const MultipleStates: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Starting</span>
          <span className="text-muted-foreground">10%</span>
        </div>
        <Progress value={10} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>In Progress</span>
          <span className="text-muted-foreground">45%</span>
        </div>
        <Progress value={45} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Nearly Done</span>
          <span className="text-muted-foreground">85%</span>
        </div>
        <Progress value={85} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Complete</span>
          <span className="text-muted-foreground">100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const PlayerRegistration: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md border rounded-lg p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Player Registration</h3>
        <p className="text-sm text-muted-foreground">Complete all steps to register</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Personal Information</span>
            <span className="text-green-600">Complete</span>
          </div>
          <Progress value={100} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Team Assignment</span>
            <span className="text-green-600">Complete</span>
          </div>
          <Progress value={100} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Documents Upload</span>
            <span className="text-blue-600">In Progress</span>
          </div>
          <Progress value={60} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment</span>
            <span className="text-muted-foreground">Pending</span>
          </div>
          <Progress value={0} />
        </div>
      </div>
      <div className="pt-4">
        <Progress value={65} className="h-2" />
        <p className="text-sm text-center mt-2 text-muted-foreground">65% Complete</p>
      </div>
    </div>
  ),
};

export const SeasonProgress: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md border rounded-lg p-6">
      <div>
        <h3 className="text-lg font-semibold">Season 2024 Progress</h3>
        <p className="text-sm text-muted-foreground">12 of 20 games played</p>
      </div>
      <Progress value={60} />
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">Wins</p>
        </div>
        <div>
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-muted-foreground">Losses</p>
        </div>
      </div>
    </div>
  ),
};

export const FileUpload: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md border rounded-lg p-6">
      <div>
        <h3 className="text-base font-semibold">Uploading Files</h3>
        <p className="text-sm text-muted-foreground">3 files in progress</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="truncate">player_roster.xlsx</span>
            <span className="text-muted-foreground">100%</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="truncate">team_photo.jpg</span>
            <span className="text-muted-foreground">73%</span>
          </div>
          <Progress value={73} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="truncate">game_report_2024_01.pdf</span>
            <span className="text-muted-foreground">28%</span>
          </div>
          <Progress value={28} className="h-2" />
        </div>
      </div>
    </div>
  ),
};

export const GoalProgress: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold">Goals Scored</h4>
              <p className="text-xs text-muted-foreground">Season target: 50</p>
            </div>
            <span className="text-lg font-bold">42</span>
          </div>
          <Progress value={84} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold">Clean Sheets</h4>
              <p className="text-xs text-muted-foreground">Season target: 10</p>
            </div>
            <span className="text-lg font-bold">7</span>
          </div>
          <Progress value={70} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold">Win Rate</h4>
              <p className="text-xs text-muted-foreground">Target: 75%</p>
            </div>
            <span className="text-lg font-bold">67%</span>
          </div>
          <Progress value={67} />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Extra Small (h-1)</p>
        <Progress value={65} className="h-1" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Small (h-2)</p>
        <Progress value={65} className="h-2" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default (h-4)</p>
        <Progress value={65} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Large (h-6)</p>
        <Progress value={65} className="h-6" />
      </div>
    </div>
  ),
};

export const Training: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md border rounded-lg p-6">
      <div>
        <h3 className="text-lg font-semibold">Training Module Progress</h3>
        <p className="text-sm text-muted-foreground">Complete all modules to earn certification</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Introduction to Rules</p>
            <Progress value={100} className="h-2" />
          </div>
          <span className="text-xs text-green-600 font-medium">Done</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Safety Guidelines</p>
            <Progress value={100} className="h-2" />
          </div>
          <span className="text-xs text-green-600 font-medium">Done</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Game Strategies</p>
            <Progress value={40} className="h-2" />
          </div>
          <span className="text-xs text-blue-600 font-medium">40%</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Advanced Techniques</p>
            <Progress value={0} className="h-2" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">0%</span>
        </div>
      </div>
    </div>
  ),
};
