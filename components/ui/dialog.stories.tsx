import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

/**
 * Dialog - World-Class Modal Implementation
 *
 * A modal dialog that interrupts the user with important content and expects a response.
 *
 * ## Features
 * - **Size Variants**: sm, md, lg, xl, fullscreen
 * - **Animation Variants**: fade, scale, slide-up, slide-down
 * - **Scrollable Content**: Built-in support via DialogBody
 * - **Loading States**: Show loading spinner while fetching data
 * - **Optional Close Button**: Hide/show X button
 * - **Full Keyboard Support**: Esc to close, Tab to trap focus
 * - **Complete Token Integration**: All styling from design system
 * - **WCAG 2.1 AA Compliant**: Proper ARIA labels and focus management
 *
 * ## Usage
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent size="md" animation="scale">
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody scrollable>
 *       {/* Content *\/}
 *     </DialogBody>
 *     <DialogFooter>
 *       <Button variant="outline">Cancel</Button>
 *       <Button>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

// ============================================================================
// Default Story
// ============================================================================

function DefaultDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Player</Button>
      </DialogTrigger>
      <DialogContent size="md" animation="scale">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>
            Capture baseline information before assigning positions, loads, and notes.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="player-name">Player name</Label>
            <Input id="player-name" placeholder="Jordan Smith" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="player-email">Email</Label>
            <Input id="player-email" type="email" placeholder="person@simpleam.app" />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

// ============================================================================
// Size Variants
// ============================================================================

function SizeSmallDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Small Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Small Dialog</DialogTitle>
          <DialogDescription>
            This is a small dialog, perfect for quick confirmations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const SizeSmall: Story = {
  render: () => <SizeSmallDemo />,
};

function SizeLargeDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>
            This is a large dialog with more space for complex content.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Large dialogs are useful for forms with many fields or detailed information.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Jordan" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Smith" />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const SizeLarge: Story = {
  render: () => <SizeLargeDemo />,
};

function SizeExtraLargeDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Extra Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Extra Large Dialog</DialogTitle>
          <DialogDescription>
            This is an extra large dialog for complex layouts or data tables.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Extra large dialogs can accommodate complex multi-column layouts, charts, or tables.</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Column 1</Label>
              <Input placeholder="Data" />
            </div>
            <div>
              <Label>Column 2</Label>
              <Input placeholder="Data" />
            </div>
            <div>
              <Label>Column 3</Label>
              <Input placeholder="Data" />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const SizeExtraLarge: Story = {
  render: () => <SizeExtraLargeDemo />,
};

function FullscreenDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Fullscreen Dialog</Button>
      </DialogTrigger>
      <DialogContent size="fullscreen">
        <DialogHeader>
          <DialogTitle>Fullscreen Dialog</DialogTitle>
          <DialogDescription>
            This dialog takes up the entire viewport, useful for immersive experiences.
          </DialogDescription>
        </DialogHeader>
        <DialogBody scrollable>
          <p>Fullscreen dialogs are great for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multi-step wizards</li>
            <li>Complex data entry forms</li>
            <li>Content that needs maximum screen real estate</li>
            <li>Mobile-first experiences</li>
          </ul>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Fullscreen: Story = {
  render: () => <FullscreenDemo />,
};

// ============================================================================
// Animation Variants
// ============================================================================

function AnimationFadeDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Fade Animation</Button>
      </DialogTrigger>
      <DialogContent animation="fade">
        <DialogHeader>
          <DialogTitle>Fade Animation</DialogTitle>
          <DialogDescription>
            This dialog uses a simple fade in/out animation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AnimationFade: Story = {
  render: () => <AnimationFadeDemo />,
};

function AnimationScaleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Scale Animation</Button>
      </DialogTrigger>
      <DialogContent animation="scale">
        <DialogHeader>
          <DialogTitle>Scale Animation</DialogTitle>
          <DialogDescription>
            This dialog scales in from the center (default).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AnimationScale: Story = {
  render: () => <AnimationScaleDemo />,
};

function AnimationSlideUpDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Slide Up Animation</Button>
      </DialogTrigger>
      <DialogContent animation="slide-up">
        <DialogHeader>
          <DialogTitle>Slide Up Animation</DialogTitle>
          <DialogDescription>
            This dialog slides up from the bottom.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AnimationSlideUp: Story = {
  render: () => <AnimationSlideUpDemo />,
};

function AnimationSlideDownDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Slide Down Animation</Button>
      </DialogTrigger>
      <DialogContent animation="slide-down">
        <DialogHeader>
          <DialogTitle>Slide Down Animation</DialogTitle>
          <DialogDescription>
            This dialog slides down from the top.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AnimationSlideDown: Story = {
  render: () => <AnimationSlideDownDemo />,
};

// ============================================================================
// Scrollable Content
// ============================================================================

function ScrollableContentDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Scrollable Content</Button>
      </DialogTrigger>
      <DialogContent scrollable>
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions to continue.
          </DialogDescription>
        </DialogHeader>

        <DialogBody scrollable>
          <div className="space-y-4">
            <p className="font-semibold">1. Introduction</p>
            <p>
              Welcome to our application. By using our services, you agree to these terms and conditions.
              Please read them carefully.
            </p>

            <p className="font-semibold">2. User Accounts</p>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for
              all activities that occur under your account.
            </p>

            <p className="font-semibold">3. Privacy Policy</p>
            <p>
              We collect and process your personal data in accordance with our Privacy Policy. By using
              our services, you consent to such processing.
            </p>

            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>
                <p className="font-semibold">{i + 4}. Section {i + 4}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris.
                </p>
              </div>
            ))}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Decline</Button>
          <Button onClick={() => setOpen(false)}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ScrollableContent: Story = {
  render: () => <ScrollableContentDemo />,
};

// ============================================================================
// Loading State
// ============================================================================

function LoadingStateDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLoading(true);
      // Simulate loading data
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button>Show Loading State</Button>
      </DialogTrigger>
      <DialogContent loading={loading}>
        <DialogHeader>
          <DialogTitle>Player Details</DialogTitle>
          <DialogDescription>
            Loading player information from the server...
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value="Jordan Smith" readOnly />
            </div>
            <div>
              <Label>Position</Label>
              <Input value="Forward" readOnly />
            </div>
            <div>
              <Label>Number</Label>
              <Input value="23" readOnly />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const LoadingState: Story = {
  render: () => <LoadingStateDemo />,
};

// ============================================================================
// No Close Button
// ============================================================================

function NoCloseButtonDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              // Handle delete
              setOpen(false);
            }}
          >
            Yes, Delete My Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const NoCloseButton: Story = {
  render: () => <NoCloseButtonDemo />,
};

// ============================================================================
// Complex Form Example
// ============================================================================

function ComplexFormDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Complex Form</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Create New Player</DialogTitle>
          <DialogDescription>
            Enter all player information to create their profile in the system.
          </DialogDescription>
        </DialogHeader>

        <DialogBody scrollable>
          <form className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Jordan" />
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Smith" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jordan.smith@example.com" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Player Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" placeholder="Forward" />
                </div>
                <div>
                  <Label htmlFor="number">Jersey Number</Label>
                  <Input id="number" type="number" placeholder="23" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="185" />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="75" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Emergency Contact</h3>
              <div>
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input id="contact-name" placeholder="Jane Smith" />
              </div>
              <div>
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Player</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ComplexForm: Story = {
  render: () => <ComplexFormDemo />,
};

// ============================================================================
// All Variants Showcase
// ============================================================================

function AllVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DefaultDemo />
      <SizeSmallDemo />
      <SizeLargeDemo />
      <SizeExtraLargeDemo />
      <FullscreenDemo />
      <AnimationFadeDemo />
      <AnimationSlideUpDemo />
      <ScrollableContentDemo />
      <LoadingStateDemo />
      <NoCloseButtonDemo />
      <ComplexFormDemo />
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
  parameters: {
    layout: 'centered',
    controls: {
      disable: true,
    },
  },
};
