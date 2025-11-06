import type { Meta, StoryObj } from '@storybook/react'
import { CheckIcon, XIcon } from 'lucide-react'
import { Icon } from '@/components/ui/icon'

/**
 * # Content Guidelines
 *
 * Our content style guide ensures consistent, clear, and accessible writing
 * across the entire design system. Inspired by IBM Carbon and GOV.UK Design System.
 *
 * ## Our Voice
 *
 * - **Clear** – Simple, direct language anyone can understand
 * - **Helpful** – Anticipate user needs and provide practical guidance
 * - **Professional** – Knowledgeable without being condescending
 * - **Human** – Write like we're talking to a colleague, not a machine
 * - **Confident** – Certain about our recommendations, open to feedback
 *
 * ## Tone Variations
 *
 * Our voice stays consistent, but tone adapts to context:
 * - **Instructional** (Docs) – Direct, clear, supportive
 * - **Reference** (API) – Concise, precise, factual
 * - **Error messages** – Calm, specific, solution-oriented
 * - **Success messages** – Brief, positive, actionable
 * - **Empty states** – Encouraging, action-oriented
 *
 * ## Key Principles
 *
 * 1. **Use active voice** – Makes it clear who does what
 * 2. **Keep it short** – Target 25 words or fewer per sentence
 * 3. **Address users as "you"** – Direct and personal
 * 4. **Be specific** – Avoid vague words like "easy" or "simple"
 * 5. **Front-load important info** – Put key details first
 * 6. **Use sentence case** – For all UI text (following IBM Carbon)
 * 7. **Use Oxford comma** – In all lists
 * 8. **Use contractions** – Sound natural and conversational
 * 9. **Use inclusive language** – Gender-neutral, accessible
 * 10. **Show, don't tell** – Provide code examples
 *
 * ## Resources
 *
 * - [Full Content Style Guide](/design-system/CONTENT_STYLE_GUIDE.md)
 * - [Microcopy Patterns](/design-system/MICROCOPY_PATTERNS.md)
 */
