import {
  Button as MantineButton,
  ButtonProps,
  ElementProps,
} from "@mantine/core";
import React, { forwardRef } from "react";

export type ButtonVariant = ButtonProps["variant"];

export interface IButtonProps
  extends ButtonProps,
    ElementProps<"button", keyof ButtonProps> {}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ variant = "primary", size = "sm", ...props }, ref) => {
    return <MantineButton ref={ref} size={size} {...props} />;
  },
);
