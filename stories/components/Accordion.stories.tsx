import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern and follows accessibility best practices.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that can be customized to match your design system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It uses smooth animations that respect user preferences for reduced motion.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleOpen: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
        <AccordionContent>
          Yes! This accordion is set to type=&quot;multiple&quot; which allows multiple items to be open at the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What about animations?</AccordionTrigger>
        <AccordionContent>
          All animations work smoothly even when multiple items are open simultaneously.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I use this?</AccordionTrigger>
        <AccordionContent>
          Simply set the type prop to &quot;multiple&quot; on the Accordion component.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="faq-1">
        <AccordionTrigger>How do I register my team?</AccordionTrigger>
        <AccordionContent>
          To register your team, navigate to the Teams page from the dashboard and click the &quot;Add Team&quot; button.
          Fill in the required information including team name, division, and contact details. Your team will be
          pending approval until reviewed by an administrator.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionTrigger>What are the player eligibility requirements?</AccordionTrigger>
        <AccordionContent>
          Players must be at least 18 years old and provide valid identification. All players need to complete
          the registration form and sign the liability waiver before participating in any events. Additional
          requirements may vary by division and league rules.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionTrigger>How do I submit a game report?</AccordionTrigger>
        <AccordionContent>
          After each game, team captains can submit reports through the Reports section. Include the final score,
          player statistics, and any incidents that occurred during the game. Reports must be submitted within
          24 hours of the game&apos;s conclusion.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-4">
        <AccordionTrigger>Can I edit player information after registration?</AccordionTrigger>
        <AccordionContent>
          Yes, you can edit most player information through the player profile page. However, some fields like
          date of birth require administrator approval to change. Contact support if you need to make changes
          to restricted fields.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const PlayerGuide: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Player Management Guide</h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="guide-1">
          <AccordionTrigger>Adding New Players</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <p>To add a new player to your team:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Navigate to the Players page</li>
              <li>Click the &quot;Add Player&quot; button</li>
              <li>Fill in the player&apos;s personal information</li>
              <li>Assign them to a team</li>
              <li>Submit for approval</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-2">
              Note: New players will appear as pending until approved by an administrator.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="guide-2">
          <AccordionTrigger>Managing Player Rosters</AccordionTrigger>
          <AccordionContent>
            Team rosters can be managed through the team detail page. You can add or remove players,
            update positions, and set the active roster for upcoming events. Changes to rosters are
            immediately reflected across all dashboards.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="guide-3">
          <AccordionTrigger>Player Statistics and Records</AccordionTrigger>
          <AccordionContent>
            View comprehensive player statistics including games played, goals scored, and performance
            metrics on the player profile page. Historical data is maintained for all seasons and can
            be exported for analysis.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Settings: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Account Settings</h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="settings-1">
          <AccordionTrigger>Profile Settings</AccordionTrigger>
          <AccordionContent>
            Update your profile information, change your display name, and manage your avatar.
            Profile changes are reflected immediately across the platform.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="settings-2">
          <AccordionTrigger>Notification Preferences</AccordionTrigger>
          <AccordionContent>
            Choose which notifications you want to receive via email or in-app. You can customize
            notifications for team updates, game reminders, report submissions, and administrative
            announcements.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="settings-3">
          <AccordionTrigger>Privacy and Security</AccordionTrigger>
          <AccordionContent>
            Manage your privacy settings, update your password, enable two-factor authentication,
            and review login history. We recommend enabling 2FA for enhanced account security.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="settings-4">
          <AccordionTrigger>Data and Export</AccordionTrigger>
          <AccordionContent>
            Download your data, export reports, and manage data retention settings. You can request
            a complete export of your account data at any time.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-2" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>First Item</AccordionTrigger>
        <AccordionContent>
          This item is closed by default.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Item (Open by Default)</AccordionTrigger>
        <AccordionContent>
          This item is open by default because we set defaultValue=&quot;item-2&quot; on the Accordion component.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third Item</AccordionTrigger>
        <AccordionContent>
          This item is also closed by default.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
