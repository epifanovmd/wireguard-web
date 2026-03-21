import { cva, type VariantProps } from "class-variance-authority";

// Shared variant + size for field-like inputs: Input, Textarea, Select, DatePicker
export const fieldVariants = cva(
  "rounded-lg px-3 transition-all duration-200 focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10 text-sm",
        lg: "h-12 text-base px-4",
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

export type FieldVariantProps = VariantProps<typeof fieldVariants>;
