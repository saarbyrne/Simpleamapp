"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center select-none outline-hidden data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) overflow-hidden border shadow-lg",
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

function ContextMenuContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto border shadow-md",
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
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  style,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
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
        color:
          variant === "destructive"
            ? tokens.colors.feedback.error
            : tokens.colors.text.primary,
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

function ContextMenuCheckboxItem({
  className,
  style,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center select-none outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        borderRadius: tokens.radius.radius.sm,
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
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center select-none outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        borderRadius: tokens.radius.radius.sm,
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
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  style,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn("text-foreground data-[inset]:pl-8", className)}
      style={{
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        paddingTop: tokens.spacing.spacing.xs,
        paddingBottom: tokens.spacing.spacing.xs,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        fontWeight: tokens.typography.fontWeight.medium,
        ...style,
      }}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1", className)}
      style={{
        height: "1px",
        marginTop: tokens.spacing.spacing.xs,
        marginBottom: tokens.spacing.spacing.xs,
        ...style,
      }}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto tracking-widest",
        className,
      )}
      style={{
        fontSize: tokens.typography.body.xs.fontSize,
        lineHeight: tokens.typography.body.xs.lineHeight,
        ...style,
      }}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
