import { makeAutoObservable, when } from "mobx";

import { LambdaValueHelper, Maybe, resolveLambdaValue } from "../../helpers";

export class PropsHolder<T> {
  _value: LambdaValueHelper<Maybe<T>>;
  _isActive: LambdaValueHelper<boolean>;

  constructor(
    value: LambdaValueHelper<Maybe<T>> = undefined,
    isActive: LambdaValueHelper<boolean> = false,
  ) {
    this._value = value;
    this._isActive = isActive;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setValue(value: LambdaValueHelper<T>) {
    this._value = value;
  }

  public setActive(isActive: LambdaValueHelper<boolean> = false) {
    this._isActive = isActive;
  }

  public get value() {
    return resolveLambdaValue(this._value);
  }

  public get isActive() {
    return resolveLambdaValue(this._isActive);
  }

  public whenChanged() {
    const value = this.value;

    return when(() => this.value !== value);
  }
}
