import { cva } from "class-variance-authority";

export const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        underline: "bg-transparent border-b border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer relative",
  {
    variants: {
      variant: {
        default: "data-[state=active]:text-foreground",
        underline: "rounded-none data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
