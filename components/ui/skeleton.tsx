import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse", className)}
      style={{
        backgroundColor: tokens.colors.surface.sunken,
        borderRadius: tokens.radius.radius.sm,
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };
