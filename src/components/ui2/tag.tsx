import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "./cn";

const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        info: "bg-info text-info-foreground",
        outline: "border border-border bg-background text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  (
    { className, variant, size, onRemove, leftIcon, children, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(tagVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex hover:opacity-70 transition-opacity cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  },
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
