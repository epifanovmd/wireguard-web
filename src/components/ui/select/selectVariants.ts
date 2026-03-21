import { cva, type VariantProps } from "class-variance-authority";

import {
  FIELD_BASE,
  FIELD_SIZE_VARIANTS,
  FIELD_VARIANT_MAP,
} from "../fieldVariants";

// ─── Shared dropdown content classes ──────────────────────────────────────────
// Used by both SelectContent (Radix Select) and SearchSelect (Radix Popover)
// so they stay visually identical.
export const selectContentClasses = [
  "z-50 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
].join(" ");

// ─── Shared option item classes ────────────────────────────────────────────────
// Used by SelectItem (Radix Select) and SearchSelect option divs.
export const selectItemClasses = [
  "relative flex w-full cursor-pointer select-none items-center rounded-md",
  "py-1.5 pl-8 pr-2 text-sm outline-none transition-colors duration-150",
].join(" ");

export const selectItemHighlightedClasses = "bg-accent text-accent-foreground";

export const selectTriggerVariants = cva(
  `${FIELD_BASE} items-center whitespace-nowrap gap-2 justify-between py-2`,
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

export type SelectTriggerVariantProps = VariantProps<typeof selectTriggerVariants>;
