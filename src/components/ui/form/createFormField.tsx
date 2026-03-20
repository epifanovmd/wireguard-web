import * as React from "react";
import {
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { FormField } from "./FormField";
import type { FieldProps } from "./types";

type FieldOwnProps = Omit<FieldProps, "children" | "error" | "htmlFor">;

// Cast to allow `ref` in props — forwardRef components need this at the JSX level.
type ComponentWithRef<P> = React.ComponentType<
  P & { ref?: React.Ref<unknown> }
>;

/**
 * Factory that wraps any UI component into a fully-typed FormField.
 *
 * `TComponentProps` is inferred automatically from the component argument —
 * no explicit type parameter needed at the call site.
 *
 * @param Component  — any function/class/forwardRef component
 * @param mapToProps — maps Controller's `field` + `fieldState` to a partial
 *                    set of the component's own props (value, onChange, ref, …)
 *
 * @returns A generic component `CreatedFormField<TFormData>` that accepts:
 *   - `name: Path<TFormData>`        — strictly typed field path
 *   - `control?: Control<TFormData>` — optional; falls back to FormProvider context
 *   - All FieldProps (label, hint, description, required, fieldClassName)
 *   - All remaining component props
 *
 * @example
 * ```tsx
 * export const SelectFormField = createFormField(
 *   Select,
 *   (field, fieldState) => ({
 *     value: field.value,
 *     onValueChange: field.onChange,
 *     triggerVariant: fieldState.invalid ? "error" : undefined,
 *   }),
 * );
 *
 * // with FormProvider (no control prop needed):
 * <SelectFormField<MyFormData> name="role" label="Role" options={opts} />
 *
 * // with explicit control:
 * <SelectFormField<MyFormData> name="role" control={control} label="Role" options={opts} />
 * ```
 */
export function createFormField<TComponentProps extends object>(
  Component:
    | React.ComponentType<TComponentProps>
    | React.ForwardRefExoticComponent<TComponentProps>,
  mapToProps: (
    field: ControllerRenderProps<FieldValues, string>,
    fieldState: ControllerFieldState,
  ) => Partial<TComponentProps>,
) {
  const C = Component as ComponentWithRef<TComponentProps>;

  function CreatedFormField<TFormData extends FieldValues>({
    name,
    control,
    label,
    hint,
    description,
    required,
    fieldClassName,
    ...componentProps
  }: {
    name: Path<TFormData>;
    /** Optional when using FormProvider. */
    control?: Control<TFormData>;
  } & FieldOwnProps &
    Partial<TComponentProps>): React.ReactElement {
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
          <C
            {...(componentProps as TComponentProps)}
            {...mapToProps(
              field as unknown as ControllerRenderProps<FieldValues, string>,
              fieldState,
            )}
          />
        )}
      />
    );
  }

  CreatedFormField.displayName = `${
    Component.displayName ?? Component.name ?? "Component"
  }FormField`;

  return CreatedFormField;
}
