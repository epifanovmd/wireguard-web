import { Select } from "../../select";
import { createFormField } from "../createFormField";

export const SelectFormField = createFormField(
  Select,
  (field, fieldState) => ({
    value: (field.value as string | null | undefined) ?? null,
    clearable: true as const,
    onChange: (v: string | null) => field.onChange(v ?? undefined),
    onOpenChange: (open: boolean) => {
      if (!open) field.onBlur();
    },
    variant: fieldState.invalid ? ("error" as const) : undefined,
  }),
);
