import type { Meta, StoryObj } from '@storybook/react'
import { AlertCircle, CheckCircle, AlertTriangle, InfoIcon, UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * # Microcopy Patterns
 *
 * Standardized text patterns for common UI scenarios. These patterns ensure
 * consistency across the design system and help users understand what's happening.
 *
 * ## Core Structure
 *
 * Each pattern follows a specific formula:
 * - **Button labels**: Verb + noun (e.g., "Save changes")
 * - **Error messages**: Problem + solution (e.g., "Email is required. Enter your email address.")
 * - **Success messages**: Confirmation + next action (e.g., "Player saved. View profile or add another.")
 * - **Empty states**: State + action + why (e.g., "No players yet. Add your first player to get started.")
 * - **Confirmations**: Question + consequence + actions
 *
 * ## Tone Guidelines
 *
 * - **Clear and specific** – No vague language
 * - **Action-oriented** – Tell users what to do
 * - **Professional** – No excessive enthusiasm or humor
 * - **Helpful** – Guide users to success
 */
const meta: Meta = {
  title: 'Foundation/Microcopy Patterns',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Standardized text patterns for buttons, messages, forms, and common UI scenarios.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const PatternCard = ({
  title,
  pattern,
  children,
}: {
  title: string
  pattern: string
  children: React.ReactNode
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="font-mono text-xs">{pattern}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

/**
 * Button labels should be specific and action-oriented.
 * Use verb + noun pattern to make the action clear.
 */
export const ButtonLabels: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Button Labels</h2>
        <p className="text-muted-foreground">
          Use <strong>verb + noun</strong> pattern. Be specific about what happens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PatternCard title="Primary Actions" pattern="[Verb] + [noun]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button>Save changes</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button>Add player</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button disabled>Submit</Button>
              <span className="text-sm text-destructive">❌ Too vague</span>
            </div>
          </div>
        </PatternCard>

        <PatternCard title="Destructive Actions" pattern="[Verb] + [specific object]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button variant="destructive">Delete player</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="destructive">Clear all filters</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="destructive" disabled>
                Delete
              </Button>
              <span className="text-sm text-destructive">❌ Not specific</span>
            </div>
          </div>
        </PatternCard>

        <PatternCard title="Secondary Actions" pattern="Clear alternative">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button variant="outline">Cancel</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline">Save as draft</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline">Skip this step</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
          </div>
        </PatternCard>

        <PatternCard title="Progressive Disclosure" pattern="Guide next step">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button>Continue to next step</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button>Review and submit</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <Button>Finish setup</Button>
              <span className="text-sm text-muted-foreground">✅ Good</span>
            </div>
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Error messages should clearly state the problem and how to fix it.
 */
export const ErrorMessages: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Error Messages</h2>
        <p className="text-muted-foreground">
          Pattern: <strong>[What's wrong] + [How to fix it]</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <PatternCard title="Required Fields" pattern="[Field] is required. [Action]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email1">Email address *</Label>
              <Input
                id="email1"
                type="email"
                className="border-destructive"
                placeholder="name@example.com"
              />
              <p className="text-sm text-destructive mt-1">
                Email is required. Enter your email address.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              ✅ Clear: States the problem and the solution
            </div>
          </div>
        </PatternCard>

        <PatternCard title="Format Errors" pattern="Enter a valid [field] ([format example])">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email2">Email address</Label>
              <Input
                id="email2"
                type="email"
                defaultValue="invalid-email"
                className="border-destructive"
              />
              <p className="text-sm text-destructive mt-1">
                Enter a valid email address (name@example.com)
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              ✅ Shows exactly what format is expected
            </div>
          </div>
        </PatternCard>

        <PatternCard title="Length Constraints" pattern="[Field] must be [constraint]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="border-destructive" />
              <p className="text-sm text-destructive mt-1">
                Password must be at least 8 characters
              </p>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" defaultValue="This is a very long bio that exceeds the character limit for the bio field in the form" className="border-destructive" />
              <p className="text-sm text-destructive mt-1">
                Bio must be 200 characters or fewer (currently 245)
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              ✅ Specific constraint + helpful count when exceeded
            </div>
          </div>
        </PatternCard>

        <PatternCard title="System Errors" pattern="[Problem]. [How to resolve]">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cannot connect to server</AlertTitle>
            <AlertDescription>Check your internet connection and try again.</AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Calm tone, specific action to take
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Success messages confirm what happened and suggest next actions.
 */
export const SuccessMessages: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Success Messages</h2>
        <p className="text-muted-foreground">
          Pattern: <strong>[What succeeded] + [Next action (optional)]</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <PatternCard title="Simple Confirmations" pattern="[Object] [action] successfully">
          <div className="space-y-3">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-900 dark:text-green-100">
                Player saved successfully
              </AlertTitle>
            </Alert>
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-900 dark:text-green-100">
                Changes saved
              </AlertTitle>
            </Alert>
            <div className="text-sm text-muted-foreground">
              ✅ Brief, clear, past tense
            </div>
          </div>
        </PatternCard>

        <PatternCard title="With Next Actions" pattern="[Success]. [Suggested next step]">
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              Player added successfully
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              View player profile or add another player
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Confirms action + suggests logical next steps
          </div>
        </PatternCard>

        <PatternCard title="Progressive Actions" pattern="[Step indicator]. [What's next]">
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              Step 1 of 3 complete
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Continue to payment details
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Shows progress + guides to next step
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Warning messages explain consequences before destructive actions.
 */
export const WarningMessages: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Warning Messages</h2>
        <p className="text-muted-foreground">
          Pattern: <strong>[What will happen] + [How to prevent it (optional)]</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <PatternCard title="Unsaved Changes" pattern="[Consequence]. [How to save]">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unsaved changes will be lost</AlertTitle>
            <AlertDescription>Save your changes before leaving this page</AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Clear consequence + how to prevent it
          </div>
        </PatternCard>

        <PatternCard title="Destructive Actions" pattern="[Permanent consequence]">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>This action cannot be undone</AlertTitle>
            <AlertDescription>
              All player data will be permanently deleted
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Honest and direct about consequences
          </div>
        </PatternCard>

        <PatternCard title="System Warnings" pattern="[What's happening]. [What to do]">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Your session will expire in 5 minutes</AlertTitle>
            <AlertDescription>Save your work to avoid losing changes</AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Explains situation + provides solution
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Confirmation dialogs for destructive or important actions.
 */
export const ConfirmationDialogs: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Confirmation Dialogs</h2>
        <p className="text-muted-foreground">
          Pattern: <strong>Question + Consequence + Actions</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PatternCard title="Delete Confirmation" pattern="[Question] + [Permanent impact]">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show delete dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete player?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete Jordan Smith from your roster. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete player</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Clear question + specific consequence + action buttons
          </div>
        </PatternCard>

        <PatternCard title="Discard Changes" pattern="[Question] + [What will be lost]">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show discard dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your edits to Jordan Smith's profile haven't been saved. Leaving now will
                  discard all changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline">Continue editing</Button>
                <Button variant="destructive">Discard changes</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Specific about what's affected + clear options
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Empty states guide users when there's no data yet.
 */
export const EmptyStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Empty States</h2>
        <p className="text-muted-foreground">
          Pattern: <strong>[Current state] + [Action to take] + [Why it matters (optional)]</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <PatternCard title="No Data Yet" pattern="No [items] yet. [Action to get started]">
          <div className="text-center py-12 border rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <UserIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No players yet</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Add your first player to get started
            </p>
            <Button>Add player</Button>
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Encouraging, with clear primary action
          </div>
        </PatternCard>

        <PatternCard title="Filtered View (No Results)" pattern="No [items] match. [Suggestion]">
          <div className="text-center py-12 border rounded-lg">
            <h3 className="font-semibold text-lg">No players match your filters</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Try different search terms or clear filters
            </p>
            <Button variant="outline">Clear filters</Button>
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Acknowledges user action + provides solution
          </div>
        </PatternCard>

        <PatternCard title="Error State" pattern="[Problem]. [Recovery action]">
          <div className="text-center py-12 border rounded-lg">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Unable to load players</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Check your connection and try again
            </p>
            <Button>Retry</Button>
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Clear problem statement + actionable solution
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Form field patterns for labels, helper text, and placeholders.
 */
export const FormFields: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Form Fields</h2>
        <p className="text-muted-foreground">
          Use sentence case labels, provide context before input, and show format in placeholders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PatternCard title="Required Field" pattern="Label + asterisk + helper text">
          <div className="space-y-2">
            <Label htmlFor="email-req">
              Email address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email-req"
              type="email"
              placeholder="name@example.com"
            />
            <p className="text-sm text-muted-foreground">
              We'll use this to send roster updates and reports
            </p>
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Clear label + indicator + helpful context
          </div>
        </PatternCard>

        <PatternCard title="Optional Field" pattern="Label + (optional) tag">
          <div className="space-y-2">
            <Label htmlFor="middle">
              Middle name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="middle" />
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Explicit about optional fields
          </div>
        </PatternCard>

        <PatternCard title="Helper Text" pattern="Context before user fills out field">
          <div className="space-y-2">
            <Label htmlFor="jersey">Jersey number</Label>
            <Input id="jersey" type="number" placeholder="1-99" />
            <p className="text-sm text-muted-foreground">
              Must be between 1 and 99 (optional)
            </p>
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Provides guidance upfront
          </div>
        </PatternCard>

        <PatternCard title="Placeholder Text" pattern="Show format, not label">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" placeholder="555-123-4567" />
          </div>
          <div className="text-sm text-muted-foreground mt-3">
            ✅ Example format, separate label
          </div>
        </PatternCard>
      </div>
    </div>
  ),
}

/**
 * Quick reference for tone across different contexts.
 */
export const ToneMatrix: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tone Matrix</h2>
        <p className="text-muted-foreground">How our tone adapts to different contexts</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">Context</th>
              <th className="text-left p-3 font-semibold">Example</th>
              <th className="text-left p-3 font-semibold">Tone</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">Documentation</td>
              <td className="p-3 font-mono text-sm">
                Import the component from `@/components/ui/button`
              </td>
              <td className="p-3 text-sm text-muted-foreground">Clear, direct</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Error</td>
              <td className="p-3 text-sm">Email is required. Enter your email address.</td>
              <td className="p-3 text-sm text-muted-foreground">Calm, specific</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Success</td>
              <td className="p-3 text-sm">Player saved successfully</td>
              <td className="p-3 text-sm text-muted-foreground">Brief, positive</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Warning</td>
              <td className="p-3 text-sm">Unsaved changes will be lost</td>
              <td className="p-3 text-sm text-muted-foreground">Honest, direct</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Empty state</td>
              <td className="p-3 text-sm">No players yet. Add your first player.</td>
              <td className="p-3 text-sm text-muted-foreground">Encouraging</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Loading</td>
              <td className="p-3 text-sm">Loading players...</td>
              <td className="p-3 text-sm text-muted-foreground">Informative</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Tooltip</td>
              <td className="p-3 text-sm">Filter by position</td>
              <td className="p-3 text-sm text-muted-foreground">Concise</td>
            </tr>
            <tr>
              <td className="p-3">Help text</td>
              <td className="p-3 text-sm">Choose the player's primary position</td>
              <td className="p-3 text-sm text-muted-foreground">Supportive</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
}
