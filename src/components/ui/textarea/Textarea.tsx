import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import { textareaVariants } from "./textareaVariants";
import { useTextarea } from "./useTextarea";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Grow with content automatically. Default: true. */
  autoResize?: boolean;
  /** Maximum rows before scroll appears (only with autoResize). Default: 6. */
  maxRows?: number;
  /** Show character counter below. Requires maxLength to show "n / max". */
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      variant,
      autoResize = true,
      rows = 3,
      maxRows = 6,
      maxLength,
      showCount = false,
      value,
      defaultValue,
      onChange,
      onInput,
      ...props
    },
    ref,
  ) => {
    const { setRef, charCount, counterClass, handleChange, handleInput } =
      useTextarea({
        ref,
        value,
        defaultValue,
        autoResize,
        maxRows,
        maxLength,
        showCount,
        onChange,
        onInput,
      });

    const textarea = (
      <textarea
        ref={setRef}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          textareaVariants({ size, variant }),
          autoResize ? "resize-none overflow-hidden" : "resize-vertical",
          className,
        )}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onInput={handleInput}
        {...props}
      />
    );

    if (!showCount) return textarea;

    return (
      <div className="flex flex-col gap-1 grow">
        {textarea}
        <p className={cn("text-xs text-right tabular-nums", counterClass)}>
          {maxLength !== undefined ? `${charCount} / ${maxLength}` : charCount}
        </p>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
