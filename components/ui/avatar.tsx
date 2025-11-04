"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Avatar({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        className,
      )}
      style={{
        width: tokens.spacing.spacing['4xl'],
        height: tokens.spacing.spacing['4xl'],
        borderRadius: tokens.radius.radius.full,
        ...style,
      }}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      style={style}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center",
        className,
      )}
      style={{
        backgroundColor: tokens.colors.surface.sunken,
        color: tokens.colors.text.secondary,
        borderRadius: tokens.radius.radius.full,
        ...style,
      }}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
