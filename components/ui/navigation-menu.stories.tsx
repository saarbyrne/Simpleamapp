import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from './navigation-menu';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Components/Navigation Menu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Team</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink asChild>
              <div
                style={{
                  display: 'grid',
                  gap: tokens.spacing.gap.sm,
                  width: '220px',
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
                  Main squad
                </h4>
                <p
                  style={{
                    fontSize: tokens.typography.body.sm.fontSize,
                    lineHeight: tokens.typography.body.sm.lineHeight,
                    color: tokens.colors.text.secondary,
                  }}
                >
                  Manage availability, historical loads and medical documentation quickly.
                </p>
              </div>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Planning</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink asChild>
              <div
                style={{
                  display: 'grid',
                  gap: tokens.spacing.gap.xs,
                  width: '220px',
                }}
              >
                <span
                  style={{
                    fontSize: tokens.typography.body.sm.fontSize,
                    lineHeight: tokens.typography.body.sm.lineHeight,
                    color: tokens.colors.text.secondary,
                  }}
                >
                  • Weekly microcycles
                </span>
                <span
                  style={{
                    fontSize: tokens.typography.body.sm.fontSize,
                    lineHeight: tokens.typography.body.sm.lineHeight,
                    color: tokens.colors.text.secondary,
                  }}
                >
                  • Load per session
                </span>
                <span
                  style={{
                    fontSize: tokens.typography.body.sm.fontSize,
                    lineHeight: tokens.typography.body.sm.lineHeight,
                    color: tokens.colors.text.secondary,
                  }}
                >
                  • Overexertion alerts
                </span>
              </div>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
