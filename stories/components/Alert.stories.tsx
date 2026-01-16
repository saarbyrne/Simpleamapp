import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, AlertCircle, CheckCircle2, Info as InfoIcon, AlertTriangle } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert className="border-green-500/50 text-green-600 dark:border-green-500 dark:text-green-400">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert className="border-blue-500/50 text-blue-600 dark:border-blue-500 dark:text-blue-400">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        New features have been added to the dashboard. Check them out!
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert className="border-yellow-500/50 text-yellow-600 dark:border-yellow-500 dark:text-yellow-400">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        You can use alerts without icons by simply not including an icon element.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>This alert only has a title</AlertTitle>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertDescription>
        This alert only has a description without a title.
      </AlertDescription>
    </Alert>
  ),
};

export const PlayerRegistrationSuccess: Story = {
  render: () => (
    <Alert className="border-green-500/50 text-green-600 dark:border-green-500 dark:text-green-400">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Player Registered</AlertTitle>
      <AlertDescription>
        John Doe has been successfully registered to Team A. The player is now active and can participate in upcoming events.
      </AlertDescription>
    </Alert>
  ),
};

export const ReportPendingWarning: Story = {
  render: () => (
    <Alert className="border-yellow-500/50 text-yellow-600 dark:border-yellow-500 dark:text-yellow-400">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Reports Pending</AlertTitle>
      <AlertDescription>
        You have 3 game reports that need to be submitted within the next 24 hours. Late submissions may result in penalties.
      </AlertDescription>
    </Alert>
  ),
};

export const TeamApprovalError: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Team Registration Failed</AlertTitle>
      <AlertDescription>
        Unable to process team registration. The team name is already taken or some required fields are missing. Please review and try again.
      </AlertDescription>
    </Alert>
  ),
};

export const SystemMaintenance: Story = {
  render: () => (
    <Alert className="border-blue-500/50 text-blue-600 dark:border-blue-500 dark:text-blue-400">
      <Info className="h-4 w-4" />
      <AlertTitle>Scheduled Maintenance</AlertTitle>
      <AlertDescription>
        The system will undergo maintenance on Saturday, January 20th from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable during this time.
      </AlertDescription>
    </Alert>
  ),
};

export const MultipleAlerts: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>This is the default alert style.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This is the destructive alert style.</AlertDescription>
      </Alert>
      <Alert className="border-green-500/50 text-green-600 dark:border-green-500 dark:text-green-400">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>This is a custom success alert.</AlertDescription>
      </Alert>
    </div>
  ),
};
