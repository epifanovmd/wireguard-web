import * as React from "react";

import { cn } from "../cn";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  extra?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, extra, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between gap-4 px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col space-y-1">{children}</div>
      {extra && <div className="flex shrink-0 items-center gap-2">{extra}</div>}
    </div>
  ),
);
CardHeader.displayName = "CardHeader";

export { CardHeader };
