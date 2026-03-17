import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg border px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10",
        lg: "h-12 text-lg px-4",
      },
      variant: {
        default: "border-border bg-input-background focus:ring-ring",
        error:
          "border-destructive bg-input-background focus:ring-destructive",
        success:
          "border-success bg-input-background focus:ring-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);
