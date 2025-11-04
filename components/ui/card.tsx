import * as React from "react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Card({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col border",
        className,
      )}
      style={{
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radius.component.card,
        boxShadow: tokens.elevation.component.card,
        gap: tokens.spacing.gap.lg,
        ...style,
      }}
      {...props}
    />
  );
}

function CardHeader({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        paddingLeft: tokens.spacing.spacing['2xl'],
        paddingRight: tokens.spacing.spacing['2xl'],
        paddingTop: tokens.spacing.spacing['2xl'],
        ...style,
      }}
      {...props}
    />
  );
}

function CardTitle({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      style={{
        fontSize: tokens.typography.heading.h4.fontSize,
        fontWeight: tokens.typography.heading.h4.fontWeight,
        lineHeight: tokens.typography.heading.h4.lineHeight,
        ...style,
      }}
      {...props}
    />
  );
}

function CardDescription({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
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
}

function CardAction({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

function CardContent({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("[&:last-child]:pb-6", className)}
      style={{
        paddingLeft: tokens.spacing.spacing['2xl'],
        paddingRight: tokens.spacing.spacing['2xl'],
        ...style,
      }}
      {...props}
    />
  );
}

function CardFooter({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center [.border-t]:pt-6", className)}
      style={{
        paddingLeft: tokens.spacing.spacing['2xl'],
        paddingRight: tokens.spacing.spacing['2xl'],
        paddingBottom: tokens.spacing.spacing['2xl'],
        ...style,
      }}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
