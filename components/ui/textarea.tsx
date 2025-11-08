import * as React from "react";
import { cn } from "./utils";
import { formFieldStyles } from "./form-field-styles";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(formFieldStyles, "min-h-[80px]", className)}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
