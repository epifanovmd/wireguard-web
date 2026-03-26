import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { tagVariants } from "./tagVariants";

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

export { Tag };