const meta: Meta = {
  title: 'Foundation/Content Guidelines',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Writing standards for consistent, accessible content across the design system.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const Example = ({
  good,
  bad,
  title,
  description,
}: {
  good: string | React.ReactNode
  bad: string | React.ReactNode
  title: string
  description?: string
}) => (
  <div className="space-y-3">
    <div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="space-y-2">
      <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon icon={CheckIcon} size="sm" color="success" decorative className="mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-green-700 dark:text-green-300 font-semibold mb-1">
              Good
            </div>
            <div className="text-sm text-green-900 dark:text-green-100">
              {good}
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon icon={XIcon} size="sm" color="error" decorative className="mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-red-700 dark:text-red-300 font-semibold mb-1">
              Avoid
            </div>
            <div className="text-sm text-red-900 dark:text-red-100">{bad}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

/**
 * Core writing principles for all content.
 */
export const WritingPrinciples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Writing Principles</h2>
        <p className="text-muted-foreground mb-6">
          Follow these principles for clear, user-focused content
        </p>
      </div>

      <Example
        title="1. Use Active Voice"
        description="Makes it clear who does what"
        good="The component validates input automatically"
        bad="Input is validated automatically by the component"
      />

      <Example
        title="2. Keep It Short"
        description="Target 25 words or fewer per sentence"
        good="Use tooltips for helpful hints. Keep them under 60 characters."
        bad="Tooltips should be used in situations where you want to provide additional helpful information to users, and you should try to keep the text relatively short, ideally under 60 characters."
      />

      <Example
        title="3. Address Users as 'You'"
        description="Direct address feels personal and clear"
        good="You can customize the theme using CSS variables"
        bad="Developers can customize the theme using CSS variables"
      />

      <Example
        title="4. Be Specific"
        description="Avoid vague words like 'easy,' 'simple,' or 'just'"
        good={<code className="text-xs">import &#123; Button &#125; from '@/components/ui/button'</code>}
        bad="Simply import the component. It's easy!"
      />

      <Example
        title="5. Front-Load Important Information"
        description="Put the most important info first"
        good="Required fields use an asterisk (*). Mark all required fields in your forms."
        bad="In your forms, you should mark all required fields, and we use an asterisk (*) to indicate this."
      />
    </div>
  ),
}

/**
 * Capitalization rules for UI text.
 */
export const Capitalization: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Capitalization</h2>
        <p className="text-muted-foreground mb-6">
          Use sentence case for all UI text (following IBM Carbon standard)
        </p>
      </div>

      <div className="space-y-6">
        <Example
          title="Button Labels"
          good="Add new player"
          bad="Add New Player"
        />

        <Example
          title="Headings"
          good="Player wellness monitoring"
          bad="Player Wellness Monitoring"
        />

        <Example
          title="Navigation Items"
          good="Team settings"
          bad="Team Settings"
        />

        <Example
          title="Form Labels"
          good="Email address"
          bad="Email Address"
        />

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Exceptions (Use Title Case)</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                <strong>Brand names:</strong> SimpleAM, Lucide React, Next.js
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                <strong>Proper nouns:</strong> Monday, January, Premier League
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                <strong>Acronyms:</strong> API, CSS, WCAG
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

/**
 * Microcopy patterns for common UI scenarios.
 */
export const MicrocopyPatterns: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Microcopy Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Standardized text for common UI elements
        </p>
      </div>

      {/* Button Labels */}
      <div className="space-y-3">
        <h3 className="font-semibold">Button Labels (verb + noun)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example title="Primary Actions" good="Save changes" bad="Save" />
          <Example title="Destructive Actions" good="Delete player" bad="Delete" />
          <Example title="Secondary Actions" good="Go back" bad="Back" />
          <Example
            title="Progressive Disclosure"
            good="Continue to next step"
            bad="Continue"
          />
        </div>
      </div>

      {/* Error Messages */}
      <div className="space-y-3">
        <h3 className="font-semibold">Error Messages (problem + solution)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example
            title="Required Fields"
            good="Email is required. Enter your email address."
            bad="Invalid input"
          />
          <Example
            title="Format Errors"
            good="Enter a valid email address (name@example.com)"
            bad="Wrong email format"
          />
          <Example
            title="Length Constraints"
            good="Password must be at least 8 characters"
            bad="Too short"
          />
          <Example
            title="System Errors"
            good={
              <div>
                Cannot connect to server
                <br />
                <span className="text-xs">
                  Check your internet connection and try again
                </span>
              </div>
            }
            bad="Error occurred"
          />
        </div>
      </div>

      {/* Success Messages */}
      <div className="space-y-3">
        <h3 className="font-semibold">Success Messages (confirmation + next action)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example
            title="Simple Confirmation"
            good="Player saved successfully"
            bad="Success!"
          />
          <Example
            title="With Next Action"
            good={
              <div>
                Player added successfully
                <br />
                <span className="text-xs">View player profile or add another</span>
              </div>
            }
            bad="Player has been added!"
          />
        </div>
      </div>

      {/* Empty States */}
      <div className="space-y-3">
        <h3 className="font-semibold">Empty States (state + action)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Example
            title="No Data Yet"
            good={
              <div>
                No players yet
                <br />
                <span className="text-xs">Add your first player to get started</span>
              </div>
            }
            bad="This list is empty"
          />
          <Example
            title="No Results"
            good={
              <div>
                No players match your filters
                <br />
                <span className="text-xs">Try different search terms</span>
              </div>
            }
            bad="No results found"
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Inclusive language guidelines.
 */
export const InclusiveLanguage: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Inclusive Language</h2>
        <p className="text-muted-foreground mb-6">
          Use gender-neutral, culturally sensitive language
        </p>
      </div>

      <Example
        title="Gender-Neutral Pronouns"
        description="Use 'they' instead of 'he' or 'she'"
        good="When a user submits the form, they receive confirmation"
        bad="When a user submits the form, he receives confirmation"
      />

      <Example
        title="Avoid Ableist Language"
        description="Don't use disability as a metaphor"
        good="This feature isn't working as expected"
        bad="This feature is crippled/broken/lame"
      />

      <Example
        title="Use Precise Technical Language"
        description="Avoid unnecessarily complex terms"
        good="Use this component for confirmation dialogs"
        bad="Leverage this component to facilitate user confirmation workflows"
      />

      <Example
        title="Cultural Sensitivity"
        description="Idioms don't translate universally"
        good="Complete all required fields before continuing"
        bad="Touch base with all required fields before moving forward"
      />
    </div>
  ),
}

