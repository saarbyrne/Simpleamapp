import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  args: {
    children: 'Label',
    htmlFor: undefined,
  },
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['ref'],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="name">Player name</Label>
      <Input id="name" placeholder="Jordan Smith" />
    </div>
  ),
  parameters: {
    controls: { exclude: ['children', 'htmlFor'] },
  },
};

export const HelpText: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="person@simpleam.app" />
      <p className="text-sm text-[color:var(--ds-text-secondary,#52525b)]">
        We&apos;ll use this to invite players to the platform.
      </p>
    </div>
  ),
  parameters: {
    controls: { exclude: ['children', 'htmlFor'] },
  },
};
