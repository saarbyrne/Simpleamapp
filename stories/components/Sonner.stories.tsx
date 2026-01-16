'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => toast('Player added successfully')}>
        Show Toast
      </Button>
      <Button onClick={() => toast('This is a basic notification message')}>
        Basic Message
      </Button>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => toast.success('Player saved successfully')}>
        Success Toast
      </Button>
      <Button onClick={() => toast.success('Team created and added to league')}>
        Team Created
      </Button>
      <Button onClick={() => toast.success('Match scheduled for next week')}>
        Match Scheduled
      </Button>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="destructive"
        onClick={() => toast.error('Failed to save player')}
      >
        Error Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error('Unable to connect to server')}
      >
        Connection Error
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error('Invalid player data provided')}
      >
        Validation Error
      </Button>
    </div>
  ),
};

export const Info: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        onClick={() => toast.info('Match starts in 30 minutes')}
      >
        Info Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('New feature: Player statistics dashboard')}
      >
        Feature Announcement
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('System maintenance scheduled for tonight')}
      >
        Maintenance Notice
      </Button>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="secondary"
        onClick={() => toast.warning('Player contract expires soon')}
      >
        Warning Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning('Team roster is incomplete')}
      >
        Roster Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning('Low inventory of equipment')}
      >
        Inventory Warning
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() => {
          const toastId = toast.loading('Saving player data...');
          setTimeout(() => {
            toast.success('Player saved successfully', { id: toastId });
          }, 2000);
        }}
      >
        Loading Toast
      </Button>
      <Button
        onClick={() => {
          const toastId = toast.loading('Uploading team logo...');
          setTimeout(() => {
            toast.success('Logo uploaded', { id: toastId });
          }, 3000);
        }}
      >
        Upload Progress
      </Button>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          toast('Player archived', {
            action: {
              label: 'Undo',
              onClick: () => toast.success('Player restored'),
            },
          })
        }
      >
        With Action
      </Button>
      <Button
        onClick={() =>
          toast.success('Match result saved', {
            action: {
              label: 'View',
              onClick: () => toast.info('Opening match details...'),
            },
          })
        }
      >
        Success with Action
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error('Failed to delete team', {
            action: {
              label: 'Retry',
              onClick: () => toast.loading('Retrying...'),
            },
          })
        }
      >
        Error with Retry
      </Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          toast('New player registered', {
            description: 'Alex Johnson has been added to the Warriors roster',
          })
        }
      >
        With Description
      </Button>
      <Button
        onClick={() =>
          toast.success('Match completed', {
            description: 'Warriors defeated Eagles 3-1 in a thrilling match',
          })
        }
      >
        Match Result
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error('Upload failed', {
            description: 'The file size exceeds the maximum limit of 10MB',
          })
        }
      >
        Error Details
      </Button>
    </div>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={() =>
          toast('Quick notification', {
            duration: 1000,
          })
        }
      >
        1 Second
      </Button>
      <Button
        onClick={() =>
          toast.success('Standard notification', {
            duration: 4000,
          })
        }
      >
        4 Seconds (Default)
      </Button>
      <Button
        onClick={() =>
          toast.info('Important: Read carefully', {
            duration: 10000,
          })
        }
      >
        10 Seconds
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast('Stays until dismissed', {
            duration: Infinity,
          })
        }
      >
        Infinite
      </Button>
    </div>
  ),
};

export const SportsAppExamples: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Sports Management Actions</CardTitle>
        <CardDescription>Common notification scenarios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          className="w-full"
          onClick={() =>
            toast.success('Player profile updated', {
              description: 'Changes saved for Alex Johnson',
            })
          }
        >
          Save Player
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            const toastId = toast.loading('Processing match statistics...');
            setTimeout(() => {
              toast.success('Statistics updated for all players', { id: toastId });
            }, 2500);
          }}
        >
          Update Statistics
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() =>
            toast.warning('Match conflict detected', {
              description: 'Warriors already have a match scheduled at this time',
              action: {
                label: 'View Schedule',
                onClick: () => toast.info('Opening calendar...'),
              },
            })
          }
        >
          Schedule Match
        </Button>
        <Button
          className="w-full"
          variant="destructive"
          onClick={() =>
            toast.error('Failed to delete player', {
              description: 'Player is assigned to active matches',
              action: {
                label: 'Details',
                onClick: () => toast.info('Player has 3 upcoming matches'),
              },
            })
          }
        >
          Delete Player
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() =>
            toast('Team invitation sent', {
              description: 'Invitation sent to player@example.com',
              action: {
                label: 'Resend',
                onClick: () => toast.success('Invitation resent'),
              },
            })
          }
        >
          Send Invitation
        </Button>
      </CardContent>
    </Card>
  ),
};
