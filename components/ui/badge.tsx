import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

const badgeVariants = cva(
  "inline-flex items-center justify-center border w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
        outline:
          "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  style,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: tokens.colors.interactive.primary,
      color: tokens.colors.text.inverse,
    },
    secondary: {
      backgroundColor: tokens.colors.interactive.secondary,
      color: tokens.colors.text.primary,
    },
    destructive: {
      backgroundColor: tokens.colors.interactive.destructive,
    },
    outline: {
      color: tokens.colors.text.primary,
    },
  };

  const currentVariant = variant || "default";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      style={{
        borderRadius: tokens.radius.component.badge,
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.body.xs.fontSize,
        lineHeight: tokens.typography.body.xs.lineHeight,
        fontWeight: tokens.typography.fontWeight.medium,
        gap: tokens.spacing.gap.xs,
        ...variantStyles[currentVariant],
        ...style,
      }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
