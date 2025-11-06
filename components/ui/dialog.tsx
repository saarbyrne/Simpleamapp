"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

/**
 * Dialog Component - World-Class Implementation
 *
 * A modal dialog that interrupts the user with important content and expects a response.
 * Built on Radix UI Dialog primitive with enhanced features and design token integration.
 *
 * Features:
 * - Size variants (sm, md, lg, xl, fullscreen)
 * - Animation variants (fade, scale, slide-up, slide-down)
 * - Scrollable content support
 * - Optional close button
 * - Full keyboard navigation (Esc to close, Tab trap)
 * - Loading states
 * - Complete design token integration
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent size="md" animation="scale">
 *     <DialogHeader>
 *       <DialogTitle>Confirm Action</DialogTitle>
 *       <DialogDescription>Are you sure you want to continue?</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>
 *       {/* Scrollable content goes here *\/}
 *     </DialogBody>
 *     <DialogFooter>
 *       <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button onClick={handleConfirm}>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */

// ============================================================================
// Root Component
// ============================================================================

interface DialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
  /** Modal or non-modal (default: true) */
  modal?: boolean;
}

/**
 * Dialog Root
 * Contains all parts of a dialog
 */
function Dialog({ modal = true, ...props }: DialogProps) {
  return <DialogPrimitive.Root modal={modal} data-slot="dialog" {...props} />;
}

// ============================================================================
// Trigger Component
// ============================================================================

interface DialogTriggerProps extends React.ComponentProps<typeof DialogPrimitive.Trigger> {
  /** Merge props onto child element */
  asChild?: boolean;
}

/**
 * Dialog Trigger
 * The button that opens the dialog
 */
function DialogTrigger({ asChild = false, ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger
      asChild={asChild}
      data-slot="dialog-trigger"
      {...props}
    />
  );
}

// ============================================================================
// Portal Component
// ============================================================================

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

// ============================================================================
// Close Component
// ============================================================================

interface DialogCloseProps extends React.ComponentProps<typeof DialogPrimitive.Close> {
  /** Merge props onto child element */
  asChild?: boolean;
}

/**
 * Dialog Close
 * Button to close the dialog (can be used anywhere inside dialog content)
 */
function DialogClose({ asChild = false, ...props }: DialogCloseProps) {
  return (
    <DialogPrimitive.Close
      asChild={asChild}
      data-slot="dialog-close"
      {...props}
    />
  );
}

// ============================================================================
// Overlay Component
// ============================================================================

/**
 * Dialog Overlay
 * The backdrop overlay that appears behind the dialog
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "fixed inset-0 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    style={{
      zIndex: tokens.zIndex.overlay.modalBackdrop,
      backgroundColor: tokens.colors.surface.overlay,
      transitionDuration: tokens.motion.duration.normal,
      transitionTimingFunction: tokens.motion.easing.easeOut,
      ...style,
    }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// ============================================================================
// Content Component with CVA Variants
// ============================================================================

/**
 * CVA Variants for Dialog Content
 * Defines size and animation variants using class-variance-authority
 */
const dialogContentVariants = cva(
  // Base styles
  "fixed left-[50%] translate-x-[-50%] grid w-full border focus:outline-none",
  {
    variants: {
      // Size variants
      size: {
        sm: "max-w-sm top-[50%] translate-y-[-50%]",
        md: "max-w-lg top-[50%] translate-y-[-50%]",
        lg: "max-w-2xl top-[50%] translate-y-[-50%]",
        xl: "max-w-4xl top-[50%] translate-y-[-50%]",
        fullscreen: "w-screen h-screen max-w-none top-0 translate-y-0 rounded-none border-0",
      },
      // Animation variants
      animation: {
        fade: cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        ),
        scale: cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        ),
        "slide-up": cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2"
        ),
        "slide-down": cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2"
        ),
      },
      // Scrollable variant
      scrollable: {
        true: "max-h-[85vh]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      animation: "scale",
      scrollable: false,
    },
  }
);

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  /** Show close button (default: true) */
  showCloseButton?: boolean;
  /** Custom close button label for screen readers */
  closeLabel?: string;
  /** Loading state */
  loading?: boolean;
  /** Custom close icon */
  closeIcon?: React.ReactNode;
}

