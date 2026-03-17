import { cva } from "class-variance-authority";

export const segmentedVariants = cva(
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

export const segmentedItemVariants = cva(
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

export const segmentedIndicatorVariants = cva(
  "absolute rounded-md shadow-sm",
  {
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
  },
);
