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
      {[
        {
          title: 'Recovery Plan',
          content: 'Mobility session + cryotherapy. Evaluate response before tomorrow\'s training.',
        },
        {
          title: 'Nutritional Recommendations',
          content: 'Increase complex carbohydrate intake the day before the match.',
        },
      ].map((item, index) => (
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
