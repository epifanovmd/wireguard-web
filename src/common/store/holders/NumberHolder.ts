import { makeAutoObservable } from "mobx";

import { LambdaValueHelper, resolveLambdaValue } from "../../helpers";

const textToNumber = (value: LambdaValueHelper<string> = () => "") => {
  const text = resolveLambdaValue(value);

  return +text.replace(/[^0-9]+/g, "");
};

type Opts = {
  initialValue?: LambdaValueHelper<number>;
  validateOnInit?: boolean;
};

export class NumberHolder {
  private opts?: Opts;
  private _validate: ((text: number | undefined) => string) | null = null;
  private _error: LambdaValueHelper<string> = "";
  private _placeholder: LambdaValueHelper<string> = "";
  private _initialValue: LambdaValueHelper<number | undefined>;
  private _value: LambdaValueHelper<number | undefined>;

  constructor(opts?: Opts) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.opts = opts;
    if (opts?.initialValue) {
      this._value = opts?.initialValue;
      this._initialValue = opts?.initialValue;
    }
    if (opts?.validateOnInit) {
      this.setError(this._validate?.(this.value) ?? "");
    }
  }

  get error() {
    return resolveLambdaValue(this._error);
  }

  get placeholder() {
    return resolveLambdaValue(this._placeholder);
  }

  get value() {
    return resolveLambdaValue(this._value);
  }

  get isValid() {
    return !resolveLambdaValue(this._error);
  }

  resetData() {
    this._value = this._initialValue;
  }

  onChangeText(text: LambdaValueHelper<string>) {
    this._value = () => textToNumber(text);
    this.validate();
  }

  setValue(text: LambdaValueHelper<number>) {
    this._value = text;
    this.validate();
  }

  setPlaceholder(text: LambdaValueHelper<string>) {
    this._placeholder = resolveLambdaValue(text);
  }

  setError(error: LambdaValueHelper<string>) {
    this._error = resolveLambdaValue(error);
  }

  setValidate(validator: ((text: number | undefined) => string) | null) {
    this._validate = validator;
  }

  validate() {
    const error = this._validate?.(this.value) ?? "";

    this.setError(error);

    return error;
  }

  get isChanged() {
    return (
      resolveLambdaValue(this._value) !== resolveLambdaValue(this._initialValue)
    );
  }
}
