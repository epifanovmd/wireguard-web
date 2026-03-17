import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "./cn";

const segmentedVariants = cva(
  "inline-flex items-center gap-1 rounded-lg p-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        outline: "border border-border bg-transparent",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const segmentedItemVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer z-10 flex-1",
  {
    variants: {
      size: {
        sm: "h-6 px-2.5 text-xs min-w-[60px]",
        md: "h-8 px-3 text-sm min-w-[80px]",
        lg: "h-10 px-4 text-base min-w-[100px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const segmentedIndicatorVariants = cva("absolute rounded-md shadow-sm", {
  variants: {
    variant: {
      default: "bg-background",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "bg-background border border-border",
    },
    size: {
      sm: "h-6",
      md: "h-8",
      lg: "h-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedVariants> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  block?: boolean;
}

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      className,
      variant,
      size,
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      block,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(
      controlledValue || defaultValue || options[0]?.value,
    );

    const layoutId = React.useId();

    const value =
      controlledValue !== undefined ? controlledValue : selectedValue;

    const handleSelect = (optionValue: string, disabled?: boolean) => {
      if (disabled) return;

      if (controlledValue === undefined) {
        setSelectedValue(optionValue);
      }
      onChange?.(optionValue);
    };

    return (
      <div
        ref={ref}
        className={cn(
          segmentedVariants({ variant, size }),
          block && "flex w-full",
          className,
        )}
        {...props}
      >
        {/* Options */}
        {options.map(option => {
          const isSelected = value === option.value;
          const isDisabled = option.disabled;

          return (
            <button
              key={option.value}
              className={cn(
                segmentedItemVariants({ size }),
                isSelected
                  ? variant === "primary"
                    ? "text-primary-foreground"
                    : variant === "secondary"
                      ? "text-secondary-foreground"
                      : "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                isDisabled && "opacity-50 cursor-not-allowed",
                block && "flex-1",
              )}
              onClick={() => handleSelect(option.value, option.disabled)}
              disabled={isDisabled}
              type="button"
            >
              {isSelected && (
                <motion.div
                  layoutId={`${layoutId}-indicator`}
                  className={cn(
                    "absolute inset-0 z-0",
                    segmentedIndicatorVariants({ variant, size }),
                  )}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                />
              )}
              <span className="relative z-10 inline-flex items-center">
                {option.icon && (
                  <span className="mr-1.5 inline-flex items-center">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

Segmented.displayName = "Segmented";

export { Segmented, segmentedVariants };
