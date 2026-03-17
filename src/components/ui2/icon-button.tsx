import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        enable:
          "text-muted-foreground hover:bg-[rgba(34,197,94,0.1)] hover:text-[#16a34a] dark:hover:text-[#22c55e]",
        disable:
          "text-muted-foreground hover:bg-[rgba(234,179,8,0.1)] hover:text-[#ca8a04] dark:hover:text-[#eab308]",
        destructive:
          "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
        primary: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        ghost: "text-muted-foreground hover:text-foreground",
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

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
