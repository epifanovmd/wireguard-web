import { cva } from "class-variance-authority";

export const collapseTriggerVariants = cva(
  [
    "cursor-pointer",
    "flex w-full items-center gap-2 text-left transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-1.5 rounded-md",
        default: "text-foreground hover:bg-accent px-3 py-2.5 rounded-lg",
        filled:
          "bg-muted hover:bg-muted/70 text-foreground px-3 py-2.5 rounded-lg",
        bordered:
          "border border-border hover:border-border/80 hover:bg-accent text-foreground px-3 py-2.5 rounded-lg",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

export const collapseContentVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      ghost: "",
      default: "",
      filled: "bg-muted/30 rounded-b-lg",
      bordered: "border-x border-b border-border rounded-b-lg",
    },
  },
  defaultVariants: {
    variant: "ghost",
  },
});
