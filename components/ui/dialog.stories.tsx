import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    controls: {
      disable: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

function DialogDemo({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add player</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="player-name">Player name</Label>
            <Input id="player-name" placeholder="Jordan Smith" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="player-email">Email</Label>
            <Input id="player-email" type="email" placeholder="person@simpleam.app" />
          </div>
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => (
    <DialogDemo
      title="Add new player"
      description="Capture baseline information before assigning positions, loads, and notes."
    />
  ),
};

export const LongContent: Story = {
  render: () => (
    <DialogDemo
      title="Invite staff member"
      description="Invite coaches, medical staff, or analysts to collaborate."
    />
  ),
};
