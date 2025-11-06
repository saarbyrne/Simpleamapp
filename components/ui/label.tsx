"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

/**
 * Label Component - World-Class Implementation
 *
 * An accessible label component for form inputs with enhanced features.
 * Built on Radix UI Label primitive with design token integration.
 *
 * Features:
 * - Size variants (sm, md, lg)
 * - Required/optional indicators
 * - Disabled state support
 * - Description text support
 * - Full keyboard navigation
 * - Complete design token integration
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 *
 * // With required indicator
 * <Label htmlFor="name" required>Full Name</Label>
 * <Input id="name" />
 *
 * // With optional indicator
 * <Label htmlFor="nickname" optional>Nickname</Label>
 * <Input id="nickname" />
 *
 * // With description
 * <Label htmlFor="bio">Biography</Label>
 * <LabelDescription>Tell us about yourself</LabelDescription>
 * <Textarea id="bio" />
 * ```
 */

// ============================================================================
// CVA Variants
// ============================================================================

const labelVariants = cva(
  // Base styles
  cn(
    "inline-flex items-center font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  ),
  {
    variants: {
      // Size variants
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
      // Disabled state
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** Size of the label */
  size?: "sm" | "md" | "lg";
  /** Show required indicator (red asterisk) */
  required?: boolean;
  /** Show optional indicator text */
  optional?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Label Component
 * Accessible label for form inputs with required/optional indicators
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(
  (
    {
      className,
      style,
      size = "md",
      required = false,
      optional = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    // Size-specific token values
    const sizeConfig = {
      sm: {
        fontSize: tokens.typography.body.xs.fontSize,
        lineHeight: tokens.typography.body.xs.lineHeight,
        fontWeight: tokens.typography.ui.label.fontWeight,
        gap: tokens.spacing.gap.xs,
      },
      md: {
        fontSize: tokens.typography.ui.label.fontSize,
        lineHeight: tokens.typography.ui.label.lineHeight,
        fontWeight: tokens.typography.ui.label.fontWeight,
        gap: tokens.spacing.gap.xs,
      },
      lg: {
        fontSize: tokens.typography.body.md.fontSize,
        lineHeight: tokens.typography.body.md.lineHeight,
        fontWeight: tokens.typography.ui.label.fontWeight,
        gap: tokens.spacing.gap.sm,
      },
    };

    const config = sizeConfig[size];

    return (
      <LabelPrimitive.Root
        ref={ref}
        data-slot="label"
        data-disabled={disabled ? "true" : undefined}
        className={cn(labelVariants({ size, disabled }), className)}
        style={{
          fontSize: config.fontSize,
          lineHeight: config.lineHeight,
          fontWeight: config.fontWeight,
          color: disabled ? tokens.colors.text.disabled : tokens.colors.text.primary,
          gap: config.gap,
          ...style,
        }}
        {...props}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            style={{
              color: tokens.colors.feedback.error,
              marginLeft: "2px",
            }}
          >
            *
          </span>
        )}
        {optional && !required && (
          <span
            style={{
              color: tokens.colors.text.tertiary,
              fontWeight: tokens.typography.fontWeight.normal,
              fontSize: size === "sm" ? tokens.typography.body.xs.fontSize : tokens.typography.body.sm.fontSize,
              marginLeft: tokens.spacing.spacing.xs,
            }}
          >
            (optional)
          </span>
        )}
      </LabelPrimitive.Root>
    );
  }
);

Label.displayName = "Label";

// ============================================================================
// Description Component
// ============================================================================

export interface LabelDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Size to match parent label */
  size?: "sm" | "md" | "lg";
}

/**
 * Label Description
 * Helper text that appears below a label to provide additional context
 */
const LabelDescription = React.forwardRef<HTMLParagraphElement, LabelDescriptionProps>(
  ({ className, style, size = "md", ...props }, ref) => {
    const sizeConfig = {
      sm: tokens.typography.body.xs.fontSize,
      md: tokens.typography.body.sm.fontSize,
      lg: tokens.typography.body.sm.fontSize,
    };

    return (
      <p
        ref={ref}
        data-slot="label-description"
        className={cn("text-sm", className)}
        style={{
          fontSize: sizeConfig[size],
          lineHeight: tokens.typography.body.sm.lineHeight,
          color: tokens.colors.text.secondary,
          marginTop: tokens.spacing.spacing.xs,
          ...style,
        }}
        {...props}
      />
    );
  }
);

LabelDescription.displayName = "LabelDescription";

// ============================================================================
// Error Message Component
// ============================================================================

export interface LabelErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Size to match parent label */
  size?: "sm" | "md" | "lg";
}

/**
 * Label Error
 * Error message that appears below an input to show validation errors
 */
const LabelError = React.forwardRef<HTMLParagraphElement, LabelErrorProps>(
  ({ className, style, size = "md", ...props }, ref) => {
    const sizeConfig = {
      sm: tokens.typography.body.xs.fontSize,
      md: tokens.typography.body.sm.fontSize,
      lg: tokens.typography.body.sm.fontSize,
    };

    return (
      <p
        ref={ref}
        data-slot="label-error"
        className={cn("text-sm font-medium", className)}
        role="alert"
        style={{
          fontSize: sizeConfig[size],
          lineHeight: tokens.typography.body.sm.lineHeight,
          color: tokens.colors.feedback.error,
          marginTop: tokens.spacing.spacing.xs,
          ...style,
        }}
        {...props}
      />
    );
  }
);

LabelError.displayName = "LabelError";

// ============================================================================
// Exports
// ============================================================================

export { Label, LabelDescription, LabelError };

// Export types
export type { LabelProps, LabelDescriptionProps, LabelErrorProps };
