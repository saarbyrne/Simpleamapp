"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  style,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto border shadow-md",
          className,
        )}
        style={{
          zIndex: tokens.zIndex.popup.dropdown,
          minWidth: "8rem",
          borderRadius: tokens.radius.radius.md,
          padding: tokens.spacing.spacing.xs,
          ...style,
        }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  style,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
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
        ...style,
      }}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  style,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
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
        ...style,
      }}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute flex size-3.5 items-center justify-center"
        style={{ left: tokens.spacing.spacing.sm }}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
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
        ...style,
      }}
      {...props}
    >
      <span
        className="pointer-events-none absolute flex size-3.5 items-center justify-center"
        style={{ left: tokens.spacing.spacing.sm }}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  style,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
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
        ...style,
      }}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
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

function DropdownMenuShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
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

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center select-none outline-hidden data-[inset]:pl-8",
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
        ...style,
      }}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden border shadow-lg",
        className,
      )}
      style={{
        zIndex: tokens.zIndex.popup.dropdown,
        minWidth: "8rem",
        borderRadius: tokens.radius.radius.md,
        padding: tokens.spacing.spacing.xs,
        ...style,
      }}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
