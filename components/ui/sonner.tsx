"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { tokens } from "@/design-system/tokens";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": tokens.colors.surface.elevated,
          "--normal-text": tokens.colors.text.primary,
          "--normal-border": tokens.colors.border.default,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
