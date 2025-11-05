"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Checkbox({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border shrink-0 transition-shadow outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
        className,
      )}
      style={{
        width: tokens.spacing.spacing.lg,
        height: tokens.spacing.spacing.lg,
        borderRadius: tokens.radius.radius.sm,
        borderColor: tokens.colors.border.default,
        backgroundColor: tokens.colors.surface.sunken,
        boxShadow: tokens.elevation.shadow.xs,
        ["--primary" as string]: tokens.colors.interactive.primary,
        ["--primary-foreground" as string]: tokens.colors.text.inverse,
        ...style,
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
