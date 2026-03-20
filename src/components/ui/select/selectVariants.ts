import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(
  "flex grow items-center whitespace-nowrap gap-2 justify-between rounded-lg border px-3 py-2 transition-all duration-200 focus:outline-none focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10",
        lg: "h-12 text-lg px-4",
      },
      variant: {
        default: "border-border bg-input-background",
        filled: "border-0 bg-muted focus:bg-muted/70",
        "filled-error":
          "border-0 bg-destructive/5 shadow-state-error focus:shadow-focus-error",
        "filled-success":
          "border-0 bg-success/5 shadow-state-success focus:shadow-focus-success",
        error:
          "border-destructive bg-input-background focus:shadow-focus-error",
        success:
          "border-success bg-input-background focus:shadow-focus-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);
