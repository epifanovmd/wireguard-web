import { Switch } from "../../switch";
import { createFormField } from "../createFormField";

/**
 * Switch wrapped as a typed FormField.
 *
 * Controller provides: checked, onCheckedChange, ref (focus-on-error), id
 * You supply: size, variant, disabled, …
 *
 * @example
 * ```tsx
 * // With FormProvider (no control prop):
 * <SwitchFormField<SettingsForm>
 *   name="emailNotifications"
 *   label="Email notifications"
 *   description="Receive updates via email"
 * />
 * ```
 */
export const SwitchFormField = createFormField(Switch, (field) => ({
  id: field.name,
  ref: field.ref,
  checked: Boolean(field.value) as boolean,
  onCheckedChange: field.onChange,
}));
