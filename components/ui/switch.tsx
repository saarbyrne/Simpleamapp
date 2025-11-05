"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Switch({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className,
      )}
      style={{
        height: tokens.spacing.spacing.lg,
        width: tokens.spacing.spacing.xl,
        borderColor: tokens.colors.border.subtle,
        ["--primary" as string]: tokens.colors.interactive.primary,
        ["--input" as string]: tokens.colors.surface.sunken,
        ...style,
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full ring-0 transition-transform",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
        style={{
          width: tokens.spacing.spacing.lg,
          height: tokens.spacing.spacing.lg,
          backgroundColor: tokens.colors.surface.elevated,
          borderColor: tokens.colors.interactive.primary,
          borderStyle: "solid",
          borderWidth: tokens.spacing.spacing['2xs'],
        }}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
