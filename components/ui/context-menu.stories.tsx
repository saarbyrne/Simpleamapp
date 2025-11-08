import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './context-menu';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';
import { ClipboardCopyIcon, Share2Icon, PenSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { Icon } from './icon';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Context Menu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => {
    const [showNotifications, setShowNotifications] = useState(true);
    const [view, setView] = useState<'overview' | 'medical' | 'training'>(
      'overview',
    );

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Right-click the button below to open the context menu
        </p>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Button variant="secondary" className="w-48">
              Player: Jordan Smith
            </Button>
          </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Quick Actions</ContextMenuLabel>
          <ContextMenuItem>
            <Icon icon={PenSquareIcon} size="sm" decorative className="mr-2" />
            <span>Open profile</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Icon icon={ClipboardCopyIcon} size="sm" decorative className="mr-2" />
            <span>Copy link</span>
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <Icon icon={Share2Icon} size="sm" decorative className="mr-2" />
            <span>Disable notifications</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showNotifications}
            onCheckedChange={(checked) =>
              setShowNotifications(Boolean(checked))
            }
          >
            Wellness alerts
          </ContextMenuCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <span>Vista predeterminada</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={view}
                onValueChange={(value) => setView(value as typeof view)}
              >
                <ContextMenuRadioItem value="overview">
                  Resumen general
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="medical">
                  Medical follow-up
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="training">
                  Training load
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
      </div>
    );
  },
};
