import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "border",
        secondary: "",
        ghost: "",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "has-[>svg]:px-3",
        sm: "has-[>svg]:px-2.5",
        lg: "has-[>svg]:px-4",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, style, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  // Variant styles using tokens
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: tokens.colors.interactive.primary,
      color: tokens.colors.text.inverse,
    },
    destructive: {
      backgroundColor: tokens.colors.interactive.destructive,
      color: tokens.colors.text.inverse,
    },
    outline: {
      backgroundColor: tokens.colors.surface.base,
      color: tokens.colors.text.primary,
      borderColor: tokens.colors.border.default,
    },
    secondary: {
      backgroundColor: tokens.colors.interactive.secondary,
      color: tokens.colors.text.primary,
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

  // Size styles using tokens
  const sizeStyles: Record<string, React.CSSProperties> = {
    default: {
      height: tokens.spacing.spacing['2xl'],
      paddingLeft: tokens.spacing.spacing.lg,
      paddingRight: tokens.spacing.spacing.lg,
      paddingTop: tokens.spacing.spacing.sm,
      paddingBottom: tokens.spacing.spacing.sm,
    },
    sm: {
      height: tokens.spacing.spacing.xl,
      paddingLeft: tokens.spacing.component.inputPadding,
      paddingRight: tokens.spacing.component.inputPadding,
      gap: tokens.spacing.gap.xs,
    },
    lg: {
      height: tokens.spacing.spacing['3xl'],
      paddingLeft: tokens.spacing.spacing['2xl'],
      paddingRight: tokens.spacing.spacing['2xl'],
    },
    icon: {
      width: tokens.spacing.spacing['2xl'],
      height: tokens.spacing.spacing['2xl'],
      padding: 0,
    },
  };

  const currentVariant = variant || "default";
  const currentSize = size || "default";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={{
        borderRadius: tokens.radius.component.button,
        fontSize: tokens.typography.ui.button.fontSize,
        fontWeight: tokens.typography.ui.button.fontWeight,
        lineHeight: tokens.typography.ui.button.lineHeight,
        gap: tokens.spacing.gap.sm,
        ...variantStyles[currentVariant],
        ...sizeStyles[currentSize],
        ...style,
      }}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
