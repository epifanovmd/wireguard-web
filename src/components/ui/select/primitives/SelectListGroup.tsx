import * as React from "react";

import { cn } from "../../cn";

export interface SelectListGroupProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export const SelectListGroup = ({
  label,
  className,
  children,
}: SelectListGroupProps) => (
  <div role="group" className={cn("py-1", className)}>
    <div
      className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
      role="presentation"
    >
      {label}
    </div>
    {children}
  </div>
);

SelectListGroup.displayName = "SelectListGroup";
