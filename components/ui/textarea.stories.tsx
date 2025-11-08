import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Type your message here.',
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

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <Textarea {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    defaultValue: 'This is a textarea with some default content.',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Textarea {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This textarea is disabled.',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Textarea {...args} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <label htmlFor="bio" className="text-sm font-medium">
        Bio
      </label>
      <Textarea id="bio" placeholder="Tell us about yourself" />
      <p className="text-sm text-muted-foreground">
        You can use markdown syntax.
      </p>
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <div className="w-[500px] space-y-6 rounded-lg border p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Feedback Form</h3>
        <p className="text-sm text-muted-foreground">
          Share your thoughts with us
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback" className="text-sm font-medium">
            Feedback
          </label>
          <Textarea
            id="feedback"
            placeholder="Tell us what you think..."
          />
        </div>

        <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Submit Feedback
        </button>
      </div>
    </div>
  ),
};

export const DifferentStates: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <Textarea placeholder="Default state" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">With Content</p>
        <Textarea defaultValue="This textarea contains some text that demonstrates how the component handles content." />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Disabled</p>
        <Textarea disabled placeholder="This is disabled" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">With Error</p>
        <Textarea
          className="border-destructive"
          placeholder="This has an error"
        />
        <p className="text-sm text-destructive">This field is required</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { exclude: ['placeholder'] },
  },
};

export const LongContent: Story = {
  args: {
    defaultValue: `This is a longer piece of text to demonstrate how the textarea handles multi-line content.

The textarea will automatically expand to accommodate the content, making it easy to read and edit longer passages of text.

This is useful for things like:
- Writing blog posts or articles
- Entering detailed descriptions
- Providing feedback or comments
- Any other use case that requires multiple lines of text

The component uses the field-sizing-content class to automatically adjust its height based on the content.`,
  },
  render: (args) => (
    <div className="w-[600px]">
      <Textarea {...args} />
    </div>
  ),
};
