import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import { badgeVariants } from "./badgeVariants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
        )}
        <span className="truncate min-w-0">{children}</span>
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
