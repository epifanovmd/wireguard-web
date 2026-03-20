import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { checkboxVariants } from "./checkboxVariants";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean;
  label?: React.ReactNode;
  description?: string;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, variant, indeterminate, label, description, id, ...props }, ref) => {
  const checkboxId = id ?? (label ? `checkbox-${Math.random().toString(36).slice(2)}` : undefined);

  const checkboxEl = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(checkboxVariants({ size, variant, className }))}
      {...props}
      checked={indeterminate ? "indeterminate" : props.checked}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {indeterminate ? (
          <Minus
            className={cn(
              size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
            )}
          />
        ) : (
          <Check
            className={cn(
              size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
            )}
          />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label || description) {
    return (
      <div className="flex items-start gap-2.5 cursor-pointer">
        <div className="mt-0.5">{checkboxEl}</div>
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-foreground leading-snug cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
          )}
        </div>
      </div>
    );
  }

  return checkboxEl;
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
