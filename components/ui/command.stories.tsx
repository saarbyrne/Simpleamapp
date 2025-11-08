import type { Meta, StoryObj } from '@storybook/react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './command';
import { useState } from 'react';

const meta: Meta<typeof CommandDialog> = {
  title: 'Components/Command',
  component: CommandDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof CommandDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Main Navigation">
            <CommandItem>
              Open dashboard
              <CommandShortcut>⌘ D</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Squad
              <CommandShortcut>⌘ P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Load calendar
              <CommandShortcut>⌘ C</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem>Create wellness evaluation</CommandItem>
            <CommandItem>Invite new staff</CommandItem>
            <CommandItem>Export weekly report</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
  },
};
