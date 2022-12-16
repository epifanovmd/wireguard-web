import { isEqual } from "lodash";
import { makeAutoObservable } from "mobx";

import {
  isFunction,
  LambdaValueHelper,
  resolveLambdaValue,
} from "../../helpers";

type Validator<T> = (items: T[]) => string;

type Opts = {
  validateOnInit?: boolean;
};

export class ArrayHolder<T = any> {
  private opts: Opts = {};
  private _validate: Validator<T> | null = null;
  private _error: LambdaValueHelper<string> = "";
  private _initialValue: LambdaValueHelper<T[]> = [];
  private _value: LambdaValueHelper<T[]> = [];

  constructor(value?: LambdaValueHelper<T[]>, opt?: Opts) {
    makeAutoObservable(this, {}, { autoBind: true });
    if (value) {
      this._value = value;
      this._initialValue = () => [...resolveLambdaValue(value)];
    }

    this.opts = opt || {};

    if (opt?.validateOnInit) {
      this.setError(this._validate?.(this.value) ?? "");
    }
  }

  get error() {
    return resolveLambdaValue(this._error);
  }

  get value() {
    return resolveLambdaValue(this._value);
  }

  get isValid() {
    return !resolveLambdaValue(this._error);
  }

  setValue(value: LambdaValueHelper<T[]>) {
    this._value = value;
    this.validate();
  }

  remove(value: number | ((item: T) => boolean)) {
    if (isFunction(value)) {
      const _value = this.value.filter(value);

      this._value = () => _value;
    } else {
      const _value = this.value.filter((_item, index) => index !== value);

      this._value = () => _value;
    }
    this.validate();
  }

  push(value: LambdaValueHelper<T>) {
    const _value = resolveLambdaValue(value);
    const newValue = [...resolveLambdaValue(this._value), _value];

    this._value = () => newValue;
    this.validate();
  }

  onReplaceValue(value: LambdaValueHelper<T>, index: number) {
    const _value = resolveLambdaValue(value);
    const newValue = resolveLambdaValue(this._value).map((item, _index) =>
      _index === index ? _value : item,
    );

    this._value = () => newValue;
    this.validate();
  }

  setError(error: LambdaValueHelper<string>) {
    this._error = resolveLambdaValue(error);
  }

  setValidate(validator: Validator<T>) {
    this._validate = validator;
  }

  resetData() {
    this._value = () => [...(resolveLambdaValue(this._initialValue) || [])];
  }

  validate() {
    const error = this._validate?.(this.value) ?? "";

    this.setError(error);

    return error;
  }

  get isChanged() {
    const value = resolveLambdaValue(this._value);
    const initialValue = resolveLambdaValue(this._initialValue);

    if (value.length !== initialValue.length) {
      return true;
    }

    return isEqual(value, initialValue);
  }
}
