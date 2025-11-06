import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarSeparator,
  SidebarInput,
} from './sidebar';
import { Button } from './button';
import { tokens } from '@/design-system/tokens';
import {
  BellIcon,
  CalendarIcon,
  HomeIcon,
  LayersIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { Icon } from './icon';

const meta: Meta<typeof SidebarProvider> = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SidebarProvider>;

const ExampleLayout = () => (
  <SidebarProvider
    style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.surface.base,
    }}
  >
    <Sidebar>
      <SidebarHeader>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.gap.sm,
            paddingLeft: tokens.spacing.spacing.sm,
            paddingRight: tokens.spacing.spacing.sm,
          }}
        >
          <SidebarTrigger />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.gap.xs,
            }}
          >
            <span
              style={{
                fontSize: tokens.typography.body.sm.fontSize,
                fontWeight: tokens.typography.fontWeight.semibold,
              }}
            >
              SimpleAM
            </span>
            <span
              style={{
                fontSize: tokens.typography.body.xs.fontSize,
                color: tokens.colors.text.secondary,
              }}
            >
              Temporada 2025
            </span>
          </div>
        </div>
        <SidebarInput placeholder="Search players..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Icon icon={HomeIcon} size="md" decorative className="mr-2" />
                  <span>Inicio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon icon={UsersIcon} size="md" decorative className="mr-2" />
                  <span>Squad</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon icon={CalendarIcon} size="md" decorative className="mr-2" />
                  <span>Calendario</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Wellness</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon icon={LayersIcon} size="md" decorative className="mr-2" />
                  <span>Forms</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <Icon icon={PlusIcon} size="sm" decorative />
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon icon={BellIcon} size="md" decorative className="mr-2" />
                  <span>Alerts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="View individual plans">
                  <Icon icon={SettingsIcon} size="md" decorative className="mr-2" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton isActive>
                      <span>Recovery</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <span>Acute load</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="secondary">Invite staff</Button>
        <Button>New report</Button>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.gap.lg,
          padding: tokens.spacing.spacing['3xl'],
        }}
      >
        <h2
          style={{
            fontSize: tokens.typography.heading.h3.fontSize,
            fontWeight: tokens.typography.heading.h3.fontWeight,
            lineHeight: tokens.typography.heading.h3.lineHeight,
            color: tokens.colors.text.primary,
          }}
        >
          Panel principal
        </h2>
        <p
          style={{
            fontSize: tokens.typography.body.md.fontSize,
            lineHeight: tokens.typography.body.md.lineHeight,
            color: tokens.colors.text.secondary,
            maxWidth: '42rem',
          }}
        >
          Use the sidebar to navigate critical team information: wellness
          daily, training loads, medical documentation and custom reports.
        </p>
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const Default: Story = {
  render: () => <ExampleLayout />,
};
