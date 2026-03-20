import * as SelectPrimitive from "@radix-ui/react-select";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../cn";
import { selectTriggerVariants } from "../selectVariants";
import { SelectTriggerIcon } from "./SelectTriggerIcon";

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  loading?: boolean;
  /** Current selected value — controls visibility of the clear button */
  value?: string;
  clearable?: boolean;
  onClear?: () => void;
  placeholder?: string;
}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      size,
      variant,
      loading,
      value,
      clearable,
      onClear,
      placeholder: _placeholder,
      ...props
    },
    ref,
  ) => {
    const showClear = clearable && !!value && !loading;

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(selectTriggerVariants({ size, variant }), className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {children}
        <SelectTriggerIcon
          loading={loading}
          showClear={showClear}
          onClear={onClear}
        />
      </SelectPrimitive.Trigger>
    );
  },
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
