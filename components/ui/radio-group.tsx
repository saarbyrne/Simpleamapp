"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function RadioGroup({
  className,
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid", className)}
      style={{
        gap: tokens.spacing.gap.md,
        ...style,
      }}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square shrink-0 rounded-full border transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{
        width: tokens.spacing.spacing.lg,
        height: tokens.spacing.spacing.lg,
        borderColor: tokens.colors.border.default,
        backgroundColor: tokens.colors.surface.sunken,
        color: tokens.colors.interactive.primary,
        boxShadow: tokens.elevation.shadow.xs,
        ["--primary" as string]: tokens.colors.interactive.primary,
        ...style,
      }}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
