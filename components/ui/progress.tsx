"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Progress({
  className,
  style,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative w-full overflow-hidden",
        className,
      )}
      style={{
        backgroundColor: `${tokens.colors.interactive.primary}33`, // 20% opacity
        height: tokens.spacing.spacing.sm,
        borderRadius: tokens.radius.radius.full,
        ...style,
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{
          backgroundColor: tokens.colors.interactive.primary,
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
