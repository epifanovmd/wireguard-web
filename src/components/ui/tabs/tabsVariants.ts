import { cva } from "class-variance-authority";

export const tabsMotionVariants = cva("absolute z-0", {
  variants: {
    variant: {
      default: "inset-0 bg-background shadow-sm rounded-md",
      underline:
        "-inset-1 border-b-2 border-primary top-auto h-0.5 rounded-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        underline: "rounded-none bg-transparent border-b border-border",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer relative",
  {
    variants: {
      variant: {
        default: "data-[state=active]:text-foreground",
        underline: "rounded-none data-[state=active]:text-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
