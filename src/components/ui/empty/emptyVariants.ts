import { cva } from "class-variance-authority";

export const emptyVariants = cva(
  "flex flex-col items-center justify-center text-center px-4 gap-4",
  {
    variants: {
      size: {
        sm: "py-10 gap-3",
        md: "py-16 gap-4",
        lg: "py-24 gap-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const emptyIconVariants = cva("text-muted-foreground/70", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
