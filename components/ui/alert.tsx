import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

const alertVariants = cva(
  "relative w-full border grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  style,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: tokens.colors.surface.elevated,
      color: tokens.colors.text.primary,
      borderColor: tokens.colors.border.default,
    },
    destructive: {
      backgroundColor: tokens.colors.surface.elevated,
      color: tokens.colors.feedback.error,
      borderColor: tokens.colors.feedback.error,
    },
  };

  const currentVariant = variant || "default";

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      style={{
        borderRadius: tokens.radius.component.card,
        paddingLeft: tokens.spacing.spacing.xl,
        paddingRight: tokens.spacing.spacing.xl,
        paddingTop: tokens.spacing.spacing.md,
        paddingBottom: tokens.spacing.spacing.md,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        gap: `${tokens.spacing.gap.md} ${tokens.spacing.gap.xs}`,
        ...variantStyles[currentVariant],
        ...style,
      }}
      {...props}
    />
  );
}

function AlertTitle({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 tracking-tight",
        className,
      )}
      style={{
        fontWeight: tokens.typography.fontWeight.medium,
        ...style,
      }}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start [&_p]:leading-relaxed",
        className,
      )}
      style={{
        color: tokens.colors.text.secondary,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        gap: tokens.spacing.gap.xs,
        ...style,
      }}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
