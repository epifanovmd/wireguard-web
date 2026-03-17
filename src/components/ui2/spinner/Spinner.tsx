import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { spinnerVariants } from "./spinnerVariants";

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <Loader2 className={cn(spinnerVariants({ size, variant }))} />
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);
Spinner.displayName = "Spinner";

export { Spinner };
