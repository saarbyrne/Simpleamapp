import type { Meta, StoryObj } from '@storybook/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, Area, AreaChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';

const meta: Meta<typeof ChartContainer> = {
  title: 'Components/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const playerGoalsData = [
  { player: 'Alex', goals: 12, assists: 8 },
  { player: 'Sam', goals: 5, assists: 15 },
  { player: 'Jordan', goals: 2, assists: 3 },
  { player: 'Taylor', goals: 0, assists: 1 },
  { player: 'Morgan', goals: 18, assists: 6 },
];

const chartConfig = {
  goals: {
    label: 'Goals',
    color: 'hsl(var(--chart-1))',
  },
  assists: {
    label: 'Assists',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const BarChartBasic: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Player Goals</CardTitle>
        <CardDescription>Goals scored this season</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={playerGoalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="player" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="goals" fill="var(--color-goals)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

export const BarChartStacked: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Player Statistics</CardTitle>
        <CardDescription>Goals and assists comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={playerGoalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="player" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="goals" fill="var(--color-goals)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="assists" fill="var(--color-assists)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

const seasonData = [
  { month: 'Jan', wins: 4, losses: 2, draws: 1 },
  { month: 'Feb', wins: 5, losses: 1, draws: 2 },
  { month: 'Mar', wins: 3, losses: 3, draws: 2 },
  { month: 'Apr', wins: 6, losses: 1, draws: 1 },
  { month: 'May', wins: 5, losses: 2, draws: 1 },
  { month: 'Jun', wins: 4, losses: 2, draws: 2 },
];

const seasonChartConfig = {
  wins: {
    label: 'Wins',
    color: 'hsl(var(--chart-1))',
  },
  losses: {
    label: 'Losses',
    color: 'hsl(var(--chart-2))',
  },
  draws: {
    label: 'Draws',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export const LineChartBasic: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Season Performance</CardTitle>
        <CardDescription>Monthly win/loss record</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={seasonChartConfig}>
          <LineChart data={seasonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="wins"
              stroke="var(--color-wins)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-wins)' }}
            />
            <Line
              type="monotone"
              dataKey="losses"
              stroke="var(--color-losses)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-losses)' }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

const attendanceData = [
  { month: 'Jan', attendance: 4500 },
  { month: 'Feb', attendance: 5200 },
  { month: 'Mar', attendance: 4800 },
  { month: 'Apr', attendance: 6100 },
  { month: 'May', attendance: 5800 },
  { month: 'Jun', attendance: 6500 },
];

const attendanceConfig = {
  attendance: {
    label: 'Attendance',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export const AreaChartBasic: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Match Attendance</CardTitle>
        <CardDescription>Average attendance per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={attendanceConfig}>
          <AreaChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="var(--color-attendance)"
              fill="var(--color-attendance)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

const positionData = [
  { position: 'Forward', count: 8, fill: 'hsl(var(--chart-1))' },
  { position: 'Midfielder', count: 10, fill: 'hsl(var(--chart-2))' },
  { position: 'Defender', count: 9, fill: 'hsl(var(--chart-3))' },
  { position: 'Goalkeeper', count: 3, fill: 'hsl(var(--chart-4))' },
];

const positionConfig = {
  count: {
    label: 'Players',
  },
  Forward: {
    label: 'Forwards',
    color: 'hsl(var(--chart-1))',
  },
  Midfielder: {
    label: 'Midfielders',
    color: 'hsl(var(--chart-2))',
  },
  Defender: {
    label: 'Defenders',
    color: 'hsl(var(--chart-3))',
  },
  Goalkeeper: {
    label: 'Goalkeepers',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export const PieChartBasic: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Squad Composition</CardTitle>
        <CardDescription>Players by position</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={positionConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="position" />} />
            <Pie data={positionData} dataKey="count" nameKey="position" label>
              {positionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="position" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};

const performanceData = [
  { week: 'Week 1', goals: 3, assists: 5, saves: 8 },
  { week: 'Week 2', goals: 5, assists: 7, saves: 12 },
  { week: 'Week 3', goals: 2, assists: 4, saves: 6 },
  { week: 'Week 4', goals: 4, assists: 6, saves: 10 },
  { week: 'Week 5', goals: 6, assists: 8, saves: 14 },
];

const performanceConfig = {
  goals: {
    label: 'Goals',
    color: 'hsl(var(--chart-1))',
  },
  assists: {
    label: 'Assists',
    color: 'hsl(var(--chart-2))',
  },
  saves: {
    label: 'Saves',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export const MultiLineChart: Story = {
  render: () => (
    <Card className="w-[700px]">
      <CardHeader>
        <CardTitle>Team Performance Metrics</CardTitle>
        <CardDescription>Weekly statistics across all categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={performanceConfig}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="goals"
              stroke="var(--color-goals)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="assists"
              stroke="var(--color-assists)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="saves"
              stroke="var(--color-saves)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  ),
};
