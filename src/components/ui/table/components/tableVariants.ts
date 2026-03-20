import { cva } from "class-variance-authority";

export const tableVariants = cva("w-full caption-bottom", {
  variants: {
    variant: {
      default: "",
      striped: "[&_tbody_tr:nth-child(even)]:bg-muted/40",
      bordered: "border [&_th]:border-x [&_td]:border-x",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tableHeadVariants = cva(
  "text-left align-middle font-medium text-muted-foreground select-none [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:px-3",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-14 px-5 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const tableCellVariants = cva(
  "align-middle [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:px-3",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-3 text-sm",
        lg: "px-5 py-4 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
