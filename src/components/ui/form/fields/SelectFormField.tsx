import { Select } from "../../select";
import { createFormField } from "../createFormField";

/**
 * Select wrapped as a typed FormField.
 *
 * Controller provides: value, onValueChange, onOpenChange (blur), triggerVariant
 * You supply: options, placeholder, triggerSize, clearable, disabled, loading, …
 *
 * @example
 * ```tsx
 * // With FormProvider (no control prop):
 * <SelectFormField<CreateUserForm>
 *   name="role"
 *   label="Role"
 *   description="Access level for this user"
 *   required
 *   options={[{ value: "admin", label: "Administrator" }]}
 * />
 * ```
 */
export const SelectFormField = createFormField(
  Select,
  (field, fieldState) => ({
    value: field.value as string | undefined,
    onValueChange: (v: string) => field.onChange(v),
    onClear: () => field.onChange(undefined),
    onOpenChange: (open: boolean) => {
      if (!open) field.onBlur();
    },
    triggerVariant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
