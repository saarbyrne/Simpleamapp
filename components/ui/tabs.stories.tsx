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
        <TabsTrigger value="load">Load</TabsTrigger>
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
            Weekly balance
          </h4>
          <p
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              lineHeight: tokens.typography.body.sm.lineHeight,
              color: tokens.colors.text.secondary,
            }}
          >
            Acute load remains within range. Review Friday to control accumulated fatigue.
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
          Microcycle focused on speed and power. Suggested: reduce strength load by 15% on Thursday.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
