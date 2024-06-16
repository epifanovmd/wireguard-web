import { IFieldOptions, useField } from "./useField";

export const useTextInput = (opts?: IFieldOptions) => {
  const field = useField<string>(opts);

  return { ...field };
};
