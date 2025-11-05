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
      <AlertTitle>Recuerda registrar el wellness diario</AlertTitle>
      <AlertDescription>
        Los jugadores tienen hasta las 09:00 para completar el formulario. Te avisaremos si alguien
        no lo envía.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Advertencia médica</AlertTitle>
      <AlertDescription>
        Alex Martínez fue marcado como “no disponible” por el staff médico. Evita incluirlo en las
        sesiones de alta carga hasta nuevo aviso.
      </AlertDescription>
    </Alert>
  ),
};
