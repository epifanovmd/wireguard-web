import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full rounded-lg px-3 py-2 transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10",
        lg: "h-12 text-lg px-4",
      },
      variant: {
        default: "border border-border bg-input-background",
        filled: "border-0 bg-muted",
        error:
          "border border-destructive bg-input-background focus-visible:ring-destructive",
        success:
          "border border-success bg-input-background focus-visible:ring-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);
