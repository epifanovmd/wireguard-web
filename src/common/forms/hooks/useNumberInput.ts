import { stringToNumber } from "@force-dev/utils";

import { IFieldOptions, useField } from "./useField";

export const useNumberInput = (opts?: IFieldOptions<number>) => {
  const field = useField<number>(opts);

  return {
    ...field,
    setValue: (value: number) => {
      field.setValue(stringToNumber(value));
    },
  };
};
