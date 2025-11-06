import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "./utils";

const iconSizes = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-12",
};

const iconColors = {
  inherit: "text-current",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-green-600",
  error: "text-destructive",
  warning: "text-yellow-600",
  info: "text-blue-600",
  disabled: "text-muted-foreground opacity-50",
};

const strokeWeights = {
  thin: "1",
  regular: "1.5",
  medium: "2",
  bold: "2.5",
};

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  icon: LucideIcon;
  size?: keyof typeof iconSizes;
  color?: keyof typeof iconColors;
  strokeWidth?: keyof typeof strokeWeights;
  label?: string;
  decorative?: boolean;
}

const Icon = React.forwardRef<HTMLElement, IconProps>(
  (
    {
      icon: LucideIconComponent,
      size = "md",
      color = "inherit",
      strokeWidth = "regular",
      label,
      decorative = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <LucideIconComponent
        ref={ref as any}
        className={cn(iconSizes[size], iconColors[color], className)}
        strokeWidth={strokeWeights[strokeWidth]}
        aria-label={decorative ? undefined : label}
        aria-hidden={decorative}
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";

// Alias exports for backwards compatibility with stories
const IconButton = Icon;
const IconInline = Icon;
const IconNav = Icon;
const IconEmptyState = Icon;

export { Icon, IconButton, IconInline, IconNav, IconEmptyState };
