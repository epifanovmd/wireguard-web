import { cva } from "class-variance-authority";

export const paginationVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
