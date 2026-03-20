import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import { Field } from "../form/Field";
import { textareaVariants } from "./textareaVariants";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: React.ReactNode;
  error?: string;
  hint?: string;
  description?: string;
  wrapperClassName?: string;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      description,
      wrapperClassName,
      className,
      size,
      variant,
      required,
      ...props
    },
    ref,
  ) => {
    const textarea = (
      <textarea
        ref={ref}
        className={cn(
          textareaVariants({ size, variant: error ? "error" : variant }),
          className,
        )}
        required={required}
        {...props}
      />
    );

    if (label || error || hint || description) {
      return (
        <Field
          label={label}
          error={error}
          hint={hint}
          description={description}
          required={required}
          className={wrapperClassName}
        >
          {textarea}
        </Field>
      );
    }

    return textarea;
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
