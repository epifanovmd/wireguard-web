import cn from "classnames";
import React, { FC, ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        "sticky top-0 px-6 py-4 border-b border-[var(--border)] bg-[var(--card)]",
        className,
      )}
    >
      {/* accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#6366f1] rounded-r" />

      <div className="flex items-center justify-between gap-4 ml-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)] leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
};
