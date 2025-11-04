import * as React from "react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Input({ className, style, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 border outline-none transition-[color,box-shadow]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{
        backgroundColor: tokens.colors.surface.sunken,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radius.component.input,
        padding: `${tokens.spacing.spacing.sm} ${tokens.spacing.component.inputPadding}`,
        fontSize: tokens.typography.ui.input.fontSize,
        lineHeight: tokens.typography.ui.input.lineHeight,
        height: tokens.spacing.spacing['2xl'],
        ...style,
      }}
      {...props}
    />
  );
}

export { Input };
