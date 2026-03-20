import * as React from "react";
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

// ─── Field (pure UI wrapper) ──────────────────────────────────────────────────

export interface FieldProps {
  /** Label displayed above the field. */
  label?: React.ReactNode;
  /** Tooltip shown on hover of the info icon beside the label. */
  hint?: React.ReactNode;
  /** Helper text displayed below the field (hidden when error is present). */
  description?: React.ReactNode;
  /** Error message. When provided, replaces description. */
  error?: string;
  /** Renders a red asterisk after the label. */
  required?: boolean;
  /** Passed to the <label> htmlFor attribute to link it with the input id. */
  htmlFor?: string;
  /** Class applied to the outer wrapper `<div>`. */
  fieldClassName?: string;
  children?: React.ReactNode;
}

// ─── FormField (react-hook-form Controller wrapper) ───────────────────────────

export interface FormFieldBaseProps<TFormData extends FieldValues = FieldValues> {
  name: Path<TFormData>;
  control: Control<TFormData>;
}

// ─── Factory types ────────────────────────────────────────────────────────────

export type ControllerMapper<TComponentProps extends object> = (
  field: ControllerRenderProps<FieldValues, string>,
  fieldState: ControllerFieldState,
) => Partial<TComponentProps>;

/** Props of a component returned by createFormField. */
export type CreatedFormFieldProps<
  TFormData extends FieldValues,
  TComponentProps extends object,
  TMappedProps extends Partial<TComponentProps>,
> = FormFieldBaseProps<TFormData> &
  Omit<FieldProps, "children" | "error" | "htmlFor"> &
  Omit<TComponentProps, keyof TMappedProps>;
