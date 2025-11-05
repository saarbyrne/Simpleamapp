import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Weekly wellness summary</CardTitle>
        <CardDescription>
          Track readiness, workload y tendencia de lesiones a lo largo de la semana.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-[color:var(--ds-text-secondary,#52525b)]">
          <p>• 78% de los jugadores completaron el cuestionario de bienestar.</p>
          <p>• Dos alertas tempranas de fatiga en el grupo de defensas.</p>
          <p>• Recomendación: reducir la carga en la sesión del jueves.</p>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Plan de entrenamiento</CardTitle>
        <CardDescription>Revisa y ajusta la planificación de la próxima semana.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[color:var(--ds-text-secondary,#52525b)]">
          La carga total se mantiene dentro del rango objetivo. Revisa los microciclos del martes y
          jueves para equilibrar intensidad y recuperación.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Ver agenda</Button>
        <CardAction>
          <Button>Actualizar plan</Button>
        </CardAction>
      </CardFooter>
    </Card>
  ),
};

export const MediaLayout: Story = {
  render: () => (
    <Card className="md:flex-row md:items-center md:gap-0">
      <CardContent className="md:w-1/3">
        <div className="aspect-video overflow-hidden rounded-md bg-[color:var(--ds-surface-overlay,#18181b)]" />
      </CardContent>
      <CardContent className="md:w-2/3 md:border-l md:[&:last-child]:pb-0">
        <CardHeader className="md:px-0 md:pt-0">
          <CardTitle>Reporte de video</CardTitle>
          <CardDescription>
            Clips listos para compartir con el staff técnico y los jugadores clave.
          </CardDescription>
        </CardHeader>
        <div className="space-y-2 text-sm text-[color:var(--ds-text-secondary,#52525b)]">
          <p>• Acciones destacadas del último partido.</p>
          <p>• Segmentos tácticos para trabajar en cancha.</p>
          <p>• Clips específicos para sesiones individuales.</p>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    layout: 'centered',
  },
};
