import type { Meta, StoryObj } from '@storybook/react'
import { Icon, IconButton, IconInline, IconNav, IconEmptyState } from '@/components/ui/icon'
import { tokens } from '@/design-system/tokens'
import {
  CheckIcon,
  XIcon,
  AlertCircleIcon,
  InfoIcon,
  HomeIcon,
  UsersIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  Download,
  UploadIcon,
  FileIcon,
  FolderIcon,
  MailIcon,
  BellIcon,
  HeartIcon,
  StarIcon,
  TrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  MessageSquareIcon,
  ShareIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  Loader2Icon,
  RefreshCwIcon,
} from 'lucide-react'

/**
 * # Icon System
 *
 * Our icon system provides consistent, accessible, and themeable icons across
 * the application using the Icon component wrapper.
 *
 * ## Features
 *
 * - **Consistent sizing** - Uses design token sizes (xs, sm, md, lg, xl, 2xl)
 * - **Semantic colors** - Integrated with color tokens
 * - **Accessibility** - Proper labels and decorative/semantic distinction
 * - **Dark mode ready** - Icons adapt to theme automatically
 * - **Helper components** - Pre-configured patterns for common use cases
 *
 * ## Library
 *
 * We use [Lucide React](https://lucide.dev) for our icon library.
 *
 * ## Usage
 *
 * ```tsx
 * import { Icon } from '@/components/ui/icon'
 * import { CheckIcon } from 'lucide-react'
 *
 * // Basic usage
 * <Icon icon={CheckIcon} size="md" label="Success" />
 *
 * // Decorative icon
 * <Icon icon={CheckIcon} size="sm" decorative />
 *
 * // Helper components
 * <IconButton icon={PlusIcon} label="Add item" />
 * <IconInline icon={InfoIcon} />
 * <IconNav icon={HomeIcon} label="Home" />
 * <IconEmptyState icon={InboxIcon} label="Empty inbox" />
 * ```
 */
const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icons',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Consistent, accessible icon system using Lucide React with design token integration.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

/**
 * Icon sizes from extra small to double extra large.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Icon Sizes</h2>
        <p className="text-muted-foreground mb-6">
          Six standardized sizes using design tokens
        </p>
      </div>

      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="xs" decorative />
          <div className="text-xs text-muted-foreground">xs (12px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="sm" decorative />
          <div className="text-xs text-muted-foreground">sm (16px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="md" decorative />
          <div className="text-xs text-muted-foreground">md (20px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="lg" decorative />
          <div className="text-xs text-muted-foreground">lg (24px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="xl" decorative />
          <div className="text-xs text-muted-foreground">xl (32px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="2xl" decorative />
          <div className="text-xs text-muted-foreground">2xl (48px)</div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Semantic color options for icons.
 */
export const Colors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Icon Colors</h2>
        <p className="text-muted-foreground mb-6">
          Semantic colors integrated with design tokens
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={InfoIcon} size="xl" color="inherit" decorative />
          <div className="text-sm font-medium">inherit</div>
          <div className="text-xs text-muted-foreground">currentColor</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={CheckIcon} size="xl" color="primary" decorative />
          <div className="text-sm font-medium">primary</div>
          <div className="text-xs text-muted-foreground">Interactive</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={InfoIcon} size="xl" color="secondary" decorative />
          <div className="text-sm font-medium">secondary</div>
          <div className="text-xs text-muted-foreground">Muted</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={CheckIcon} size="xl" color="success" decorative />
          <div className="text-sm font-medium">success</div>
          <div className="text-xs text-muted-foreground">Positive</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={AlertCircleIcon} size="xl" color="error" decorative />
          <div className="text-sm font-medium">error</div>
          <div className="text-xs text-muted-foreground">Destructive</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={AlertCircleIcon} size="xl" color="warning" decorative />
          <div className="text-sm font-medium">warning</div>
          <div className="text-xs text-muted-foreground">Caution</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={InfoIcon} size="xl" color="info" decorative />
          <div className="text-sm font-medium">info</div>
          <div className="text-xs text-muted-foreground">Informational</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Icon icon={InfoIcon} size="xl" color="disabled" decorative />
          <div className="text-sm font-medium">disabled</div>
          <div className="text-xs text-muted-foreground">Inactive</div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Stroke weight variations for different contexts.
 */
