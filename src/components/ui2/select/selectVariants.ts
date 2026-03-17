import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg border border-border bg-input-background px-3 py-2 transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10",
        lg: "h-12 text-lg px-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
