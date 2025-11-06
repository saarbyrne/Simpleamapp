import { cn } from "./utils";

/**
 * Skeleton Component
 *
 * A placeholder for loading content that uses your globals.css design tokens.
 * All styling is controlled via CSS variables in globals.css.
 */

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
