import { Textarea } from "../../textarea";
import { createFormField } from "../createFormField";

/**
 * Textarea wrapped as a typed FormField.
 *
 * Controller provides: value, onChange, onBlur, ref, id, variant
 * You supply: placeholder, rows, disabled, …
 *
 * @example
 * ```tsx
 * <TextareaFormField<MyForm> name="description" label="Description" rows={3} />
 * ```
 */
export const TextareaFormField = createFormField(
  Textarea,
  (field, fieldState) => ({
    id: field.name,
    ref: field.ref,
    value: (field.value ?? "") as string,
    onChange: field.onChange,
    onBlur: field.onBlur,
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
