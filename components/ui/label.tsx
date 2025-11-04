"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Label({
  className,
  style,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      style={{
        gap: tokens.spacing.gap.xs,
        fontSize: tokens.typography.ui.label.fontSize,
        lineHeight: tokens.typography.ui.label.lineHeight,
        fontWeight: tokens.typography.ui.label.fontWeight,
        color: tokens.colors.text.primary,
        ...style,
      }}
      {...props}
    />
  );
}

export { Label };
