import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="summary" style={{ width: '320px' }}>
      <TabsList>
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="wellness">Wellness</TabsTrigger>
        <TabsTrigger value="load">Carga</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.gap.sm,
          }}
        >
          <h4
            style={{
              fontSize: tokens.typography.heading.h5.fontSize,
              fontWeight: tokens.typography.heading.h5.fontWeight,
              lineHeight: tokens.typography.heading.h5.lineHeight,
              color: tokens.colors.text.primary,
            }}
          >
            Balance semanal
          </h4>
          <p
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              lineHeight: tokens.typography.body.sm.lineHeight,
              color: tokens.colors.text.secondary,
            }}
          >
            La carga aguda se mantiene en rango. Revisa viernes para controlar la fatiga acumulada.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="wellness">
        <p
          style={{
            fontSize: tokens.typography.body.sm.fontSize,
            lineHeight: tokens.typography.body.sm.lineHeight,
            color: tokens.colors.text.secondary,
          }}
        >
          82% of the team completed the wellness form this morning.
        </p>
      </TabsContent>
      <TabsContent value="load">
        <p
          style={{
            fontSize: tokens.typography.body.sm.fontSize,
            lineHeight: tokens.typography.body.sm.lineHeight,
            color: tokens.colors.text.secondary,
          }}
        >
          Microciclo orientado a velocidad y potencia. Sugerido: reducir 15% la carga de fuerza el jueves.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
