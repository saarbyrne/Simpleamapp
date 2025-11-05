import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Single: Story = {
  render: () => (
    <Toggle aria-label="Negrita" pressed>
      <BoldIcon className="size-4" />
    </Toggle>
  ),
};

export const Group: StoryObj<typeof ToggleGroup> = {
  render: () => (
    <ToggleGroup type="multiple" style={{ gap: tokens.spacing.gap.xs }}>
      <ToggleGroupItem value="bold" aria-label="Negrita">
        <BoldIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálica">
        <ItalicIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Subrayado">
        <UnderlineIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
