import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Breadcrumb({ style, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" style={style} {...props} />;
}

function BreadcrumbList({ className, style, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center break-words",
        className,
      )}
      style={{
        color: tokens.colors.text.secondary,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        gap: tokens.spacing.gap.sm,
        ...style,
      }}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, style, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", className)}
      style={{
        gap: tokens.spacing.gap.sm,
        ...style,
      }}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  style,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("transition-colors", className)}
      style={{
        color: "inherit",
        ...style,
      }}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, style, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(className)}
      style={{
        color: tokens.colors.text.primary,
        fontWeight: tokens.typography.fontWeight.normal,
        ...style,
      }}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  style,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      style={style}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex items-center justify-center", className)}
      style={{
        width: tokens.spacing.spacing.xl,
        height: tokens.spacing.spacing.xl,
        ...style,
      }}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
