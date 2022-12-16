import { makeAutoObservable } from "mobx";
import { cloneDeep, identity, isEqual, pickBy, toUpper } from "lodash";
import { ArrayHolder } from "./ArrayHolder";
import { TextHolder } from "./TextHolder";
import { NumberHolder } from "./NumberHolder";

type Opts = {};

type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Exclude<Base[Key], undefined> extends Condition
      ? never
      : Key;
  }[keyof Base]
>;

type ExtractFields<T> = SubType<T, TextHolder | NumberHolder | ArrayHolder>;

type Validation<T, V = ExtractFields<T>> = {
  [Key in keyof V]?: (value?: V[Key]) => string;
};

export type FormPartial<T> = {
  [K in keyof T]: T[K] extends FormHolder
    ? T[K]
    : T[K] extends TextHolder | NumberHolder | ArrayHolder
    ? T[K]
    : T[K] | undefined;
};

export class FormHolder<T extends object = object> {
  isLoading: boolean = false;
  loaded: boolean = false;

  private opts: Opts = {};
  private _validate: Validation<T> = {};
  private _errors: Partial<Record<keyof T, string>> = {};
  private _initialValue: FormPartial<T> = {} as FormPartial<T>;
  private _value: FormPartial<T> = {} as FormPartial<T>;

  constructor(initialValue: FormPartial<T>, opts?: Opts) {
    makeAutoObservable(this, {}, { autoBind: true });

    this._initialValue = cloneDeep(initialValue);
    this._value = cloneDeep(initialValue);
    this.opts = opts || {};
  }

  get fields() {
    return this._value;
  }

  get isValid() {
    let _isValid: boolean = true;
    const fields = this.fields;

    // eslint-disable-next-line guard-for-in
    for (const key in fields) {
      const field = fields[key];

      if (fields.hasOwnProperty(key) && this._isNotPrimitive(field)) {
        if (!field.isValid) {
          _isValid = false;
          break;
        }
      }
    }

    return Object.keys(pickBy(this._errors, identity)).length === 0 && _isValid;
  }

  setValue<K extends keyof T>(name: K, value: T[K]) {
    this.setError(name, this._validate[name]?.(value));
    this._value[name] = value;
  }

  reset(value?: FormPartial<T>) {
    if (value) {
      this._value = cloneDeep(value);
      this._initialValue = cloneDeep(value);
    } else {
      this._value = cloneDeep(this._initialValue);
    }

    this.validate();
  }

  setError(name: keyof T, error?: string) {
    const field = this.fields[name];

    if (error && this._isNotPrimitive(field)) {
      field.setError(error);
    } else {
      this._errors[name] = error;
    }
  }

  get errors() {
    const errors = { ...this._errors };
    const fields = this.fields;

    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const field = fields[key];

        if (this._isNotPrimitive(field)) {
          errors[key] = field.error;
        }
      }
    }

    return errors;
  }

  setValidate(validator: Validation<T>) {
    this._validate = validator;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setLoaded(loaded: boolean) {
    this.loaded = loaded;
  }

  validate() {
    const fields = this.fields;

    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const name: keyof T = key as keyof T;

        const field = this.fields[name];

        if (this._isNotPrimitive(field)) {
          this.setError(name, field.validate());
        } else {
          const validate = this._validate[name as keyof Validation<T>];

          this.setError(
            name,
            validate?.(field as FormPartial<T>[keyof Validation<T>]),
          );
        }
      }
    }
  }

  get isChanged() {
    let _changed = false;
    const fields = this.fields;

    // eslint-disable-next-line guard-for-in
    for (const key in fields) {
      const name: keyof T = key as keyof T;
      const field = this.fields[name];

      if (this._isNotPrimitive(field)) {
        if (field.isChanged) {
          _changed = true;
        }
      } else if (!isEqual(field, this._initialValue[name])) {
        _changed = true;
      }

      if (_changed) {
        break;
      }
    }

    return _changed;
  }

  private _isNotPrimitive(
    field: any,
  ): field is TextHolder | NumberHolder | ArrayHolder {
    return (
      field instanceof TextHolder ||
      field instanceof NumberHolder ||
      field instanceof ArrayHolder
    );
  }
}

// const form = new FormHolder<{
//   string: string;
//   number: number;
//   array: ArrayHolder<{ a: number; b: string }>;
//   textField: TextHolder;
// }>(
//   {
//     string: undefined,
//     number: undefined,
//     array: new ArrayHolder(),
//     textField: new TextHolder(),
//   },
//   {},
// );
//
// form.setValidate({
//   // нужно исключить все ключи у которых значение является не примитивным типом (FormField, ArrayField, TextField)
//   number: value => (value && value > 5 ? "Значение Больше 5" : ""),
//   string: value => (value && value.length > 5 ? "Больше 5" : ""),
// });
//
// form.fields.textField.setValidate(value =>
//   value !== "123" ? "Значение не равно 123" : "",
// );
//
// form.fields.array.setValidate(value =>
//   value.length > 3 ? "длинна массива больше 3" : "",
// );
//
// form.fields.array.push({ a: 1, b: "3333" });
// form.fields.array.onReplaceValue({ a: 1, b: "3333" }, 0);
//
// form.fields.textField.setValue("12344");
