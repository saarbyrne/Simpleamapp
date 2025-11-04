import * as React from "react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Textarea({ className, style, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none flex field-sizing-content w-full border transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{
        minHeight: tokens.spacing.spacing['4xl'],
        backgroundColor: tokens.colors.surface.sunken,
        color: tokens.colors.text.primary,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radius.component.input,
        padding: `${tokens.spacing.spacing.sm} ${tokens.spacing.component.inputPadding}`,
        fontSize: tokens.typography.ui.input.fontSize,
        lineHeight: tokens.typography.ui.input.lineHeight,
        ...style,
      }}
      {...props}
    />
  );
}

export { Textarea };
