import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.xs,
        ...style,
      }}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex w-max items-center justify-center bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
);

function NavigationMenuTrigger({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      style={{
        height: tokens.spacing.spacing.lg,
        borderRadius: tokens.radius.radius.md,
        paddingLeft: tokens.spacing.spacing.md,
        paddingRight: tokens.spacing.spacing.md,
        paddingTop: tokens.spacing.spacing.sm,
        paddingBottom: tokens.spacing.spacing.sm,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.text.primary,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className,
      )}
      style={{
        padding: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.md,
        backgroundColor: tokens.colors.surface.elevated,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radius.component.dropdown,
        boxShadow: tokens.elevation.component.dropdown,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate flex justify-center",
      )}
      style={{
        zIndex: tokens.zIndex.popup.dropdown,
      }}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        style={{
          marginTop: tokens.spacing.spacing.xs,
          backgroundColor: tokens.colors.surface.elevated,
          color: tokens.colors.text.primary,
          borderColor: tokens.colors.border.default,
          borderRadius: tokens.radius.component.dropdown,
          boxShadow: tokens.elevation.component.dropdown,
          ...style,
        }}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.xs,
        borderRadius: tokens.radius.radius.sm,
        padding: tokens.spacing.spacing.sm,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        color: tokens.colors.text.primary,
        ["--accent" as string]: tokens.colors.interactive.secondary,
        ["--accent-foreground" as string]: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex items-end justify-center overflow-hidden",
        className,
      )}
      style={{
        height: tokens.spacing.spacing.xs,
        ...style,
      }}
      {...props}
  >
     <div
        className="relative top-[60%] rotate-45 shadow-md"
        style={{
          height: tokens.spacing.spacing.sm,
          width: tokens.spacing.spacing.sm,
          borderTopLeftRadius: tokens.radius.radius.sm,
          backgroundColor: tokens.colors.surface.elevated,
          borderColor: tokens.colors.border.default,
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
