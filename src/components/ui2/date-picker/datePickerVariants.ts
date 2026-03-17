import { cva } from "class-variance-authority";

export const datePickerTriggerVariants = cva(
  [
    "flex w-full items-center gap-2 rounded-lg px-3",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10 text-sm",
        lg: "h-12 text-base px-4",
      },
      variant: {
        default: "border border-border bg-input-background",
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
