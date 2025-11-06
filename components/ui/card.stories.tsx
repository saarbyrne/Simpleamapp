import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
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
          Track readiness, workload and injury trends throughout the week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-[color:var(--ds-text-secondary,#52525b)]">
          <p>• 78% of players completed the wellness questionnaire.</p>
          <p>• Two early fatigue alerts in the defender group.</p>
          <p>• Recommendation: reduce load in Thursday's session.</p>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Training plan</CardTitle>
        <CardDescription>Review and adjust next week's schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[color:var(--ds-text-secondary,#52525b)]">
          Total load remains within target range. Review Tuesday and Thursday microcycles
          to balance intensity and recovery.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="secondary">View schedule</Button>
        <Button>Update plan</Button>
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
          <CardTitle>Video report</CardTitle>
          <CardDescription>
            Clips ready to share with technical staff and key players.
          </CardDescription>
        </CardHeader>
        <div className="space-y-2 text-sm text-[color:var(--ds-text-secondary,#52525b)]">
          <p>• Highlights from the last match.</p>
          <p>• Tactical segments for field work.</p>
          <p>• Specific clips for individual sessions.</p>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    layout: 'centered',
  },
};
