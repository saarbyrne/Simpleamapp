import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: '320px' }}>
      {[{
        title: 'Plan de recuperación',
        content:
          'Sesión de movilidad + crioterapia. Evaluar respuesta antes del entrenamiento de mañana.',
      },
      {
        title: 'Recomendaciones nutricionales',
        content:
          'Aumentar ingesta de carbohidratos complejos el día previo al partido.',
      }].map((item, index) => (
        <AccordionItem key={item.title} value={`item-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <p
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                lineHeight: tokens.typography.body.sm.lineHeight,
                color: tokens.colors.text.secondary,
              }}
            >
              {item.content}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
