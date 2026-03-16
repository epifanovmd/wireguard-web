import {
  ElementProps,
  Textarea as MantineTextarea,
  TextareaProps,
} from "@mantine/core";
import React, { forwardRef } from "react";

export interface ITextareaProps
  extends TextareaProps,
    ElementProps<"textarea", keyof TextareaProps> {}

export const Textarea = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ size = "sm", autosize = false, ...props }, ref) => {
    return (
      <MantineTextarea ref={ref} size={size} autosize={autosize} {...props} />
    );
  },
);
