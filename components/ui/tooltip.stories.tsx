import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button } from './button';
import { InfoIcon } from 'lucide-react';
import { tokens } from '@/design-system/tokens';

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
        <Button variant="ghost" size="icon" aria-label="Ver ayuda">
          <InfoIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span
          style={{
            fontSize: tokens.typography.body.xs.fontSize,
            lineHeight: tokens.typography.body.xs.lineHeight,
          }}
        >
          Consulta el manual de wellness antes de cerrar la evaluación diaria.
        </span>
      </TooltipContent>
    </Tooltip>
  ),
};
