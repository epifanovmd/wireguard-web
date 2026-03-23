import * as React from "react";

import { cn } from "../cn";

export type StatCardColor =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

const COLOR_CLASSES: Record<StatCardColor, { icon: string; text: string }> = {
  default: {
    icon: "bg-secondary text-secondary-foreground",
    text: "text-foreground",
  },
  success: { icon: "bg-success/15 text-success", text: "text-success" },
  warning: { icon: "bg-warning/15 text-warning", text: "text-warning" },
  danger: {
    icon: "bg-destructive/15 text-destructive",
    text: "text-destructive",
  },
  info: { icon: "bg-info/15 text-info", text: "text-info" },
  purple: {
    icon: "bg-purple/15 text-purple",
    text: "text-purple",
  },
};

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  color?: StatCardColor;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className,
  color = "default",
}) => {
  const colors = COLOR_CLASSES[color];

  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-3 sm:p-5 flex items-start justify-between gap-3",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div className="sm:text-xl font-bold text-foreground truncate">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {icon && (
        <div
          className={cn(
            "w-8 h-8 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0",
            colors.icon,
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
};
