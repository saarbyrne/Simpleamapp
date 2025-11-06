import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button } from './button';
import { InfoIcon } from 'lucide-react';
import { tokens } from '@/design-system/tokens';
import { Icon } from './icon';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="View help">
          <Icon icon={InfoIcon} size="sm" decorative />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span
          style={{
            fontSize: tokens.typography.body.xs.fontSize,
            lineHeight: tokens.typography.body.xs.lineHeight,
          }}
        >
          Check the wellness manual before closing the daily evaluation.
        </span>
      </TooltipContent>
    </Tooltip>
  ),
};
