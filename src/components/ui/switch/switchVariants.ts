import { cva } from "class-variance-authority";

export const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:shadow-focus-offset",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
      variant: {
        default: "",
        error: "shadow-ring-error focus-visible:shadow-focus-error-offset",
        success: "shadow-ring-success focus-visible:shadow-focus-success-offset",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        md: "h-5 w-5 data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
