import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/Dropdown Menu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => {
    const [showNotifications, setShowNotifications] = useState(true);
    const [mode, setMode] = useState<'team' | 'player' | 'medical'>('team');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ gap: tokens.spacing.gap.xs }}>
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <span>View weekly report</span>
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Create assessment</span>
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <span>Archive player</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showNotifications}
            onCheckedChange={(checked) =>
              setShowNotifications(Boolean(checked))
            }
          >
            Show notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Current view</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as typeof mode)}
              >
                <DropdownMenuRadioItem value="team">
                  Full team
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="player">
                  Individual profile
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medical">
                  Medical follow-up
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
