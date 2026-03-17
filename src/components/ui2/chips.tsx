import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "./cn";

const chipsVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
        outline:
          "border border-border bg-background text-foreground hover:bg-accent",
      },
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      clickable: false,
    },
  },
);

export interface ChipsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipsVariants> {
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  avatar?: React.ReactNode;
}

const Chips = React.forwardRef<HTMLDivElement, ChipsProps>(
  (
    {
      className,
      variant,
      size,
      onRemove,
      leftIcon,
      avatar,
      children,
      onClick,
      clickable,
      ...props
    },
    ref,
  ) => {
    const isClickable = clickable || !!onClick;

    return (
      <div
        className={cn(
          chipsVariants({ variant, size, clickable: isClickable, className }),
        )}
        ref={ref}
        onClick={onClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...props}
      >
        {avatar && <span className="inline-flex -ml-1">{avatar}</span>}
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
            className="inline-flex hover:opacity-70 transition-opacity -mr-1 ml-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  },
);
Chips.displayName = "Chips";

export { Chips, chipsVariants };
