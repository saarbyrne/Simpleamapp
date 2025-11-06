"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Tabs({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      style={{
        gap: tokens.spacing.gap.sm,
        ...style,
      }}
      {...props}
    />
  );
}

function TabsList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-fit items-center justify-center flex",
        className,
      )}
      style={{
        backgroundColor: tokens.colors.surface.sunken,
        color: tokens.colors.text.secondary,
        height: tokens.spacing.spacing.xl,
        borderRadius: tokens.radius.component.tab,
        padding: tokens.spacing.spacing.xs,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center border border-transparent whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        borderRadius: tokens.radius.component.tab,
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.ui.button.fontSize,
        fontWeight: tokens.typography.ui.button.fontWeight,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ["--ring" as string]: tokens.focus.ring,
        ...style,
      }}
      {...props}
    />
  );
}

function TabsContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      style={style}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
