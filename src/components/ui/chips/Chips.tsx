import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { chipsVariants } from "./chipsVariants";

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

export { Chips };
