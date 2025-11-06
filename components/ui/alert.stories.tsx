import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Remember to record daily wellness</AlertTitle>
      <AlertDescription>
        Players have until 09:00 to complete the form. We will notify you if someone
        doesn't submit it.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Medical warning</AlertTitle>
      <AlertDescription>
        Alex Martínez was marked as "unavailable" by the medical staff. Avoid including him in
        high-load sessions until further notice.
      </AlertDescription>
    </Alert>
  ),
};
