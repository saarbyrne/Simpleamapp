"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function InputOTP({
  className,
  style,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      style={{
        gap: tokens.spacing.gap.sm,
        ...style,
      }}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      style={{
        gap: tokens.spacing.gap.xs,
        ...style,
      }}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive relative flex items-center justify-center border-y border-r transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className,
      )}
      style={{
        backgroundColor: tokens.colors.surface.sunken,
        borderColor: tokens.colors.border.default,
        height: tokens.spacing.spacing.xl,
        width: tokens.spacing.spacing.xl,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        ...style,
      }}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="animate-caret-blink w-px duration-1000"
            style={{
              backgroundColor: tokens.colors.text.primary,
              height: tokens.spacing.spacing.lg,
            }}
          />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" style={style} {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