/**
 * Dialog Content
 * The content container of the dialog
 *
 * Props:
 * - size: Control dialog width (sm, md, lg, xl, fullscreen)
 * - animation: Control enter/exit animation
 * - scrollable: Enable scrolling for tall content
 * - showCloseButton: Show/hide the close button
 * - loading: Show loading state
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({
  className,
  style,
  children,
  size,
  animation,
  scrollable,
  showCloseButton = true,
  closeLabel = "Close",
  loading = false,
  closeIcon,
  ...props
}, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        data-loading={loading ? "true" : undefined}
        className={cn(
          dialogContentVariants({ size, animation, scrollable }),
          className,
        )}
        style={{
          zIndex: tokens.zIndex.modal.content,
          backgroundColor: tokens.colors.surface.elevated,
          color: tokens.colors.text.primary,
          borderColor: tokens.colors.border.default,
          borderRadius: size === "fullscreen" ? 0 : tokens.radius.component.modal,
          boxShadow: size === "fullscreen" ? "none" : tokens.elevation.component.modal,
          padding: tokens.spacing.component.modalPadding,
          gap: tokens.spacing.gap.md,
          transitionDuration: tokens.motion.duration.normal,
          transitionTimingFunction: tokens.motion.easing.easeOut,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <div
            className="flex items-center justify-center"
            style={{
              minHeight: "200px",
              gap: tokens.spacing.gap.md,
            }}
          >
            <div
              className="animate-spin rounded-full border-2 border-current border-t-transparent"
              style={{
                width: "32px",
                height: "32px",
                color: tokens.colors.interactive.primary,
              }}
            />
            <span style={{ color: tokens.colors.text.secondary }}>
              Loading...
            </span>
          </div>
        ) : (
          <>
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                className={cn(
                  "absolute rounded-sm opacity-70 transition-opacity",
                  "hover:opacity-100 focus:opacity-100",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "disabled:pointer-events-none",
                  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
                  "[&_svg:not([class*='size-'])]:size-4"
                )}
                style={{
                  top: tokens.spacing.spacing.md,
                  right: tokens.spacing.spacing.md,
                  color: tokens.colors.text.secondary,
                  // Focus ring
                  // @ts-ignore - CSS variable
                  "--tw-ring-color": tokens.focus.ring.color,
                  // @ts-ignore
                  "--tw-ring-offset-color": tokens.colors.surface.elevated,
                }}
                aria-label={closeLabel}
              >
                {closeIcon || <XIcon />}
                <span className="sr-only">{closeLabel}</span>
              </DialogPrimitive.Close>
            )}
          </>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

// ============================================================================
// Composition Components
// ============================================================================

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Dialog Header
 * Container for dialog title and description
 */
function DialogHeader({ className, style, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col text-center sm:text-left", className)}
      style={{
        gap: tokens.spacing.gap.sm,
        ...style,
      }}
      {...props}
    />
  );
}

interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable scrolling for overflow content */
  scrollable?: boolean;
}

/**
 * Dialog Body
 * Container for main dialog content
 * Use this for scrollable content areas
 */
function DialogBody({ className, style, scrollable = false, ...props }: DialogBodyProps) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "flex flex-col",
        scrollable && "overflow-y-auto",
        className
      )}
      style={{
        gap: tokens.spacing.gap.md,
        ...(scrollable && {
          maxHeight: "60vh",
          paddingRight: tokens.spacing.spacing.sm,
          // Custom scrollbar styling
          scrollbarWidth: "thin",
          scrollbarColor: `${tokens.colors.border.default} transparent`,
        }),
        ...style,
      }}
      {...props}
    />
  );
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Dialog Footer
 * Container for action buttons
 */
function DialogFooter({ className, style, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        ...style,
      }}
      {...props}
    />
  );
}

interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

/**
 * Dialog Title
 * Accessible title for the dialog
 * Required for accessibility
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, style, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("leading-none", className)}
      style={{
        fontSize: tokens.typography.heading.h3.fontSize,
        fontWeight: tokens.typography.heading.h3.fontWeight,
        lineHeight: tokens.typography.heading.h3.lineHeight,
        letterSpacing: tokens.typography.heading.h3.letterSpacing,
        color: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

/**
 * Dialog Description
 * Optional description text for the dialog
 * Improves accessibility
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, style, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn(className)}
      style={{
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        color: tokens.colors.text.secondary,
        ...style,
      }}
      {...props}
    />
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// ============================================================================
// Exports
// ============================================================================

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBody,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

// Export types
export type {
  DialogProps,
  DialogTriggerProps,
  DialogCloseProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
};
