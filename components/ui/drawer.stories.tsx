import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from './drawer';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Abrir panel lateral</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notas del staff</DrawerTitle>
          <DrawerDescription>
            Use this panel to coordinate quick messages during the match or session.
          </DrawerDescription>
        </DrawerHeader>
        <div
          style={{
            padding: tokens.spacing.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.gap.sm,
          }}
        >
          <p
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              lineHeight: tokens.typography.body.sm.lineHeight,
              color: tokens.colors.text.secondary,
            }}
          >
            • Ajustar marcaje en pelota parada.
          </p>
          <p
            style={{
              fontSize: tokens.typography.body.sm.fontSize,
              lineHeight: tokens.typography.body.sm.lineHeight,
              color: tokens.colors.text.secondary,
            }}
          >
            • Remember load control for starters tomorrow.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
          <Button>Send to team</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
