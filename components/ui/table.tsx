"use client";

import * as React from "react";

import { cn } from "./utils";
import { tokens } from "@/design-system/tokens";

function Table({ className, style, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom", className)}
        style={{
          fontSize: tokens.typography.body.sm.fontSize,
          lineHeight: tokens.typography.body.sm.lineHeight,
          ...style,
        }}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, style, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      style={style}
      {...props}
    />
  );
}

function TableBody({ className, style, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      style={style}
      {...props}
    />
  );
}

function TableFooter({ className, style, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t [&>tr]:last:border-b-0",
        className,
      )}
      style={{
        backgroundColor: `${tokens.colors.surface.sunken}80`, // 50% opacity
        fontWeight: tokens.typography.fontWeight.medium,
        ...style,
      }}
      {...props}
    />
  );
}

function TableRow({ className, style, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      style={{
        borderColor: tokens.colors.border.default,
        ...style,
      }}
      {...props}
    />
  );
}

function TableHead({ className, style, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      style={{
        color: tokens.colors.text.primary,
        height: tokens.spacing.spacing['2xl'],
        paddingLeft: tokens.spacing.spacing.sm,
        paddingRight: tokens.spacing.spacing.sm,
        fontWeight: tokens.typography.fontWeight.medium,
        ...style,
      }}
      {...props}
    />
  );
}

function TableCell({ className, style, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      style={{
        padding: tokens.spacing.spacing.sm,
        ...style,
      }}
      {...props}
    />
  );
}

function TableCaption({
  className,
  style,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(className)}
      style={{
        color: tokens.colors.text.secondary,
        marginTop: tokens.spacing.spacing.xl,
        fontSize: tokens.typography.body.sm.fontSize,
        lineHeight: tokens.typography.body.sm.lineHeight,
        ...style,
      }}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
