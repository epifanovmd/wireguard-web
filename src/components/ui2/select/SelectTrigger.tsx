import * as SelectPrimitive from "@radix-ui/react-select";
import { type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { Spinner } from "../spinner";
import { selectTriggerVariants } from "./selectVariants";

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  loading?: boolean;
}

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, size, loading, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ size, className }))}
    disabled={loading || props.disabled}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      {loading ? (
        <Spinner size="sm" className="h-4 w-4 opacity-50" />
      ) : (
        <ChevronDown className="h-4 w-4 opacity-50" />
      )}
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
