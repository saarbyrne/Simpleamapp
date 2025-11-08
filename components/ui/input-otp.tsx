"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "./utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>((props, ref) => {
  const {
    className,
    containerClassName,
    ["data-slot"]: dataSlot = "input-otp",
    ...rest
  } = props;

  return (
    <OTPInput
      ref={ref}
      data-slot={dataSlot}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...rest}
    />
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  const {
    ["data-input-otp-slot"]: dataInputOtpSlot = "input-otp-slot",
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      data-input-otp-slot={dataInputOtpSlot}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...rest}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => {
  const {
    ["data-input-otp-separator"]: dataInputOtpSeparator = "input-otp-separator",
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      role="separator"
      data-input-otp-separator={dataInputOtpSeparator}
      {...rest}
    >
      <Dot />
    </div>
  );
});
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
