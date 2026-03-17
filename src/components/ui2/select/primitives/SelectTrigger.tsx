import * as SelectPrimitive from "@radix-ui/react-select";
import { type VariantProps } from "class-variance-authority";
import { ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "../../cn";
import { Spinner } from "../../spinner";
import { selectTriggerVariants } from "../selectVariants";

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  loading?: boolean;
  /** Current selected value — controls visibility of the clear button */
  value?: string;
  clearable?: boolean;
  onClear?: () => void;
}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, size, variant, loading, value, clearable, onClear, ...props }, ref) => {
  const showClear = clearable && !!value && !loading;

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ size, variant }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        {loading ? (
          <Spinner size="sm" className="h-4 w-4 opacity-50 shrink-0" />
        ) : showClear ? (
          <span
            role="button"
            tabIndex={-1}
            onPointerDown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={e => {
              e.stopPropagation();
              onClear?.();
            }}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </span>
        ) : (
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        )}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
