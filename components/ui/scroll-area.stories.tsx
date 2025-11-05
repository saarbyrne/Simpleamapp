import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Scroll Area',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea
      style={{
        width: '320px',
        height: '180px',
        border: `1px solid ${tokens.colors.border.default}`,
        borderRadius: tokens.radius.radius.md,
        padding: tokens.spacing.spacing.sm,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.sm,
        }}
      >
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              lineHeight: tokens.typography.body.sm.lineHeight,
              color: tokens.colors.text.primary,
            }}
          >
            Registro #{index + 1}: resumen de la sesión de entrenamiento y notas para el staff.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