export const StrokeWeights: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stroke Weights</h2>
        <p className="text-muted-foreground mb-6">
          Four weight options for visual hierarchy
        </p>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="xl" strokeWidth="thin" decorative />
          <div className="text-xs text-muted-foreground">thin (1px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="xl" strokeWidth="regular" decorative />
          <div className="text-xs text-muted-foreground">regular (1.5px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="xl" strokeWidth="medium" decorative />
          <div className="text-xs text-muted-foreground">medium (2px)</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon icon={HeartIcon} size="xl" strokeWidth="bold" decorative />
          <div className="text-xs text-muted-foreground">bold (2.5px)</div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Helper components for common icon patterns.
 */
export const Helpers: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Helper Components</h2>
        <p className="text-muted-foreground mb-6">
          Pre-configured patterns for common use cases
        </p>
      </div>

      {/* IconButton */}
      <div className="space-y-3">
        <h3 className="font-semibold">IconButton</h3>
        <p className="text-sm text-muted-foreground">
          For icons in buttons (md size, medium stroke, right margin)
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center">
            <IconButton icon={PlusIcon} label="Add" />
            Add player
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center">
            <IconButton icon={Download} label="Download" />
            Download
          </button>
          <button className="px-4 py-2 border rounded-lg flex items-center">
            <IconButton icon={TrashIcon} label="Delete" />
            Delete
          </button>
        </div>
      </div>

      {/* IconInline */}
      <div className="space-y-3">
        <h3 className="font-semibold">IconInline</h3>
        <p className="text-sm text-muted-foreground">
          For icons within text (sm size, decorative, aligns with text)
        </p>
        <div className="space-y-2">
          <p className="text-base">
            <IconInline icon={InfoIcon} /> Learn more about player wellness metrics
          </p>
          <p className="text-base">
            <IconInline icon={AlertCircleIcon} /> This action cannot be undone
          </p>
          <p className="text-base">
            <IconInline icon={ExternalLinkIcon} /> Opens in new window
          </p>
        </div>
      </div>

      {/* IconNav */}
      <div className="space-y-3">
        <h3 className="font-semibold">IconNav</h3>
        <p className="text-sm text-muted-foreground">
          For navigation items (md size, right margin)
        </p>
        <div className="space-y-1 border rounded-lg p-2 w-64">
          <a href="#" className="flex items-center p-2 rounded hover:bg-accent">
            <IconNav icon={HomeIcon} label="Home" />
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded hover:bg-accent">
            <IconNav icon={UsersIcon} label="Players" />
            <span>Players</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded hover:bg-accent">
            <IconNav icon={CalendarIcon} label="Schedule" />
            <span>Schedule</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded hover:bg-accent">
            <IconNav icon={SettingsIcon} label="Settings" />
            <span>Settings</span>
          </a>
        </div>
      </div>

      {/* IconEmptyState */}
      <div className="space-y-3">
        <h3 className="font-semibold">IconEmptyState</h3>
        <p className="text-sm text-muted-foreground">
          For empty states (2xl size, thin stroke, centered)
        </p>
        <div className="border rounded-lg p-12 text-center">
          <IconEmptyState icon={FileIcon} label="No files" />
          <p className="mt-4 text-lg font-medium">No players yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first player to get started
          </p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Common usage patterns in real UI contexts.
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage Examples</h2>
        <p className="text-muted-foreground mb-6">
          Icons in real-world UI patterns
        </p>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <h3 className="font-semibold">Feedback Messages</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <Icon icon={CheckIcon} size="md" color="success" label="Success" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                Player saved successfully
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Jordan Smith has been added to your roster
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <Icon icon={XIcon} size="md" color="error" label="Error" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                Email is required
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Enter your email address to continue
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <Icon icon={AlertCircleIcon} size="md" color="warning" label="Warning" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Unsaved changes
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Your changes will be lost if you leave now
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Icon icon={InfoIcon} size="md" color="info" label="Information" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Roster sync enabled
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Player data syncs every 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons with icons */}
      <div className="space-y-3">
        <h3 className="font-semibold">Button Icons</h3>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center">
            <IconButton icon={PlusIcon} label="Add" />
            Add player
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center">
            <IconButton icon={UploadIcon} label="Upload" />
            Import CSV
          </button>
          <button className="px-4 py-2 border rounded-lg flex items-center">
            <IconButton icon={Download} label="Download" />
            Export
          </button>
          <button className="px-4 py-2 border rounded-lg flex items-center">
            Continue
            <Icon icon={ArrowRightIcon} size="sm" decorative className="ml-2" />
          </button>
        </div>
      </div>

      {/* Icon-only buttons */}
      <div className="space-y-3">
        <h3 className="font-semibold">Icon-Only Buttons</h3>
        <div className="flex gap-2">
          <button
            className="p-2 border rounded-lg hover:bg-accent"
            aria-label="Edit"
          >
            <Icon icon={EditIcon} size="md" label="Edit" />
          </button>
          <button
            className="p-2 border rounded-lg hover:bg-accent"
            aria-label="Delete"
          >
            <Icon icon={TrashIcon} size="md" label="Delete" />
          </button>
          <button
            className="p-2 border rounded-lg hover:bg-accent"
            aria-label="Share"
          >
            <Icon icon={ShareIcon} size="md" label="Share" />
          </button>
          <button
            className="p-2 border rounded-lg hover:bg-accent"
            aria-label="Refresh"
          >
            <Icon icon={RefreshCwIcon} size="md" label="Refresh" />
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="space-y-3">
        <h3 className="font-semibold">Stats Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Players</p>
                <p className="text-3xl font-bold mt-2">24</p>
              </div>
              <Icon icon={UsersIcon} size="xl" color="primary" decorative />
            </div>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Wellness</p>
                <p className="text-3xl font-bold mt-2">87</p>
              </div>
              <Icon icon={TrendingUpIcon} size="xl" color="success" decorative />
            </div>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-3xl font-bold mt-2">3</p>
              </div>
              <Icon icon={CalendarIcon} size="xl" color="info" decorative />
            </div>
          </div>
        </div>
      </div>

      {/* Loading states */}
      <div className="space-y-3">
        <h3 className="font-semibold">Loading States</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Icon icon={Loader2Icon} size="md" decorative className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center" disabled>
            <Icon icon={Loader2Icon} size="sm" decorative className="mr-2 animate-spin" />
            Saving...
          </button>
        </div>
      </div>
    </div>
  ),
}

