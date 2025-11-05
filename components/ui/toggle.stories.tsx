import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import { tokens } from '@/design-system/tokens';
import { Icon } from './icon';

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
      <Icon icon={BoldIcon} size="sm" decorative />
    </Toggle>
  ),
};

export const Group: StoryObj<typeof ToggleGroup> = {
  render: () => (
    <ToggleGroup type="multiple" style={{ gap: tokens.spacing.gap.xs }}>
      <ToggleGroupItem value="bold" aria-label="Negrita">
        <Icon icon={BoldIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Itálica">
        <Icon icon={ItalicIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Subrayado">
        <Icon icon={UnderlineIcon} size="sm" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
