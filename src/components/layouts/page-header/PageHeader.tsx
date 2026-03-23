import { FC, ReactNode } from "react";

import { cn } from "../../ui";

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
        "relative px-3 py-2 sm:px-6 sm:py-4 border-b border-border bg-card min-h-[45px]",
        className,
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:bg-brand rounded-r" />

      <div className="flex items-center justify-between gap-4 ml-3">
        <div className={"flex flex-col min-w-0"}>
          <p className="text-xl font-bold text-foreground leading-tight tracking-tight truncate">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
};
