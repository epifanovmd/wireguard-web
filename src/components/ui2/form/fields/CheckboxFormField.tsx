import { Checkbox } from "../../checkbox";
import { createFormField } from "../createFormField";

/**
 * Checkbox wrapped as a typed FormField.
 *
 * Controller provides: checked, onCheckedChange, ref (focus-on-error), id, variant
 * You supply: size, disabled, indeterminate, …
 *
 * @example
 * ```tsx
 * // With FormProvider (no control prop):
 * <CheckboxFormField<SettingsForm> name="acceptTerms" label="I accept the terms" required />
 * ```
 */
export const CheckboxFormField = createFormField(
  Checkbox,
  (field, fieldState) => ({
    id: field.name,
    ref: field.ref,
    checked: Boolean(field.value) as boolean,
    onCheckedChange: field.onChange,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
