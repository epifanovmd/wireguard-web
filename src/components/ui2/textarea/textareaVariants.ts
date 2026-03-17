import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "flex w-full rounded-lg px-3 py-2 transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 resize-vertical min-h-[80px]",
  {
    variants: {
      size: {
        sm: "text-sm px-2",
        md: "text-sm",
        lg: "text-base px-4",
      },
      variant: {
        default: "border border-border bg-input-background",
        filled: "border-0 bg-muted focus-visible:bg-muted/70",
        "filled-error":
          "border-0 bg-destructive/5 shadow-state-error focus-visible:shadow-focus-error",
        "filled-success":
          "border-0 bg-success/5 shadow-state-success focus-visible:shadow-focus-success",
        error:
          "border border-destructive bg-input-background focus-visible:shadow-focus-error",
        success:
          "border border-success bg-input-background focus-visible:shadow-focus-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);
