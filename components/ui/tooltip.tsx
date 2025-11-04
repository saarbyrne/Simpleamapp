"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function TooltipProvider({
  delayDuration = 0,
  style,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  style,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" style={style} {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  style,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" style={style} {...props} />;
}

function TooltipContent({
  className,
  style,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-fit origin-(--radix-tooltip-content-transform-origin) text-balance",
          className,
        )}
        style={{
          zIndex: tokens.zIndex.popup.tooltip,
          backgroundColor: tokens.colors.interactive.primary,
          color: tokens.colors.text.inverse,
          borderRadius: tokens.radius.component.tooltip,
          paddingLeft: tokens.spacing.spacing.sm,
          paddingRight: tokens.spacing.spacing.sm,
          paddingTop: tokens.spacing.spacing.xs,
          paddingBottom: tokens.spacing.spacing.xs,
          fontSize: tokens.typography.body.xs.fontSize,
          lineHeight: tokens.typography.body.xs.lineHeight,
          ...style,
        }}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
          style={{
            backgroundColor: tokens.colors.interactive.primary,
            fill: tokens.colors.interactive.primary,
            zIndex: tokens.zIndex.popup.tooltip,
          }}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
