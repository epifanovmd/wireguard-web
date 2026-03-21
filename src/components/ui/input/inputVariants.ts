import { cva, type VariantProps } from "class-variance-authority";

import {
  FIELD_BASE,
  FIELD_SIZE_VARIANTS,
  FIELD_VARIANT_MAP,
} from "../fieldVariants";

export const inputVariants = cva(
  `${FIELD_BASE} py-2 placeholder:text-muted-foreground`,
  {
    variants: {
      size: FIELD_SIZE_VARIANTS,
      variant: FIELD_VARIANT_MAP,
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export type InputVariantProps = VariantProps<typeof inputVariants>;
