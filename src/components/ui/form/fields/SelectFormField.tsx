import * as React from "react";
import {
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Select, type SelectHandle, type SelectProps } from "../../select";
import { FormField } from "../FormField";
import type { FieldProps } from "../types";

type FieldOwnProps = Omit<FieldProps, "children" | "error" | "htmlFor">;

type MappedProps = "ref" | "value" | "clearable" | "onChange" | "onOpenChange" | "variant";

export function SelectFormField<
  TFormData extends FieldValues = FieldValues,
  TData = unknown,
  V extends string = string,
>({
  name,
  control,
  label,
  hint,
  description,
  required,
  fieldClassName,
  ...selectProps
}: {
  name: Path<TFormData>;
  control?: Control<TFormData>;
} & FieldOwnProps &
  Omit<SelectProps<TData, V>, MappedProps>): React.ReactElement {
  return (
    <FormField<TFormData>
      name={name}
      control={control}
      label={label}
      hint={hint}
      description={description}
      required={required}
      fieldClassName={fieldClassName}
      render={(field, fieldState) => (
        <Select<TData, V>
          {...({
            ...selectProps,
            ref: field.ref as React.Ref<SelectHandle>,
            value: (field.value as V | null | undefined) ?? null,
            clearable: true,
            onChange: (v: V | null) => field.onChange(v ?? undefined),
            onOpenChange: (open: boolean) => {
              if (!open) field.onBlur();
            },
            variant: fieldState.invalid ? "error" : undefined,
          } as SelectProps<TData, V> & { ref?: React.Ref<SelectHandle> })}
        />
      )}
    />
  );
}

SelectFormField.displayName = "SelectFormField";
