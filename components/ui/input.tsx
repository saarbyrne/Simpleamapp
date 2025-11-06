import * as React from "react";
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

/**
 * Input Component - World-Class Implementation
 *
 * A flexible text input component with extensive customization options.
 * Built with design tokens and advanced patterns.
 *
 * Features:
 * - Size variants (sm, md, lg)
 * - Validation states (error, success, warning)
 * - Icon support (left and right)
 * - Loading state
 * - Clear button
 * - Character counter
 * - Full keyboard support
 * - Complete design token integration
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter text" />
 *
 * // With validation state
 * <Input variant="error" placeholder="Email" />
 *
 * // With icons
 * <Input
 *   size="lg"
 *   leftIcon={<SearchIcon />}
 *   rightIcon={<InfoIcon />}
 *   placeholder="Search..."
 * />
 *
 * // With character counter
 * <Input
 *   maxLength={100}
 *   showCharacterCount
 *   placeholder="Bio"
 * />
 * ```
 */

// ============================================================================
// CVA Variants
// ============================================================================

const inputVariants = cva(
  // Base styles
  cn(
    "flex w-full min-w-0 border outline-none transition-[color,border-color,box-shadow]",
    "placeholder:opacity-50",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:cursor-default read-only:focus:ring-0"
  ),
  {
    variants: {
      // Size variants
      size: {
        sm: "text-sm",
        md: "",
        lg: "text-base",
      },
      // Validation state variants
      variant: {
        default: "focus:ring-2 focus:ring-offset-0",
        error: "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
        success: "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
        warning: "border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20",
      },
      // Has icon modifiers
      hasLeftIcon: {
        true: "",
        false: "",
      },
      hasRightIcon: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Validation state */
  variant?: "default" | "error" | "success" | "warning";
  /** Size of the input */
  size?: "sm" | "md" | "lg";
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Show loading spinner */
  loading?: boolean;
  /** Show clear button (only for controlled inputs with value) */
  clearable?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Show character count (requires maxLength) */
  showCharacterCount?: boolean;
  /** Container class name */
  containerClassName?: string;
  /** Wrapper class name */
  wrapperClassName?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Input Component
 * Advanced text input with validation states, icons, and helper features
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      wrapperClassName,
      style,
      type = "text",
      size = "md",
      variant = "default",
      leftIcon,
      rightIcon,
      loading = false,
      clearable = false,
      onClear,
      showCharacterCount = false,
      value,
      maxLength,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value || "") : internalValue;
    const currentLength = currentValue.length;

    // Determine if we should show the clear button
    const showClearButton =
      clearable && currentValue.length > 0 && !disabled && !readOnly;

    // Determine right side content (priority: loading > clear > rightIcon)
    const rightContent = loading ? (
      <div
        className="animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{
          width: size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
          height: size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
          color: tokens.colors.interactive.primary,
        }}
      />
    ) : showClearButton ? (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isControlled && onClear) {
            onClear();
          } else {
            setInternalValue("");
          }
          // Focus the input after clearing
          if (ref && typeof ref === 'object' && ref.current) {
            ref.current.focus();
          }
        }}
        className={cn(
          "flex items-center justify-center rounded-sm opacity-50 transition-opacity",
          "hover:opacity-100 focus:opacity-100 focus:outline-none"
        )}
        style={{
          width: size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
          height: size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
          color: tokens.colors.text.secondary,
        }}
        tabIndex={-1}
        aria-label="Clear input"
      >
        <XIcon className="w-full h-full" />
      </button>
    ) : (
      rightIcon
    );

    // Size-specific token values
    const sizeConfig = {
      sm: {
        height: "32px",
        paddingY: tokens.spacing.spacing.xs,
        paddingX: tokens.spacing.spacing.sm,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        iconSize: "14px",
        gap: tokens.spacing.gap.xs,
      },
      md: {
        height: tokens.spacing.spacing['2xl'],
        paddingY: tokens.spacing.spacing.sm,
        paddingX: tokens.spacing.component.inputPadding,
        fontSize: tokens.typography.ui.input.fontSize,
        lineHeight: tokens.typography.ui.input.lineHeight,
        iconSize: "16px",
        gap: tokens.spacing.gap.sm,
      },
      lg: {
        height: "48px",
        paddingY: tokens.spacing.spacing.md,
        paddingX: tokens.spacing.spacing.lg,
        fontSize: tokens.typography.body.lg.fontSize,
        lineHeight: tokens.typography.body.lg.lineHeight,
        iconSize: "20px",
        gap: tokens.spacing.gap.md,
      },
    };

    const config = sizeConfig[size];

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
        ringColor: `${tokens.colors.feedback.error}33`, // 20% opacity
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

    const colors = variantColors[variant];

    return (
      <div className={cn("flex flex-col w-full", containerClassName)}>
        {/* Input Wrapper */}
        <div
          className={cn("relative flex items-center w-full", wrapperClassName)}
          style={{
            gap: config.gap,
          }}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div
              className="absolute left-0 flex items-center justify-center pointer-events-none"
              style={{
                width: config.iconSize,
                height: config.iconSize,
                marginLeft: config.paddingX,
                color: tokens.colors.text.secondary,
              }}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            type={type}
            value={isControlled ? value : internalValue}
            onChange={(e) => {
              if (!isControlled) {
                setInternalValue(e.target.value);
              }
              props.onChange?.(e);
            }}
            maxLength={maxLength}
            disabled={disabled}
            readOnly={readOnly}
            data-slot="input"
            className={cn(
              inputVariants({
                size,
                variant,
                hasLeftIcon: !!leftIcon,
                hasRightIcon: !!rightContent,
              }),
              className
            )}
            style={{
              backgroundColor: tokens.colors.surface.sunken,
              color: tokens.colors.text.primary,
              borderColor: colors.borderColor,
              borderRadius: tokens.radius.component.input,
              paddingTop: config.paddingY,
              paddingBottom: config.paddingY,
              paddingLeft: leftIcon
                ? `calc(${config.paddingX} + ${config.iconSize} + ${config.gap})`
                : config.paddingX,
              paddingRight: rightContent
                ? `calc(${config.paddingX} + ${config.iconSize} + ${config.gap})`
                : config.paddingX,
              fontSize: config.fontSize,
              lineHeight: config.lineHeight,
              height: config.height,
              transitionDuration: tokens.motion.duration.fast,
              transitionTimingFunction: tokens.motion.easing.easeOut,
              // @ts-ignore - CSS variable
              "--tw-ring-color": colors.ringColor,
              ...style,
            }}
            {...props}
          />

          {/* Right Icon/Loading/Clear */}
          {rightContent && (
            <div
              className="absolute right-0 flex items-center justify-center"
              style={{
                width: config.iconSize,
                height: config.iconSize,
                marginRight: config.paddingX,
                color: tokens.colors.text.secondary,
                // Make interactive if it's the clear button
                pointerEvents: showClearButton ? "auto" : "none",
              }}
            >
              {rightContent}
            </div>
          )}
        </div>

        {/* Character Counter */}
        {showCharacterCount && maxLength && (
          <div
            className="flex justify-end mt-1"
            style={{
              fontSize: tokens.typography.body.xs.fontSize,
              color:
                currentLength > maxLength * 0.9
                  ? tokens.colors.feedback.warning
                  : tokens.colors.text.tertiary,
            }}
          >
            <span>
              {currentLength} / {maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
