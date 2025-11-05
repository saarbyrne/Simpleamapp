"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";
import { tokens } from "@/design-system/tokens";

function Calendar({
  className,
  classNames,
  styles: customStyles,
  components: customComponents,
  style,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames: typeof classNames = {
    months: "flex flex-col sm:flex-row",
    month: "flex flex-col",
    caption: "flex justify-center items-center w-full",
    caption_label: "text-center",
    nav: "flex items-center",
    nav_button: cn(
      buttonVariants({ variant: "outline", size: "icon" }),
      "opacity-80 transition-opacity hover:opacity-100",
    ),
    nav_button_previous: "absolute",
    nav_button_next: "absolute",
    table: "w-full border-collapse",
    head_row: "flex",
    head_cell: "text-center",
    row: "flex w-full",
    cell: cn(
      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-md",
      props.mode === "range"
        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        : "[&:has([aria-selected])]:rounded-md",
    ),
    day: cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "font-normal aria-selected:opacity-100",
    ),
    day_range_start: "day-range-start",
    day_range_end: "day-range-end",
    day_selected: "day-selected",
    day_today: "day-today",
    day_outside: "day-outside",
    day_disabled: "day-disabled",
    day_range_middle: "day-range-middle",
    day_hidden: "day-hidden",
    ...classNames,
  };

  const defaultStyles = {
    root: {
      display: "inline-flex",
      padding: tokens.spacing.spacing.md,
      backgroundColor: tokens.colors.surface.base,
      borderRadius: tokens.radius.radius.lg,
      gap: tokens.spacing.gap.lg,
    },
    months: {
      gap: tokens.spacing.gap.lg,
    },
    month: {
      gap: tokens.spacing.gap.md,
    },
    caption: {
      paddingTop: tokens.spacing.spacing.xs,
    },
    caption_label: {
      fontSize: tokens.typography.body.sm.fontSize,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.text.primary,
    },
    nav: {
      gap: tokens.spacing.gap.xs,
    },
    nav_button: {
      position: "relative",
      width: tokens.spacing.spacing.xl,
      height: tokens.spacing.spacing.xl,
      borderRadius: tokens.radius.radius.full,
      backgroundColor: tokens.colors.surface.sunken,
      borderColor: tokens.colors.border.default,
      color: tokens.colors.text.primary,
    },
    nav_button_previous: {
      top: "50%",
      transform: "translateY(-50%)",
      left: tokens.spacing.spacing.sm,
    },
    nav_button_next: {
      top: "50%",
      transform: "translateY(-50%)",
      right: tokens.spacing.spacing.sm,
    },
    table: {
      width: "100%",
    },
    head_row: {
      display: "flex",
      gap: tokens.spacing.gap.xs,
    },
    head_cell: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: tokens.colors.text.secondary,
      borderRadius: tokens.radius.radius.sm,
      fontSize: tokens.typography.body.xs.fontSize,
      lineHeight: tokens.typography.body.xs.lineHeight,
      width: tokens.spacing.spacing.lg,
      height: tokens.spacing.spacing.lg,
      fontWeight: tokens.typography.fontWeight.normal,
    },
    row: {
      display: "flex",
      width: "100%",
      marginTop: tokens.spacing.spacing.sm,
    },
    cell: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: tokens.spacing.spacing['2xl'],
    },
    day: {
      width: tokens.spacing.spacing['2xl'],
      height: tokens.spacing.spacing['2xl'],
      borderRadius: tokens.radius.radius.sm,
      color: tokens.colors.text.primary,
      padding: 0,
    },
    day_selected: {
      backgroundColor: tokens.colors.interactive.primary,
      color: tokens.colors.text.inverse,
    },
    day_range_start: {
      backgroundColor: tokens.colors.interactive.primary,
      color: tokens.colors.text.inverse,
    },
    day_range_end: {
      backgroundColor: tokens.colors.interactive.primary,
      color: tokens.colors.text.inverse,
    },
    day_range_middle: {
      backgroundColor: tokens.colors.surface.overlayLight,
      color: tokens.colors.text.primary,
    },
    day_today: {
      backgroundColor: tokens.colors.surface.sunken,
      color: tokens.colors.text.primary,
    },
    day_outside: {
      color: tokens.colors.text.placeholder,
    },
    day_disabled: {
      color: tokens.colors.text.disabled,
      opacity: 0.6,
    },
    ...customStyles,
  } satisfies NonNullable<React.ComponentProps<typeof DayPicker>["styles"]>;

  const components = {
    IconLeft: ({ className, ...props }) => (
      <ChevronLeft
        className={cn("size-4", className)}
        style={{ color: tokens.colors.text.secondary }}
        {...props}
      />
    ),
    IconRight: ({ className, ...props }) => (
      <ChevronRight
        className={cn("size-4", className)}
        style={{ color: tokens.colors.text.secondary }}
        {...props}
      />
    ),
    ...customComponents,
  } satisfies React.ComponentProps<typeof DayPicker>["components"];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      style={{
        ...defaultStyles.root,
        ...style,
      }}
      classNames={defaultClassNames}
      styles={defaultStyles}
      components={components}
      {...props}
    />
  );
}

export { Calendar };
