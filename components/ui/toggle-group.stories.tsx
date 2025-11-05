import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import { Icon } from './icon';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  args: {
    type: 'single',
  },
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['ref', 'asChild'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  args: {
    type: 'single',
    defaultValue: 'center',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <Icon icon={AlignLeftIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <Icon icon={AlignCenterIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <Icon icon={AlignRightIcon} size="sm" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['bold'],
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Icon icon={BoldIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Icon icon={ItalicIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Icon icon={UnderlineIcon} size="sm" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  args: {
    type: 'single',
    variant: 'outline',
    defaultValue: 'center',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <Icon icon={AlignLeftIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <Icon icon={AlignCenterIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <Icon icon={AlignRightIcon} size="sm" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const WithText: Story = {
  args: {
    type: 'single',
    defaultValue: 'grid',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem value="table">Table</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Small: Story = {
  args: {
    type: 'single',
    size: 'sm',
    defaultValue: 'center',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <Icon icon={AlignLeftIcon} size="xs" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <Icon icon={AlignCenterIcon} size="xs" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <Icon icon={AlignRightIcon} size="xs" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Large: Story = {
  args: {
    type: 'single',
    size: 'lg',
    defaultValue: 'center',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <Icon icon={AlignLeftIcon} size="md" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <Icon icon={AlignCenterIcon} size="md" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <Icon icon={AlignRightIcon} size="md" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  args: {
    type: 'single',
    disabled: true,
    defaultValue: 'center',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <Icon icon={AlignLeftIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <Icon icon={AlignCenterIcon} size="sm" decorative />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <Icon icon={AlignRightIcon} size="sm" decorative />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default - Single Selection</p>
        <ToggleGroup type="single" defaultValue="center">
          <ToggleGroupItem value="left" aria-label="Left aligned">
            <AlignLeftIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center aligned">
            <AlignCenterIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right aligned">
            <AlignRightIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Outline - Multiple Selection</p>
        <ToggleGroup type="multiple" variant="outline" defaultValue={['bold', 'italic']}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">With Text Labels</p>
        <ToggleGroup type="single" defaultValue="grid">
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Sizes</p>
        <div className="flex flex-col gap-4">
          <ToggleGroup type="single" size="sm" defaultValue="center">
            <ToggleGroupItem value="left">Small</ToggleGroupItem>
            <ToggleGroupItem value="center">Small</ToggleGroupItem>
            <ToggleGroupItem value="right">Small</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size="default" defaultValue="center">
            <ToggleGroupItem value="left">Default</ToggleGroupItem>
            <ToggleGroupItem value="center">Default</ToggleGroupItem>
            <ToggleGroupItem value="right">Default</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size="lg" defaultValue="center">
            <ToggleGroupItem value="left">Large</ToggleGroupItem>
            <ToggleGroupItem value="center">Large</ToggleGroupItem>
            <ToggleGroupItem value="right">Large</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { exclude: ['type', 'variant', 'size'] },
  },
};
