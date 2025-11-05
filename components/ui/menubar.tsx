"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Menubar({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex items-center border shadow-xs",
        className,
      )}
      style={{
        height: tokens.spacing.spacing.lg,
        gap: tokens.spacing.gap.xs,
        borderRadius: tokens.radius.radius.md,
        padding: tokens.spacing.spacing.xs,
        backgroundColor: tokens.colors.surface.elevated,
        borderColor: tokens.colors.border.default,
        color: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center select-none outline-hidden",
        className,
      )}
      style={{
        borderRadius: tokens.radius.radius.sm,
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        fontWeight: tokens.typography.fontWeight.medium,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  style,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin) overflow-hidden border shadow-md",
          className,
        )}
        style={{
          zIndex: tokens.zIndex.popup.dropdown,
          minWidth: "12rem",
          backgroundColor: tokens.colors.surface.elevated,
          color: tokens.colors.text.primary,
          borderColor: tokens.colors.border.default,
          borderRadius: tokens.radius.component.dropdown,
          boxShadow: tokens.elevation.component.dropdown,
          padding: tokens.spacing.spacing.xs,
          ["--accent" as string]: tokens.colors.interactive.secondary,
          ["--accent-foreground" as string]: tokens.colors.text.primary,
          ["--destructive" as string]: tokens.colors.feedback.error,
          ["--destructive-foreground" as string]: tokens.colors.text.inverse,
          ...style,
        }}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  style,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center select-none outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        borderRadius: tokens.radius.radius.sm,
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ["--destructive" as string]: tokens.colors.feedback.error,
        ["--destructive-foreground" as string]: tokens.colors.text.inverse,
        ...style,
      }}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  style,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center select-none outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        borderRadius: tokens.radius.radius.xs,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        paddingRight: tokens.spacing.spacing.sm,
        paddingLeft: tokens.spacing.spacing.lg,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute flex size-3.5 items-center justify-center"
        style={{ left: tokens.spacing.spacing.sm }}
      >
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center select-none outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        borderRadius: tokens.radius.radius.xs,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        paddingRight: tokens.spacing.spacing.sm,
        paddingLeft: tokens.spacing.spacing.lg,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    >
      <span
        className="pointer-events-none absolute flex size-3.5 items-center justify-center"
        style={{ left: tokens.spacing.spacing.sm }}
      >
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  style,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn("data-[inset]:pl-8", className)}
      style={{
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.text.secondary,
        ...style,
      }}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1", className)}
      style={{
        height: tokens.spacing.spacing['2xs'],
        marginTop: tokens.spacing.spacing.xs,
        marginBottom: tokens.spacing.spacing.xs,
        backgroundColor: tokens.colors.border.subtle,
        ...style,
      }}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "text-muted-foreground ml-auto tracking-widest",
        className,
      )}
      style={{
        fontSize: tokens.typography.body.xs.fontSize,
        lineHeight: tokens.typography.body.xs.lineHeight,
        color: tokens.colors.text.secondary,
        ...style,
      }}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center select-none outline-none data-[inset]:pl-8",
        className,
      )}
      style={{
        borderRadius: tokens.radius.radius.sm,
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        color: tokens.colors.text.primary,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin) overflow-hidden border shadow-lg",
        className,
      )}
      style={{
        zIndex: tokens.zIndex.popup.dropdown,
        minWidth: "8rem",
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radius.component.dropdown,
        boxShadow: tokens.elevation.component.dropdown,
        padding: tokens.spacing.spacing.xs,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ["--destructive" as string]: tokens.colors.feedback.error,
        ["--destructive-foreground" as string]: tokens.colors.text.inverse,
        ...style,
      }}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
