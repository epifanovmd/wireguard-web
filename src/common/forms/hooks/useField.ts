import { isEqual } from "lodash";
import { useEffect, useState } from "react";

import { Maybe } from "../../helpers";

export interface IFieldOptions<T = string> {
  initialValue?: T;
  label?: string;
  placeholder?: string;

  validate?: (value?: T) => string;
  transform?: (value?: T) => T;
}

export interface Field<T> {
  label?: string;
  placeholder?: string;
  value?: T;
  error?: string;

  isValid: boolean;
  isChanged: boolean;

  setLabel(value: string): void;
  setPlaceholder(value: string): void;
  setValue(value: T): void;
  setError(value: string): void;
}

export const useField = <T = string>(opts?: IFieldOptions<T>): Field<T> => {
  const [label, setLabel] = useState<Maybe<string>>(opts?.label);
  const [placeholder, setPlaceholder] = useState<Maybe<string>>(
    opts?.placeholder,
  );

  const [value, setValue] = useState<Maybe<T>>(opts?.initialValue);
  const [error, setError] = useState<Maybe<string>>();

  useEffect(() => {
    if (opts?.validate) {
      setError(opts.validate(value));
    }

    if (opts?.transform) {
      setValue(opts.transform(value));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    label,
    placeholder,
    value,
    error,

    isValid: !error && !!value,
    isChanged: Boolean(
      opts?.initialValue && !isEqual(opts?.initialValue, value),
    ),

    setLabel,
    setPlaceholder,
    setValue,
    setError,
  };
};
