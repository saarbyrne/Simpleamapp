import type { Meta, StoryObj } from '@storybook/react'
import { PageCard } from '@/components/ui/page-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Separator } from '@/components/ui/separator'
import { Save, X } from 'lucide-react'

const meta: Meta = {
  title: 'Templates/Form Page',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Form Page Template

A standardized form layout pattern for create/edit pages.

## Pattern Structure
\`\`\`tsx
<PageCard
  title="Form Title"
  description="Form description"
>
  <form className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input id="field" />
      </div>
      {/* More fields */}
    </div>

    <Separator />

    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</PageCard>
\`\`\`

## Grid Layout
- **1 column** on mobile
- **2 columns** on desktop (md:grid-cols-2)
- **Full width** for textareas and complex fields

## Usage
This pattern is used for player creation, form building, settings pages, and other data entry forms.

## Key Components
- **PageCard**: Container with title
- **Label**: Field labels with proper htmlFor
- **Input/Select/Textarea**: Form controls
- **Separator**: Visual section dividers
- **Button**: Form actions (cancel, submit)
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <PageCard
      title="Create Player"
      description="Add a new player to your team"
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" placeholder="Marcus" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" placeholder="Silva" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="marcus@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 234 567 8900" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <DatePicker />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Select>
              <SelectTrigger id="nationality">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="es">Spain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Select>
              <SelectTrigger id="position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forward">Forward</SelectItem>
                <SelectItem value="midfielder">Midfielder</SelectItem>
                <SelectItem value="defender">Defender</SelectItem>
                <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jerseyNumber">Jersey Number</Label>
            <Input id="jerseyNumber" type="number" placeholder="10" min="1" max="99" />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional information about the player..."
            className="min-h-[100px]"
          />
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Create Player
          </Button>
        </div>
      </form>
    </PageCard>
  ),
}

export const EditForm: Story = {
  render: () => (
    <PageCard
      title="Edit Player"
      description="Update player information"
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" defaultValue="Marcus" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" defaultValue="Silva" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" defaultValue="marcus@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="active">
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="injured">Injured</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </PageCard>
  ),
}

export const SettingsForm: Story = {
  render: () => (
    <PageCard
      title="Settings"
      description="Manage your account preferences"
    >
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" defaultValue="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  <SelectItem value="est">Eastern (GMT-5)</SelectItem>
                  <SelectItem value="pst">Pacific (GMT-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifs">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
              </div>
              <Switch id="emailNotifs" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifs">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
              <Switch id="pushNotifs" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Get a weekly summary of your activity</p>
              </div>
              <Switch id="weeklyDigest" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">Reset</Button>
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </PageCard>
  ),
}

export const MultiStepForm: Story = {
  render: () => (
    <PageCard
      title="Create Report"
      description="Step 1 of 3: Basic Information"
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="reportName">Report Name *</Label>
          <Input id="reportName" placeholder="Q4 Performance Report" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportType">Report Type *</Label>
          <Select>
            <SelectTrigger id="reportType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the purpose of this report..."
            className="min-h-[100px]"
          />
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="button">
            Next: Select Data
          </Button>
        </div>
      </form>
    </PageCard>
  ),
}

export const CompactForm: Story = {
  render: () => (
    <PageCard
      variant="compact"
      title="Quick Add Player"
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quickName">Full Name *</Label>
          <Input id="quickName" placeholder="Enter player name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quickPosition">Position</Label>
          <Select>
            <SelectTrigger id="quickPosition">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forward">Forward</SelectItem>
              <SelectItem value="midfielder">Midfielder</SelectItem>
              <SelectItem value="defender">Defender</SelectItem>
              <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1">Add Player</Button>
        </div>
      </form>
    </PageCard>
  ),
}

export const WithCheckboxes: Story = {
  render: () => (
    <PageCard
      title="Configure Permissions"
      description="Select which permissions to grant"
    >
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Player Management</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="viewPlayers" defaultChecked />
              <Label htmlFor="viewPlayers">View Players</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="editPlayers" defaultChecked />
              <Label htmlFor="editPlayers">Edit Players</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="deletePlayers" />
              <Label htmlFor="deletePlayers">Delete Players</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Report Access</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="viewReports" defaultChecked />
              <Label htmlFor="viewReports">View Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="createReports" />
              <Label htmlFor="createReports">Create Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exportReports" />
              <Label htmlFor="exportReports">Export Reports</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Save Permissions</Button>
        </div>
      </form>
    </PageCard>
  ),
}
