"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

const toggleVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  style,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    default: {
      height: tokens.spacing.spacing.xl,
      paddingLeft: tokens.spacing.spacing.sm,
      paddingRight: tokens.spacing.spacing.sm,
      minWidth: tokens.spacing.spacing.xl,
    },
    sm: {
      height: tokens.spacing.spacing.lg,
      paddingLeft: tokens.spacing.spacing.xs,
      paddingRight: tokens.spacing.spacing.xs,
      minWidth: tokens.spacing.spacing.lg,
    },
    lg: {
      height: tokens.spacing.spacing['2xl'],
      paddingLeft: tokens.spacing.spacing.md,
      paddingRight: tokens.spacing.spacing.md,
      minWidth: tokens.spacing.spacing['2xl'],
    },
  };

  const currentSize = size || "default";

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      style={{
        borderRadius: tokens.radius.radius.sm,
        gap: tokens.spacing.gap.sm,
        ...sizeStyles[currentSize],
        ...style,
      }}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
