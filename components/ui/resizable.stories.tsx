import type { Meta, StoryObj } from '@storybook/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '480px', height: '220px' }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60}>
          <div
            style={{
              height: '100%',
              padding: tokens.spacing.spacing.md,
              backgroundColor: tokens.colors.surface.sunken,
              borderRadius: tokens.radius.radius.sm,
            }}
          >
            Sesión actual
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div
            style={{
              height: '100%',
              padding: tokens.spacing.spacing.md,
              backgroundColor: tokens.colors.surface.elevated,
              borderRadius: tokens.radius.radius.sm,
              border: `1px solid ${tokens.colors.border.default}`,
            }}
          >
            Notas rápidas
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
