import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../cn";
import { selectTriggerVariants } from "../selectVariants";
import { SelectTriggerIcon } from "./SelectTriggerIcon";

export interface SelectTriggerBaseProps
  extends VariantProps<typeof selectTriggerVariants>,
    Omit<React.HTMLAttributes<HTMLDivElement>, "size"> {
  loading?: boolean;
  showClear?: boolean;
  onClear?: () => void;
  cursorText?: boolean;
}

export const SelectTriggerBase = React.forwardRef<
  HTMLDivElement,
  SelectTriggerBaseProps
>(
  (
    {
      className,
      size,
      variant,
      loading,
      showClear,
      onClear,
      cursorText,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        selectTriggerVariants({ size, variant }),
        cursorText ? "cursor-text" : "cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
      <SelectTriggerIcon loading={loading} showClear={showClear} onClear={onClear} />
    </div>
  ),
);

SelectTriggerBase.displayName = "SelectTriggerBase";
