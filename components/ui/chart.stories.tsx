import type { Meta, StoryObj } from '@storybook/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from './chart';
import { tokens } from '@/design-system/tokens';

const data = [
  { day: 'Lun', load: 62, intensity: 48 },
  { day: 'Mar', load: 68, intensity: 54 },
  { day: 'Mié', load: 72, intensity: 57 },
  { day: 'Jue', load: 70, intensity: 55 },
  { day: 'Vie', load: 78, intensity: 61 },
  { day: 'Sáb', load: 65, intensity: 49 },
];

const chartConfig: ChartConfig = {
  load: {
    label: 'Player Load',
    color: tokens.colors.interactive.primary,
  },
  intensity: {
    label: 'High-Speed Distance',
    color: tokens.colors.interactive.secondary,
  },
};

const meta: Meta<typeof ChartContainer> = {
  title: 'Components/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ChartContainer>;

export const AreaPerformance: Story = {
  render: () => (
    <div
      style={{
        width: '520px',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.gap.md,
      }}
    >
      <ChartContainer config={chartConfig} style={{ height: 320 }}>
        <AreaChart data={data} margin={{ left: 24, right: 24 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={32}
            domain={[40, 90]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="load"
            stroke="var(--color-load)"
            fill="var(--color-load)"
            fillOpacity={0.14}
          />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="var(--color-intensity)"
            fill="var(--color-intensity)"
            fillOpacity={0.12}
          />
          <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  ),
};
