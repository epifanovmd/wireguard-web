import { cva } from "class-variance-authority";

export const popoverContentVariants = cva(
  [
    "z-50 rounded-lg border outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground border shadow-md",
        dark: "bg-gray-900 text-gray-50 border-gray-700 shadow-lg",
        info: "bg-blue-50 text-blue-900 border-blue-200 shadow-md dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
      },
      size: {
        sm: "w-48 p-2 text-xs",
        md: "w-72 p-4 text-sm",
        lg: "w-96 p-5 text-sm",
        auto: "p-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
