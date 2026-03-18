import { DatePicker } from "../../date-picker";
import { createFormField } from "../createFormField";

/**
 * DatePicker wrapped as a typed FormField.
 * Stores a `Date | undefined` value in the form.
 *
 * @example
 * ```tsx
 * <DatePickerFormField<MyForm> name="birthDate" label="Дата рождения" clearable />
 * ```
 */
export const DatePickerFormField = createFormField(
  DatePicker,
  (field, fieldState) => ({
    value: field.value as Date | undefined,
    onChange: field.onChange,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
