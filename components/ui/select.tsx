"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

/**
 * Select Component - World-Class Implementation
 *
 * A customizable select dropdown component built on Radix UI Select primitive.
 * Provides native select functionality with enhanced styling and accessibility.
 *
 * Features:
 * - Size variants (sm, md, lg)
 * - Validation states (default, error, success, warning)
 * - Icon support in items
 * - Loading state
 * - Grouped options
 * - Searchable options (via Radix)
 * - Full keyboard navigation
 * - Complete design token integration
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * <Select value={value} onValueChange={setValue}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */

// ============================================================================
// Root Component
// ============================================================================

interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {}

/**
 * Select Root
 * Contains all parts of a select
 */
function Select({ ...props }: SelectProps) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

// ============================================================================
// Group Component
// ============================================================================

interface SelectGroupProps extends React.ComponentProps<typeof SelectPrimitive.Group> {}

/**
 * Select Group
 * Groups multiple select items together
 */
function SelectGroup({ ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

// ============================================================================
// Value Component
// ============================================================================

interface SelectValueProps extends React.ComponentProps<typeof SelectPrimitive.Value> {}

/**
 * Select Value
 * Displays the selected value
 */
function SelectValue({ ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

// ============================================================================
// Trigger Component with CVA
// ============================================================================

const selectTriggerVariants = cva(
  // Base styles matching shadcn aesthetic
  cn(
    "flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2",
    "text-sm shadow-sm ring-offset-background",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&>span]:line-clamp-1",
  ),
  {
    variants: {
      // Size variants
      size: {
        sm: "h-9 px-2.5 py-1.5 text-xs",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-2.5 text-base",
      },
      // Validation state variants
      variant: {
        default: "",
        error: "border-red-500 focus:ring-red-500/20",
        success: "border-green-500 focus:ring-green-500/20",
        warning: "border-yellow-500 focus:ring-yellow-500/20",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  /** Size of the select trigger */
  size?: "sm" | "md" | "lg";
  /** Validation state */
  variant?: "default" | "error" | "success" | "warning";
  /** Show loading spinner */
  loading?: boolean;
}

/**
 * Select Trigger
 * Button that opens the select dropdown
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, style, size = "md", variant = "default", loading = false, children, ...props }, ref) => {
  // Size-specific token values
  const sizeConfig = {
    sm: {
      height: "32px",
      paddingX: tokens.spacing.spacing.sm,
      paddingY: tokens.spacing.spacing.xs,
      fontSize: tokens.typography.body.sm.fontSize,
      lineHeight: tokens.typography.body.sm.lineHeight,
      iconSize: "14px",
    },
    md: {
      height: tokens.spacing.spacing['2xl'],
      paddingX: tokens.spacing.component.inputPadding,
      paddingY: tokens.spacing.spacing.sm,
      fontSize: tokens.typography.ui.input.fontSize,
      lineHeight: tokens.typography.ui.input.lineHeight,
      iconSize: "16px",
    },
    lg: {
      height: "48px",
      paddingX: tokens.spacing.spacing.lg,
      paddingY: tokens.spacing.spacing.md,
      fontSize: tokens.typography.body.lg.fontSize,
      lineHeight: tokens.typography.body.lg.lineHeight,
      iconSize: "18px",
    },
  };

  // Variant-specific colors
  const variantColors = {
    default: {
      borderColor: tokens.colors.border.default,
      focusBorderColor: tokens.colors.border.focus,
      ringColor: tokens.focus.ring.color,
    },
    error: {
      borderColor: tokens.colors.feedback.error,
      focusBorderColor: tokens.colors.feedback.error,
      ringColor: `${tokens.colors.feedback.error}33`,
    },
    success: {
      borderColor: tokens.colors.feedback.success,
      focusBorderColor: tokens.colors.feedback.success,
      ringColor: `${tokens.colors.feedback.success}33`,
    },
    warning: {
      borderColor: tokens.colors.feedback.warning,
      focusBorderColor: tokens.colors.feedback.warning,
      ringColor: `${tokens.colors.feedback.warning}33`,
    },
  };

  const config = sizeConfig[size];
  const colors = variantColors[variant];

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      data-loading={loading ? "true" : undefined}
      className={cn(selectTriggerVariants({ size, variant }), className)}
      style={{
        backgroundColor: tokens.colors.surface.sunken,
        color: tokens.colors.text.primary,
        borderColor: colors.borderColor,
        borderRadius: tokens.radius.component.input,
        paddingLeft: config.paddingX,
        paddingRight: config.paddingX,
        paddingTop: config.paddingY,
        paddingBottom: config.paddingY,
        fontSize: config.fontSize,
        lineHeight: config.lineHeight,
        height: config.height,
        gap: tokens.spacing.gap.sm,
        transitionDuration: tokens.motion.duration.fast,
        transitionTimingFunction: tokens.motion.easing.easeOut,
        // @ts-ignore - CSS variable
        "--tw-ring-color": colors.ringColor,
        // @ts-ignore
        "--tw-ring-offset-width": tokens.focus.ring.offset,
        ...style,
      }}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        {loading ? (
          <div
            className="animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{
              width: config.iconSize,
              height: config.iconSize,
              color: tokens.colors.interactive.primary,
            }}
          />
        ) : (
          <ChevronDownIcon
            style={{
              width: config.iconSize,
              height: config.iconSize,
              opacity: 0.5,
            }}
          />
        )}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// ============================================================================
// Content Component
// ============================================================================

export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {}

/**
 * Select Content
 * Container for the select options dropdown
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, style, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      style={{
        zIndex: tokens.zIndex.popup.dropdown,
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radius.component.select,
        boxShadow: tokens.elevation.component.dropdown,
        transitionDuration: tokens.motion.duration.normal,
        transitionTimingFunction: tokens.motion.easing.easeOut,
        ...style,
      }}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

// ============================================================================
// Label Component
// ============================================================================

export interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {}

/**
 * Select Label
 * Label for a group of select items
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, style, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    style={{
      color: tokens.colors.text.secondary,
      fontSize: tokens.typography.body.xs.fontSize,
      fontWeight: tokens.typography.fontWeight.semibold,
      padding: `${tokens.spacing.spacing.xs} ${tokens.spacing.spacing.sm}`,
      ...style,
    }}
    {...props}
  />
));

SelectLabel.displayName = SelectPrimitive.Label.displayName;

// ============================================================================
// Item Component
// ============================================================================

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Icon to display before the item text */
  icon?: React.ReactNode;
}

/**
 * Select Item
 * Individual option in the select dropdown
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, style, children, icon, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    style={{
      gap: tokens.spacing.gap.sm,
      borderRadius: tokens.radius.radius.sm,
      padding: `${tokens.spacing.spacing.xs} ${tokens.spacing.spacing['2xl']} ${tokens.spacing.spacing.xs} ${tokens.spacing.spacing.sm}`,
      fontSize: tokens.typography.ui.input.fontSize,
      lineHeight: tokens.typography.ui.input.lineHeight,
      transitionDuration: tokens.motion.duration.fast,
      transitionTimingFunction: tokens.motion.easing.easeOut,
      ...style,
    }}
    {...props}
  >
    {icon && (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: "16px",
          height: "16px",
        }}
      >
        {icon}
      </span>
    )}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span
      className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"
      style={{
        right: tokens.spacing.spacing.sm,
      }}
    >
      <SelectPrimitive.ItemIndicator>
        <CheckIcon style={{ width: "16px", height: "16px" }} />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

// ============================================================================
// Separator Component
// ============================================================================

export interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {}

/**
 * Select Separator
 * Visual divider between select items or groups
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, style, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    style={{
      backgroundColor: tokens.colors.border.subtle,
      margin: `${tokens.spacing.spacing.xs} 0`,
      ...style,
    }}
    {...props}
  />
));

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// ============================================================================
// Scroll Buttons
// ============================================================================

export interface SelectScrollUpButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {}

/**
 * Select Scroll Up Button
 * Button to scroll up in the select dropdown
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  SelectScrollUpButtonProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUpIcon style={{ width: "16px", height: "16px" }} />
  </SelectPrimitive.ScrollUpButton>
));

SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export interface SelectScrollDownButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> {}

/**
 * Select Scroll Down Button
 * Button to scroll down in the select dropdown
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  SelectScrollDownButtonProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDownIcon style={{ width: "16px", height: "16px" }} />
  </SelectPrimitive.ScrollDownButton>
));

SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// ============================================================================
// Exports
// ============================================================================

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

// Export types
export type {
  SelectProps,
  SelectGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectLabelProps,
  SelectItemProps,
  SelectSeparatorProps,
  SelectScrollUpButtonProps,
  SelectScrollDownButtonProps,
};
