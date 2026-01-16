import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, Option, Shift, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Kbd> = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: () => (
    <div className="flex gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
};

export const SingleKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>A</Kbd>
      <Kbd>S</Kbd>
      <Kbd>D</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>Del</Kbd>
    </div>
  ),
};

export const ModifierKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>Cmd</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>Alt</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>Shift</Kbd>
    </div>
  ),
};

export const KeyCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Search:</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Save:</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Copy:</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Paste:</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>V</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>
        <Command className="h-3 w-3" />
      </Kbd>
      <Kbd>
        <Option className="h-3 w-3" />
      </Kbd>
      <Kbd>
        <Shift className="h-3 w-3" />
      </Kbd>
      <Kbd>
        <ArrowUp className="h-3 w-3" />
      </Kbd>
      <Kbd>
        <ArrowDown className="h-3 w-3" />
      </Kbd>
      <Kbd>
        <ArrowLeft className="h-3 w-3" />
      </Kbd>
      <Kbd>
        <ArrowRight className="h-3 w-3" />
      </Kbd>
    </div>
  ),
};

export const ArrowKeys: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-2">
      <Kbd>
        <ArrowUp className="h-3 w-3" />
      </Kbd>
      <div className="flex gap-2">
        <Kbd>
          <ArrowLeft className="h-3 w-3" />
        </Kbd>
        <Kbd>
          <ArrowDown className="h-3 w-3" />
        </Kbd>
        <Kbd>
          <ArrowRight className="h-3 w-3" />
        </Kbd>
      </div>
    </div>
  ),
};

export const InText: Story = {
  render: () => (
    <div className="max-w-md space-y-2 text-sm">
      <p>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.
      </p>
      <p>
        Use <Kbd>⌘</Kbd> <Kbd>N</Kbd> to create a new player profile.
      </p>
      <p>
        Press <Kbd>Esc</Kbd> to close the dialog.
      </p>
      <p>
        Navigate with <Kbd>↑</Kbd> and <Kbd>↓</Kbd> arrow keys.
      </p>
    </div>
  ),
};

export const ShortcutList: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Keyboard Shortcuts</CardTitle>
        <CardDescription>Quick actions for player management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">New Player</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>N</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Search Players</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Save Changes</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Delete Player</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>⌫</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Undo</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>Z</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Redo</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>Z</Kbd>
            </KbdGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const NavigationShortcuts: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Navigation Shortcuts</CardTitle>
        <CardDescription>Quick navigation through the app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Go to Dashboard</span>
            <KbdGroup>
              <Kbd>G</Kbd>
              <Kbd>D</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Go to Players</span>
            <KbdGroup>
              <Kbd>G</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Go to Teams</span>
            <KbdGroup>
              <Kbd>G</Kbd>
              <Kbd>T</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Go to Matches</span>
            <KbdGroup>
              <Kbd>G</Kbd>
              <Kbd>M</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Toggle Sidebar</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>B</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Open Settings</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>,</Kbd>
            </KbdGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const EditorShortcuts: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Editor Shortcuts</CardTitle>
        <CardDescription>Text editing and formatting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Bold</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>B</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Italic</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>I</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Underline</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>U</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Select All</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>A</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Find</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>F</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Replace</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>⌥</Kbd>
              <Kbd>F</Kbd>
            </KbdGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
