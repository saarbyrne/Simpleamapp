import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

/**
 * Button Component - World-Class Implementation
 *
 * A flexible button component with extensive variant support.
 * Built with design tokens and Radix UI Slot for composition.
 *
 * Features:
 * - Style variants (default, destructive, outline, secondary, ghost, link)
 * - Size variants (sm, default, lg, icon)
 * - Loading state with spinner
 * - Icon support (left and right positioning)
 * - Full width option
 * - Disabled state support
 * - asChild prop for composition
 * - Complete design token integration
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant and size
 * <Button variant="destructive" size="lg">Delete</Button>
 *
 * // Loading state
 * <Button loading>Processing...</Button>
 *
 * // With icons
 * <Button>
 *   <IconLeft icon={PlusIcon} />
 *   Add Item
 * </Button>
 *
 * // Full width
 * <Button fullWidth>Submit Form</Button>
 *
 * // As a link (composition)
 * <Button asChild>
 *   <a href="/home">Go Home</a>
 * </Button>
 * ```
 */

// ============================================================================
// CVA Variants
// ============================================================================

const buttonVariants = cva(
  // Base styles matching shadcn aesthetic
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
  {
    variants: {
      // Style variants
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size variants
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      // Full width
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component (composition pattern) */
  asChild?: boolean;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Make button full width */
  fullWidth?: boolean;
  /** Icon to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right */
  rightIcon?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Button Component
 * Flexible button with variants, sizes, and loading state
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      style,
      variant = "default",
      size = "default",
      fullWidth = false,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    // Variant-specific color values from tokens
    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: tokens.colors.interactive.primary,
        color: tokens.colors.text.inverse,
        boxShadow: tokens.elevation.component.button,
      },
      destructive: {
        backgroundColor: tokens.colors.interactive.destructive,
        color: tokens.colors.text.inverse,
        boxShadow: tokens.elevation.component.card,
      },
      outline: {
        backgroundColor: tokens.colors.surface.base,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        boxShadow: tokens.elevation.component.card,
      },
      secondary: {
        backgroundColor: tokens.colors.interactive.secondary,
        color: tokens.colors.text.primary,
        boxShadow: tokens.elevation.component.card,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: tokens.colors.text.primary,
      },
      link: {
        backgroundColor: 'transparent',
        color: tokens.colors.interactive.primary,
      },
    };

    // Size-specific values from tokens
    const sizeStyles: Record<string, React.CSSProperties> = {
      default: {
        height: tokens.spacing.spacing['2xl'],
        paddingLeft: tokens.spacing.component.buttonPadding.split(' ')[1] || tokens.spacing.spacing.lg,
        paddingRight: tokens.spacing.component.buttonPadding.split(' ')[1] || tokens.spacing.spacing.lg,
        fontSize: tokens.typography.ui.button.fontSize,
        lineHeight: tokens.typography.ui.button.lineHeight,
      },
      sm: {
        height: tokens.spacing.spacing.xl,
        paddingLeft: tokens.spacing.component.inputPadding,
        paddingRight: tokens.spacing.component.inputPadding,
        fontSize: tokens.typography.ui.buttonSm.fontSize,
        lineHeight: tokens.typography.ui.buttonSm.lineHeight,
      },
      lg: {
        height: tokens.spacing.spacing['3xl'],
        paddingLeft: tokens.spacing.spacing['2xl'],
        paddingRight: tokens.spacing.spacing['2xl'],
        fontSize: tokens.typography.ui.buttonLg.fontSize,
        lineHeight: tokens.typography.ui.buttonLg.lineHeight,
      },
      icon: {
        width: tokens.spacing.spacing['2xl'],
        height: tokens.spacing.spacing['2xl'],
        padding: 0,
      },
    };

    const currentVariant = variant || "default";
    const currentSize = size || "default";

    // Loading spinner size based on button size
    const spinnerSize = size === "sm" ? "14px" : size === "lg" ? "18px" : "16px";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-loading={loading ? "true" : undefined}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        style={{
          borderRadius: tokens.radius.component.button,
          fontWeight: tokens.typography.ui.button.fontWeight,
          gap: tokens.spacing.gap.sm,
          transitionDuration: tokens.motion.duration.fast,
          transitionTimingFunction: tokens.motion.easing.easeOut,
          // Focus ring from tokens
          // @ts-ignore - CSS variable
          "--tw-ring-color": tokens.focus.ring.color,
          // @ts-ignore
          "--tw-ring-offset-width": tokens.focus.ring.offset,
          ...variantStyles[currentVariant],
          ...sizeStyles[currentSize],
          ...style,
        }}
        {...props}
      >
        {loading && (
          <div
            className="animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{
              width: spinnerSize,
              height: spinnerSize,
            }}
            aria-hidden="true"
          />
        )}
        {!loading && leftIcon && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: spinnerSize,
              height: spinnerSize,
            }}
          >
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: spinnerSize,
              height: spinnerSize,
            }}
          >
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// ============================================================================
// Icon Helper Components
// ============================================================================

export interface ButtonIconProps {
  /** The icon component to render */
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  /** Size of the icon */
  size?: number | string;
  /** Additional class name */
  className?: string;
}

/**
 * ButtonIconLeft
 * Helper component for left-aligned icons in buttons
 */
export function ButtonIconLeft({ icon: Icon, size = 16, className }: ButtonIconProps) {
  return <Icon size={size} className={cn("shrink-0", className)} />;
}

/**
 * ButtonIconRight
 * Helper component for right-aligned icons in buttons
 */
export function ButtonIconRight({ icon: Icon, size = 16, className }: ButtonIconProps) {
  return <Icon size={size} className={cn("shrink-0", className)} />;
}

// ============================================================================
// Button Group Component
// ============================================================================

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Vertical orientation */
  vertical?: boolean;
}

/**
 * ButtonGroup
 * Container for grouping multiple buttons together
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, style, vertical = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="button-group"
        className={cn(
          "inline-flex",
          vertical ? "flex-col" : "flex-row",
          "[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md",
          vertical && "[&>button:first-child]:rounded-t-md [&>button:first-child]:rounded-l-none [&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none",
          "[&>button:not(:first-child)]:border-l-0",
          vertical && "[&>button:not(:first-child)]:border-l [&>button:not(:first-child)]:border-t-0",
          className
        )}
        style={{
          gap: 0,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// ============================================================================
// Exports
// ============================================================================

export { Button, buttonVariants, ButtonGroup };

// Export types
export type { ButtonProps, ButtonGroupProps };
