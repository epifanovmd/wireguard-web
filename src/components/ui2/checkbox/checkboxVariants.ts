import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  [
    "peer shrink-0 rounded border border-border bg-background",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:shadow-focus-offset",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
    "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary",
    "cursor-pointer",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
      variant: {
        default: "",
        error: "border-destructive focus-visible:shadow-focus-error-offset",
        success: "border-success focus-visible:shadow-focus-success-offset",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);
