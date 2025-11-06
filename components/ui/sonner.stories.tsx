import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './sonner';
import { Button } from './button';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.success('Formulario de wellness enviado', {
            description: 'Se notificó a los preparadores físicos.',
          })
        }
      >
        Show notification
      </Button>
      <Toaster position="top-right" richColors closeButton />
    </>
  ),
};
