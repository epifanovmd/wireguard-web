import * as React from "react";

import { cn } from "../../cn";

export const SelectEmpty = ({
  className,
  children = "No options available",
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex items-center justify-center px-2 py-6 text-sm text-muted-foreground",
      className,
    )}
  >
    {children}
  </div>
);
SelectEmpty.displayName = "SelectEmpty";