/**
 * Icon library showcasing all available icons.
 */
export const IconLibrary: Story = {
  render: () => {
    const icons = [
      { icon: CheckIcon, name: 'Check' },
      { icon: XIcon, name: 'X' },
      { icon: AlertCircleIcon, name: 'AlertCircle' },
      { icon: InfoIcon, name: 'Info' },
      { icon: HomeIcon, name: 'Home' },
      { icon: UsersIcon, name: 'Users' },
      { icon: SettingsIcon, name: 'Settings' },
      { icon: SearchIcon, name: 'Search' },
      { icon: PlusIcon, name: 'Plus' },
      { icon: TrashIcon, name: 'Trash' },
      { icon: EditIcon, name: 'Edit' },
      { icon: Download, name: 'Download' },
      { icon: UploadIcon, name: 'Upload' },
      { icon: FileIcon, name: 'File' },
      { icon: FolderIcon, name: 'Folder' },
      { icon: MailIcon, name: 'Mail' },
      { icon: BellIcon, name: 'Bell' },
      { icon: HeartIcon, name: 'Heart' },
      { icon: StarIcon, name: 'Star' },
      { icon: TrendingUpIcon, name: 'TrendingUp' },
      { icon: CalendarIcon, name: 'Calendar' },
      { icon: ClockIcon, name: 'Clock' },
      { icon: MapPinIcon, name: 'MapPin' },
      { icon: PhoneIcon, name: 'Phone' },
      { icon: MessageSquareIcon, name: 'MessageSquare' },
      { icon: ShareIcon, name: 'Share' },
      { icon: ExternalLinkIcon, name: 'ExternalLink' },
      { icon: ChevronRightIcon, name: 'ChevronRight' },
      { icon: ChevronDownIcon, name: 'ChevronDown' },
      { icon: ArrowRightIcon, name: 'ArrowRight' },
      { icon: ArrowLeftIcon, name: 'ArrowLeft' },
      { icon: Loader2Icon, name: 'Loader2' },
      { icon: RefreshCwIcon, name: 'RefreshCw' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Icon Library</h2>
          <p className="text-muted-foreground mb-6">
            Commonly used icons from Lucide React. Browse the full library at{' '}
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              lucide.dev
            </a>
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {icons.map(({ icon: IconComponent, name }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Icon icon={IconComponent} size="lg" decorative />
              <div className="text-xs text-center text-muted-foreground">
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Accessibility guidelines for icons.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Accessibility</h2>
        <p className="text-muted-foreground mb-6">
          Ensuring icons are accessible to all users
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Use labels for semantic icons</h3>
          <div className="space-y-2 mt-3 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
              <code className="text-xs">
                {`<Icon icon={CheckIcon} label="Success" />`}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Screen readers will announce "Success"
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded">
              <code className="text-xs">
                {`<Icon icon={CheckIcon} />`}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                ❌ No label - screen readers can't describe the icon
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Mark decorative icons</h3>
          <div className="space-y-2 mt-3 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
              <code className="text-xs">
                {`<Icon icon={ArrowRightIcon} decorative />`}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Icon with adjacent text can be decorative
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Icon-only buttons need labels</h3>
          <div className="space-y-2 mt-3 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
              <code className="text-xs">
                {`<button aria-label="Delete">\n  <Icon icon={TrashIcon} label="Delete" />\n</button>`}
              </code>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Ensure sufficient contrast</h3>
          <p className="text-sm text-muted-foreground">
            Icons must have 3:1 contrast ratio against background (WCAG 2.1 AA).
            Use semantic color tokens to ensure compliance.
          </p>
        </div>
      </div>
    </div>
  ),
}
