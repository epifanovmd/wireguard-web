import { cva, type VariantProps } from "class-variance-authority";

import {
  FIELD_BASE,
  FIELD_SIZE_VARIANTS,
  FIELD_VARIANT_MAP,
} from "../fieldVariants";

export const datePickerTriggerVariants = cva(
  `${FIELD_BASE} items-center gap-2 cursor-pointer`,
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

export type DatePickerTriggerVariantProps = VariantProps<
  typeof datePickerTriggerVariants
>;
