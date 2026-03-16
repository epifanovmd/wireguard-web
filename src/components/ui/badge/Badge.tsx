import { Badge as MantineBadge, BadgeProps, ElementProps } from "@mantine/core";
import React, { forwardRef } from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "gray";
export type BadgeSize = "sm" | "md";

const COLOR_MAP: Record<BadgeVariant, string> = {
  default: "gray",
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  purple: "violet",
  gray: "gray",
};

const DOT_COLOR_MAP: Record<BadgeVariant, string> = {
  default: "var(--mantine-color-gray-5)",
  success: "var(--mantine-color-green-5)",
  warning: "var(--mantine-color-yellow-5)",
  danger: "var(--mantine-color-red-5)",
  info: "var(--mantine-color-blue-5)",
  purple: "var(--mantine-color-violet-5)",
  gray: "var(--mantine-color-gray-5)",
};

export interface IBadgeProps
  extends BadgeProps,
    ElementProps<"div", keyof BadgeProps> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, IBadgeProps>(
  ({ variant = "default", size = "sm", dot = false, ...props }, ref) => {
    const color = COLOR_MAP[variant];
    const dotEl = !dot ? (
      <span
        className={"w-1 h-1 rounded-sm"}
        style={{
          backgroundColor: DOT_COLOR_MAP[variant],
        }}
      />
    ) : undefined;

    return (
      <MantineBadge
        ref={ref}
        variant="light"
        color={color}
        size={size === "sm" ? "xs" : "sm"}
        leftSection={dotEl}
        {...props}
      />
    );
  },
);
