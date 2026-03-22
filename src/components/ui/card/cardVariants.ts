import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-md hover:shadow-lg",
        outline: "border-2",
      },
      padding: {
        none: "",
        sm: "p-2 sm:p-4",
        md: "p-3 sm:p-6",
        lg: "p-4 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
    },
  },
);
