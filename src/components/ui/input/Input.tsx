import { PasswordInput, TextInput } from "@mantine/core";
import React, { forwardRef } from "react";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  error?: string;
  hint?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** className applied to the root wrapper */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = "sm",
      leftIcon,
      rightIcon,
      wrapperClassName,
      className,
      type = "text",
      required,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    if (type === "password") {
      return (
        <PasswordInput
          ref={ref as any}
          label={label}
          error={error}
          description={!error ? hint : undefined}
          size={size}
          leftSection={leftIcon}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          classNames={{ root: wrapperClassName, input: className }}
          {...(props as any)}
        />
      );
    }

    return (
      <TextInput
        ref={ref as any}
        label={label}
        error={error}
        description={!error ? hint : undefined}
        size={size}
        type={type}
        leftSection={leftIcon}
        rightSection={rightIcon}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        classNames={{ root: wrapperClassName, input: className }}
        {...(props as any)}
      />
    );
  },
);

Input.displayName = "Input";
