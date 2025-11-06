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
            className="bg-muted"
            style={{
              height: '100%',
              padding: tokens.spacing.spacing.md,
              borderRadius: tokens.radius.radius.sm,
            }}
          >
            Current session
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div
            className="bg-card border"
            style={{
              height: '100%',
              padding: tokens.spacing.spacing.md,
              borderRadius: tokens.radius.radius.sm,
            }}
          >
            Quick notes
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
