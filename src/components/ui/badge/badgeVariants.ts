import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 justify-center rounded-full font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/15 text-destructive",
        // aliases
        danger: "bg-destructive/15 text-destructive",
        gray: "bg-secondary text-secondary-foreground",
        purple: "bg-purple/15 text-purple",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        info: "bg-info/15 text-info",
        outline: "border border-border bg-background text-foreground",
        muted: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "h-5 min-w-5 px-2 text-xs",
        md: "h-6 min-w-6 px-2.5 text-sm",
        lg: "h-7 min-w-7 px-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);
