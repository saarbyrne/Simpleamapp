import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Enter text',
    disabled: false,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: 'SimpleAM',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input placeholder="Default height (tokens)" />
      <Input placeholder="With helper text" />
      <Input placeholder="Password" type="password" />
    </div>
  ),
  parameters: {
    controls: { exclude: ['type', 'placeholder', 'disabled', 'defaultValue'] },
  },
};
