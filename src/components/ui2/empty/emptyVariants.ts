import { cva } from "class-variance-authority";

export const emptyVariants = cva(
  "flex flex-col items-center justify-center text-center py-12 px-4",
  {
    variants: {
      size: {
        sm: "py-8 gap-2",
        md: "py-12 gap-3",
        lg: "py-16 gap-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const emptyIconVariants = cva("text-muted-foreground/50", {
  variants: {
    size: {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-24 w-24",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
