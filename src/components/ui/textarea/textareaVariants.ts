import { cva, type VariantProps } from "class-variance-authority";

import { FIELD_BASE, FIELD_VARIANT_MAP } from "../fieldVariants";

export const textareaVariants = cva(
  `${FIELD_BASE} py-2 placeholder:text-muted-foreground`,
  {
    variants: {
      size: {
        sm: "text-sm px-2",
        md: "text-sm",
        lg: "text-base px-4",
      },
      variant: FIELD_VARIANT_MAP,
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
