import { cva } from "class-variance-authority";

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        enable:
          "text-muted-foreground hover:bg-success/10 hover:text-success",
        disable:
          "text-muted-foreground hover:bg-warning/10 hover:text-warning",
        destructive:
          "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
        primary: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        ghost: "text-muted-foreground hover:text-foreground",
        solid:
          "rounded-full bg-primary text-primary-foreground hover:bg-primary/85 shadow-sm hover:shadow-md",
      },
      size: {
        sm: "h-7 w-7 p-1",
        md: "h-9 w-9 p-1.5",
        lg: "h-11 w-11 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
