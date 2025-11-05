import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconButton, IconInline, IconNav, IconEmptyState } from './icon';
import {
  CheckIcon,
  AlertCircleIcon,
  InfoIcon,
  XIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
  BellIcon,
  SearchIcon,
  FileIcon,
  FolderIcon,
  MailIcon,
  HeartIcon,
  StarIcon,
  TrendingUpIcon,
  PackageIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from 'lucide-react';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: CheckIcon,
    label: 'Success',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icon Sizes</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} size="xs" decorative />
            <span className="text-xs text-muted-foreground">xs (12px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} size="sm" decorative />
            <span className="text-xs text-muted-foreground">sm (16px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} size="md" decorative />
            <span className="text-xs text-muted-foreground">md (20px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} size="lg" decorative />
            <span className="text-xs text-muted-foreground">lg (24px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} size="xl" decorative />
            <span className="text-xs text-muted-foreground">xl (32px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} size="2xl" decorative />
            <span className="text-xs text-muted-foreground">2xl (48px)</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icon Colors</h3>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Icon icon={CheckIcon} color="inherit" decorative />
            <span className="text-sm">Inherit (currentColor)</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={CheckIcon} color="primary" decorative />
            <span className="text-sm">Primary</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={CheckIcon} color="secondary" decorative />
            <span className="text-sm">Secondary</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={CheckIcon} color="success" decorative />
            <span className="text-sm">Success</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={AlertCircleIcon} color="error" decorative />
            <span className="text-sm">Error</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={AlertCircleIcon} color="warning" decorative />
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={InfoIcon} color="info" decorative />
            <span className="text-sm">Info</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon={CheckIcon} color="disabled" decorative />
            <span className="text-sm">Disabled</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StrokeWeights: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stroke Weights</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} strokeWidth="thin" size="xl" decorative />
            <span className="text-xs text-muted-foreground">Thin (1px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} strokeWidth="regular" size="xl" decorative />
            <span className="text-xs text-muted-foreground">Regular (1.5px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} strokeWidth="medium" size="xl" decorative />
            <span className="text-xs text-muted-foreground">Medium (2px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={CheckIcon} strokeWidth="bold" size="xl" decorative />
            <span className="text-xs text-muted-foreground">Bold (2.5px)</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Helpers: Story = {
  render: () => (
    <div className="w-[600px] space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Helper Components</h3>

        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">IconButton - For buttons with icons</p>
            <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <IconButton icon={CheckIcon} label="Save" />
              Save Changes
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">IconInline - For inline text</p>
            <p className="text-sm">
              Click here <IconInline icon={InfoIcon} /> to learn more about our services.
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">IconNav - For navigation items</p>
            <nav className="space-y-2">
              <div className="flex items-center rounded-md p-2 hover:bg-accent">
                <IconNav icon={HomeIcon} label="Home" />
                <span>Home</span>
              </div>
              <div className="flex items-center rounded-md p-2 hover:bg-accent">
                <IconNav icon={SettingsIcon} label="Settings" />
                <span>Settings</span>
              </div>
              <div className="flex items-center rounded-md p-2 hover:bg-accent">
                <IconNav icon={UserIcon} label="Profile" />
                <span>Profile</span>
              </div>
            </nav>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">IconEmptyState - For empty states</p>
            <div className="rounded-lg border bg-muted/50 p-12 text-center">
              <IconEmptyState icon={PackageIcon} label="No items" />
              <p className="mt-4 text-sm text-muted-foreground">No items found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CommonUseCases: Story = {
  render: () => (
    <div className="w-[700px] space-y-8">
      <h3 className="text-lg font-semibold">Common Use Cases</h3>

      {/* Search Input */}
      <div>
        <p className="mb-2 text-sm font-medium">Search Input</p>
        <div className="relative">
          <Icon
            icon={SearchIcon}
            size="md"
            color="secondary"
            decorative
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Alert Messages */}
      <div>
        <p className="mb-3 text-sm font-medium">Alert Messages</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
            <Icon icon={CheckIcon} size="md" color="success" label="Success" />
            <div>
              <p className="text-sm font-medium">Success</p>
              <p className="text-sm text-muted-foreground">Your changes have been saved.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
            <Icon icon={AlertCircleIcon} size="md" color="error" label="Error" />
            <div>
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm text-muted-foreground">Something went wrong. Please try again.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
            <Icon icon={InfoIcon} size="md" color="info" label="Information" />
            <div>
              <p className="text-sm font-medium">Info</p>
              <p className="text-sm text-muted-foreground">This feature is currently in beta.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards with Icons */}
      <div>
        <p className="mb-3 text-sm font-medium">Cards with Icons</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <Icon icon={TrendingUpIcon} size="lg" color="success" decorative className="mb-2" />
            <p className="text-2xl font-bold">$12,345</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <Icon icon={UserIcon} size="lg" color="primary" decorative className="mb-2" />
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">Users</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <Icon icon={ShoppingCartIcon} size="lg" color="warning" decorative className="mb-2" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Orders</p>
          </div>
        </div>
      </div>

      {/* Buttons with Icons */}
      <div>
        <p className="mb-3 text-sm font-medium">Buttons with Icons</p>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Icon icon={CheckIcon} size="sm" decorative className="mr-2" />
            Save
          </button>
          <button className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium">
            <Icon icon={XIcon} size="sm" decorative className="mr-2" />
            Cancel
          </button>
          <button className="inline-flex items-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground">
            <Icon icon={XIcon} size="sm" decorative className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  ),
};

export const IconLibrary: Story = {
  render: () => {
    const icons = [
      { icon: HomeIcon, name: 'Home' },
      { icon: UserIcon, name: 'User' },
      { icon: SettingsIcon, name: 'Settings' },
      { icon: BellIcon, name: 'Bell' },
      { icon: SearchIcon, name: 'Search' },
      { icon: FileIcon, name: 'File' },
      { icon: FolderIcon, name: 'Folder' },
      { icon: MailIcon, name: 'Mail' },
      { icon: HeartIcon, name: 'Heart' },
      { icon: StarIcon, name: 'Star' },
      { icon: CheckIcon, name: 'Check' },
      { icon: XIcon, name: 'X' },
      { icon: InfoIcon, name: 'Info' },
      { icon: AlertCircleIcon, name: 'Alert' },
      { icon: TrendingUpIcon, name: 'Trending' },
      { icon: PackageIcon, name: 'Package' },
      { icon: ShoppingCartIcon, name: 'Cart' },
      { icon: CreditCardIcon, name: 'Credit' },
    ];

    return (
      <div className="w-[800px] space-y-4">
        <h3 className="text-lg font-semibold">Icon Library (Lucide React)</h3>
        <p className="text-sm text-muted-foreground">
          The design system uses Lucide React for icons. Here's a sample of commonly used icons:
        </p>
        <div className="grid grid-cols-6 gap-6">
          {icons.map(({ icon, name }) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-md p-3 hover:bg-accent">
              <Icon icon={icon} size="lg" decorative />
              <span className="text-xs text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Browse all available icons at{' '}
          <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            lucide.dev
          </a>
        </p>
      </div>
    );
  },
};

export const Accessibility: Story = {
  render: () => (
    <div className="w-[600px] space-y-8">
      <h3 className="text-lg font-semibold">Accessibility Patterns</h3>

      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium">Decorative Icons (aria-hidden)</p>
          <p className="text-sm text-muted-foreground mb-3">
            Icons that are purely visual and don't add meaning should be marked as decorative.
          </p>
          <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Icon icon={CheckIcon} size="sm" decorative className="mr-2" />
            Save (button text provides meaning)
          </button>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Semantic Icons (with labels)</p>
          <p className="text-sm text-muted-foreground mb-3">
            Icons that convey information need descriptive labels for screen readers.
          </p>
          <div className="flex gap-3">
            <button className="rounded-md border p-2">
              <Icon icon={CheckIcon} size="md" label="Mark as complete" />
            </button>
            <button className="rounded-md border p-2">
              <Icon icon={HeartIcon} size="md" label="Add to favorites" />
            </button>
            <button className="rounded-md border p-2">
              <Icon icon={BellIcon} size="md" label="Notifications" />
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Icon + Text Best Practice</p>
          <p className="text-sm text-muted-foreground mb-3">
            When possible, pair icons with text for clarity and accessibility.
          </p>
          <div className="flex gap-3">
            <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <Icon icon={CheckIcon} size="sm" decorative className="mr-2" />
              Complete
            </button>
            <button className="inline-flex items-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground">
              <Icon icon={XIcon} size="sm" decorative className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};
