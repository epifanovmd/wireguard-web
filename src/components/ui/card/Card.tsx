import { ElementProps, Paper, PaperProps } from "@mantine/core";
import React, { forwardRef } from "react";

import { cn } from "../cn";

export type CardPadding = "none" | "sm" | "md" | "lg";

const BODY_PADDING: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export interface CardProps
  extends PaperProps,
    ElementProps<"div", keyof PaperProps | "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  padding?: CardPadding;
  bordered?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      subtitle,
      extra,
      padding = "md",
      bordered = true,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const hasHeader = Boolean(title || extra);

    return (
      <Paper
        ref={ref}
        withBorder={bordered}
        radius="md"
        style={style}
        shadow="xs"
        {...(props as any)}
      >
        {hasHeader && (
          <div
            className={cn(
              "flex items-center justify-between px-5 py-3",
              bordered && "border-b border-[var(--border-color)]",
            )}
          >
            <div className="min-w-0 flex-1">
              {title && (
                <p className="m-0 font-semibold text-sm text-[var(--text-primary)] leading-snug">
                  {title}
                </p>
              )}
              {subtitle && (
                <p className="m-0 mt-0.5 text-xs text-[var(--text-muted)] leading-snug">
                  {subtitle}
                </p>
              )}
            </div>
            {extra && <div className="flex-shrink-0 ml-3">{extra}</div>}
          </div>
        )}
        <div className={BODY_PADDING[padding]}>{children}</div>
      </Paper>
    );
  },
);
