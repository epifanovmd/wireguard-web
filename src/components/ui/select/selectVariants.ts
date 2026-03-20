import { cva } from "class-variance-authority";

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
  "flex grow items-center whitespace-nowrap gap-2 justify-between rounded-lg border px-3 py-2 transition-all duration-200 focus:outline-none focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10",
        lg: "h-12 text-lg px-4",
      },
      variant: {
        default: "border-border bg-input-background",
        filled: "border-0 bg-muted focus:bg-muted/70",
        "filled-error":
          "border-0 bg-destructive/5 shadow-state-error focus:shadow-focus-error",
        "filled-success":
          "border-0 bg-success/5 shadow-state-success focus:shadow-focus-success",
        error:
          "border-destructive bg-input-background focus:shadow-focus-error",
        success:
          "border-success bg-input-background focus:shadow-focus-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);
