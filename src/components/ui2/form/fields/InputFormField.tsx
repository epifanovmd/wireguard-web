import { Input } from "../../input";
import { createFormField } from "../createFormField";

/**
 * Input wrapped as a typed FormField.
 *
 * Controller provides: value, onChange, onBlur, ref (focus-on-error), id, variant
 * You supply: placeholder, type, size, leftIcon, rightIcon, clearable, disabled, …
 *
 * @example
 * ```tsx
 * // With FormProvider (no control prop):
 * <InputFormField<LoginForm> name="email" label="Email" placeholder="user@example.com" type="email" required />
 *
 * // With explicit control:
 * <InputFormField<LoginForm> name="email" control={control} label="Email" />
 * ```
 */
export const InputFormField = createFormField(
  Input,
  (field, fieldState) => ({
    id: field.name,
    ref: field.ref,
    value: (field.value ?? "") as string,
    onChange: field.onChange,
    onBlur: field.onBlur,
    onClear: () => field.onChange(""),
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