/**
 * Accessibility requirements for content.
 */
export const AccessibilityGuidelines: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Content Accessibility</h2>
        <p className="text-muted-foreground mb-6">
          Ensure content is accessible to all users
        </p>
      </div>

      <div className="space-y-6">
        <Example
          title="Alt Text for Images"
          description="Describe content and function, not the image itself"
          good={<code className="text-xs">alt="Button component with three variants"</code>}
          bad={<code className="text-xs">alt="Screenshot of buttons"</code>}
        />

        <Example
          title="Link Text"
          description="Use descriptive text, never 'click here'"
          good={
            <span>
              View the{' '}
              <a href="#" className="text-primary underline">
                Button component documentation
              </a>
            </span>
          }
          bad={
            <span>
              <a href="#" className="text-primary underline">
                Click here
              </a>{' '}
              for more information
            </span>
          }
        />

        <Example
          title="Error Messages"
          description="Be specific about what's wrong and how to fix it"
          good={
            <div>
              Email is required
              <br />
              <span className="text-xs">
                Enter your email address in the format name@example.com
              </span>
            </div>
          }
          bad="Invalid input"
        />

        <Example
          title="Placeholder vs Label"
          description="Don't use placeholders as labels"
          good={
            <div className="space-y-1">
              <label className="text-xs font-medium">Email address</label>
              <input
                type="text"
                placeholder="name@example.com"
                className="w-full px-3 py-1 border rounded text-xs"
              />
            </div>
          }
          bad={
            <input
              type="text"
              placeholder="Email address"
              className="w-full px-3 py-1 border rounded text-xs"
            />
          }
        />
      </div>
    </div>
  ),
}

/**
 * Quick reference do's and don'ts.
 */
export const QuickReference: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground mb-6">
          Common do's and don'ts at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-green-700 dark:text-green-400">
            ✅ Do
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Use active voice</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Address users as "you"</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Keep sentences under 25 words</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Use contractions naturally</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Use sentence case for UI text</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Use the Oxford comma</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Provide code examples</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-green-600">•</span>
              <span>Use inclusive language</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-red-700 dark:text-red-400">
            ❌ Don't
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Use passive voice unnecessarily</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Use jargon without explanation</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Write long, complex sentences</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Use title case for UI text</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Use exclamation points in errors</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Say "click here" or "read more"</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Use gendered pronouns</span>
            </li>
            <li className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-red-600">•</span>
              <span>Use vague words like "easy"</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

/**
 * Real-world examples in common UI contexts.
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Real-World Examples</h2>
        <p className="text-muted-foreground mb-6">
          See how guidelines apply in actual UI
        </p>
      </div>

      {/* Error message */}
      <div className="space-y-3">
        <h3 className="font-semibold">Error Message in Form</h3>
        <div className="p-6 border rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email address <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-red-500 rounded-lg"
              value="invalid-email"
            />
            <p className="text-sm text-destructive mt-1">
              Email is required. Enter your email address in the format
              name@example.com
            </p>
          </div>
        </div>
      </div>

      {/* Success message */}
      <div className="space-y-3">
        <h3 className="font-semibold">Success Message</h3>
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="font-medium text-green-900 dark:text-green-100">
            Player saved successfully
          </p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            View player profile or add another player
          </p>
        </div>
      </div>

      {/* Empty state */}
      <div className="space-y-3">
        <h3 className="font-semibold">Empty State</h3>
        <div className="p-12 border rounded-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <Icon icon={CheckIcon} size="xl" decorative />
          </div>
          <p className="text-lg font-medium">No players yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first player to get started
          </p>
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Add player
          </button>
        </div>
      </div>

      {/* Confirmation dialog */}
      <div className="space-y-3">
        <h3 className="font-semibold">Confirmation Dialog</h3>
        <div className="p-6 border rounded-lg space-y-4">
          <div>
            <h4 className="font-semibold text-lg">Delete player?</h4>
            <p className="text-sm text-muted-foreground mt-2">
              This will permanently delete Jordan Smith from your roster. This
              action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg">Cancel</button>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg">
              Delete player
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
}
