import { Input } from "@mantine/core";
import React, { FC, memo, PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";

export interface FieldWrapperProps {
  error?: FieldError | string;
  caption?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const FieldWrapper: FC<PropsWithChildren<FieldWrapperProps>> = memo(
  ({ error, caption, label, required, children, className }) => {
    const errorMessage = typeof error === "string" ? error : error?.message;
    const helpText = errorMessage ?? caption;

    return (
      <Input.Wrapper
        label={label}
        error={errorMessage}
        description={!errorMessage ? helpText : undefined}
        required={required}
        className={className}
      >
        {children}
      </Input.Wrapper>
    );
  },
);
